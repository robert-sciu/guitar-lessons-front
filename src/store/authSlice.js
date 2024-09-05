import apiClient from "../api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/login", { email, password });
      console.log(response);
      const { token } = response.data.data;
      localStorage.setItem("access_token", token);
      return token;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("access_token");
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    hasError: false,
    isAuthenticated: false,
    token: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        managePendingState(state);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.isAuthenticated = true;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        manageRejectedState(state);
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(logoutUser.pending, (state) => {
        managePendingState(state);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        manageFulfilledState(state);
        state.isAuthenticated = false;
        state.token = null;
      });
  },
});

export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
