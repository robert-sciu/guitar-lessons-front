import { createAsyncThunk } from "@reduxjs/toolkit";
const api_url = import.meta.env.VITE_API_BASE_URL;

export const fetchAvailableTasks = createAsyncThunk(
  "dashboardAvailableTasksPage/fetchAvailableTasks",
  async () => {
    const response = await fetch(`${api_url}/api/tasks`);
    const data = await response.json();
    return data;
  }
);
