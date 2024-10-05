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
