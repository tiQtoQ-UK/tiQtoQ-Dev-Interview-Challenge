import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ChangeRiskAnalysis, ChangeRiskResponse } from "@dev-interview-challenge/shared/types";

import { httpRequest } from "../services/httpRequest";

type AnalyseChangeState = {
  analysis: ChangeRiskAnalysis | null;
  description: string | null;
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: AnalyseChangeState = {
  analysis: null,
  description: null,
  error: null,
  status: "idle"
};

export const analyseChange = createAsyncThunk<
  ChangeRiskAnalysis,
  { description: string },
  { rejectValue: string }
>("analyseChange/analyse", async ({ description }, { rejectWithValue }) => {
  try {
    const payload = await httpRequest.post<Partial<ChangeRiskResponse>, { description: string }>(
      "/analyse-change",
      { description }
    );

    if (!payload.analysis) {
      return rejectWithValue("The API returned an unexpected response.");
    }

    return payload.analysis;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Unable to analyse the change.");
  }
});

const analyseChangeSlice = createSlice({
  name: "analyseChange",
  initialState,
  reducers: {
    clearAnalysis(state) {
      state.analysis = null;
      state.description = null;
      state.error = null;
      state.status = "idle";
    },
    setAnalysis(state, action: PayloadAction<ChangeRiskAnalysis>) {
      state.analysis = action.payload;
      state.error = null;
      state.status = "succeeded";
    },
    setAnalysisError(state, action: PayloadAction<string>) {
      state.analysis = null;
      state.description = null;
      state.error = action.payload;
      state.status = "failed";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyseChange.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(analyseChange.fulfilled, (state, action) => {
        state.analysis = action.payload;
        state.description = action.meta.arg.description;
        state.error = null;
        state.status = "succeeded";
      })
      .addCase(analyseChange.rejected, (state, action) => {
        state.analysis = null;
        state.error = action.payload ?? "Unable to analyse the change.";
        state.status = "failed";
      });
  }
});

export const { clearAnalysis, setAnalysis, setAnalysisError } = analyseChangeSlice.actions;
export const analyseChangeReducer = analyseChangeSlice.reducer;
