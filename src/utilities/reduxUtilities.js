export function managePendingState(state) {
  state.isLoading = true;
  state.hasError = false;
}

export function manageFulfilledState(state) {
  state.isLoading = false;
  state.hasError = false;
}

export function manageRejectedState(state, action) {
  state.isLoading = false;
  state.hasError = true;
  state.error = action.payload;
}

export function extractResponseData(response) {
  return response?.data?.data || response?.data?.message || "empty response";
}

export function extractErrorResponse(error) {
  return error?.response?.data?.message || error.message || "unknown error";
}
