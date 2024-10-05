import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/api";

export const fetchLessonReservations = createAsyncThunk(
  "calendar/fetchLessonReservations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/lessonReservations");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateLessonReservation = createAsyncThunk(
  "calendar/updateLessonReservation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch("/lessonReservations", data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createLessonReservation = createAsyncThunk(
  "calendar/createLessonReservation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/lessonReservations`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteLessonReservation = createAsyncThunk(
  "calendar/deleteLessonReservation",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/lessonReservations/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
