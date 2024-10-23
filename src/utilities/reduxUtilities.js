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

export function downloadFile(fileBlob, filename) {
  const downloadUrl = window.URL.createObjectURL(fileBlob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;

  // Append, click, and remove the link element
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke the object URL to free memory
  window.URL.revokeObjectURL(downloadUrl);
}
