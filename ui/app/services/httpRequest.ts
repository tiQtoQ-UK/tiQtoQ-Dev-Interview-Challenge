import type { ApiErrorResponse } from "@dev-interview-challenge/shared/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const REQUEST_TIMEOUT_MS = 10_000;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestConfig = {
  method: HttpMethod;
  path: string;
  headers: HeadersInit;
  body?: BodyInit;
};

type ResponseConfig = {
  response: Response;
  data: unknown;
};

type RequestInterceptor = (
  config: RequestConfig,
) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (
  config: ResponseConfig,
) => ResponseConfig | Promise<ResponseConfig>;

const requestInterceptors: RequestInterceptor[] = [
  (config) => ({
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
  }),
];

const responseInterceptors: ResponseInterceptor[] = [
  ({ response, data }) => {
    if (!response.ok) {
      const errorMessage = isApiErrorResponse(data)
        ? data.error
        : `Request failed with status ${response.status}.`;

      throw new HttpRequestError(errorMessage, response.status, data);
    }

    return { response, data };
  },
];

export const httpRequest = {
  interceptors: {
    request: {
      use(interceptor: RequestInterceptor) {
        requestInterceptors.push(interceptor);
      },
    },
    response: {
      use(interceptor: ResponseInterceptor) {
        responseInterceptors.push(interceptor);
      },
    },
  },

  get: <TResponse>(path: string) =>
    sendRequest<TResponse>({
      method: "GET",
      path,
      headers: {},
    }),

  post: <TResponse, TBody>(path: string, body: TBody) =>
    sendRequest<TResponse>({
      method: "POST",
      path,
      headers: {},
      body: JSON.stringify(body),
    }),
};

export class HttpRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly data: unknown,
  ) {
    super(message);
    this.name = "HttpRequestError";
  }
}

async function sendRequest<TResponse>(
  initialConfig: RequestConfig,
): Promise<TResponse> {
  const config = await applyRequestInterceptors(initialConfig);
  const abortController = new AbortController();
  const timeoutId = window.setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${config.path}`, {
      method: config.method,
      headers: config.headers,
      body: config.body,
      signal: abortController.signal,
    });
    const data = await parseResponse(response);
    const result = await applyResponseInterceptors({ response, data });

    return result.data as TResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new HttpRequestError("The API request timed out. Please check that the API is running.", 408, null);
    }

    if (error instanceof TypeError) {
      throw new HttpRequestError("Unable to reach the API. Please make sure it is running on http://localhost:4000.", 0, null);
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function applyRequestInterceptors(
  config: RequestConfig,
): Promise<RequestConfig> {
  let nextConfig = config;

  for (const interceptor of requestInterceptors) {
    nextConfig = await interceptor(nextConfig);
  }

  return nextConfig;
}

async function applyResponseInterceptors(
  config: ResponseConfig,
): Promise<ResponseConfig> {
  let nextConfig = config;

  for (const interceptor of responseInterceptors) {
    nextConfig = await interceptor(nextConfig);
  }

  return nextConfig;
}

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new HttpRequestError(
      "The API returned an invalid JSON response.",
      response.status,
      text,
    );
  }
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  );
}
