export function managePendingState(state) {
  state.isLoading = true;
  state.hasError = true;
}

export function manageFulfilledState(state) {
  state.isLoading = false;
  state.hasError = false;
}

export function manageRejectedState(state) {
  state.isLoading = false;
  state.hasError = true;
}
