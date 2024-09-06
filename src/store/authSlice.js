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
      const response = await apiClient.post("/auth/login", { email, password });
      const { token } = response.data.data;
      localStorage.setItem("access_token", token);
      return token;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyStoredToken = createAsyncThunk(
  "auth/verifyStoredToken",
  async ({ token }, { rejectWithValue }) => {
    try {
      if (token) {
        const response = await apiClient.post("/auth/verifyToken", { token });
        if (response.status === 200) {
          return token;
        }
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("access_token");
  await apiClient.post("/auth/logout");
  return null;
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
      .addCase(verifyStoredToken.pending, (state) => {
        managePendingState(state);
      })
      .addCase(verifyStoredToken.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.isAuthenticated = true;
        state.token = action.payload;
      })
      .addCase(verifyStoredToken.rejected, (state) => {
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

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;
