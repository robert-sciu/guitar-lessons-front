import apiClient from "../api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  extractErrorResponse,
  extractResponseData,
  manageFulfilledState,
  managePendingState,
  manageRejectedState,
} from "../utilities/reduxUtilities";
import store from ".";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/open/auth/login", {
        email,
        password,
      });
      const { token } = extractResponseData(response);
      localStorage.setItem("access_token", token);
      return extractResponseData(response);
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

export const verifyStoredToken = createAsyncThunk(
  "auth/verifyStoredToken",
  async ({ token, isAdmin = false }, { rejectWithValue }) => {
    try {
      if (token) {
        const response = await apiClient.post(
          `${isAdmin ? "/admin" : ""}/auth/verifyToken`,
          {
            token,
          }
        );
        if (response.status === 200) {
          return extractResponseData(response);
        }
      }
    } catch (error) {
      return rejectWithValue(extractErrorResponse(error));
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "/open/auth/logoutUser",
  async () => {
    localStorage.removeItem("access_token");
    await apiClient.post("/open/auth/logout");
    store.dispatch(clearToken());
    return null;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    hasError: false,
    error: null,
    isAuthenticated: false,
    tokenVerificationComplete: false,
    token: localStorage.getItem("access_token"),
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
    setTokenVerificationComplete: (state) => {
      state.tokenVerificationComplete = true;
    },
    clearAuthError: (state) => {
      state.hasError = false;
      state.error = null;
      state.tokenVerificationComplete = false;
      localStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        managePendingState(state);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        manageFulfilledState(state);
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.tokenVerificationComplete = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.isAuthenticated = false;
      })
      .addCase(verifyStoredToken.pending, (state) => {
        managePendingState(state);
      })
      .addCase(verifyStoredToken.fulfilled, (state) => {
        manageFulfilledState(state);
        state.isAuthenticated = true;
        state.tokenVerificationComplete = true;
      })
      .addCase(verifyStoredToken.rejected, (state, action) => {
        manageRejectedState(state, action);
        state.isAuthenticated = false;
        state.token = null;
        state.tokenVerificationComplete = true;
      })
      .addCase(logoutUser.pending, (state) => {
        managePendingState(state);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        manageFulfilledState(state);
        state.isAuthenticated = false;
        state.tokenVerificationComplete = true;
        state.token = null;
      });
  },
});

export const selectAuthAuthenticationStatus = (state) =>
  state.auth.isAuthenticated;
export const selectAuthLoadingState = (state) => state.auth.isLoading;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthTokenVerificationStatus = (state) =>
  state.auth.tokenVerificationComplete;
export const selectAuthErrorStatus = (state) => state.auth.hasError;
export const selectAuthErrorMessage = (state) => state.auth.error;

export const {
  setToken,
  clearToken,
  setTokenVerificationComplete,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
