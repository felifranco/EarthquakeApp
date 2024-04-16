import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import configurations from "../../config/configurations";

const endpoint = "features";

const initialState = {
  isLoading: false,
  isError: false,
  reloadList: false,
  features: [],
  pagination: {
    current_page: 1,
    per_page: 1,
    total: 1,
  },
};

export const getFeatures = createAsyncThunk(
  "getFeatures",
  async ({ per_page = -1, page = -1, mag_type = null }) => {
    let filters = "";
    if (per_page != -1) {
      filters += `per_page=${per_page}&`;
    }
    if (page != -1) {
      filters += `page=${page}&`;
    }
    if (mag_type && mag_type != "") {
      filters += `mag_type=${mag_type}&`;
    }
    const res = await fetch(
      `${configurations.FEATURES_BACKEND}/${endpoint}?${filters}`
    );
    return res?.json();
  }
);

export const earthquakeSlice = createSlice({
  name: "earthquake",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFeatures.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFeatures.fulfilled, (state, action) => {
      state.isLoading = false;
      state.features = action.payload.data;
      state.pagination = action.payload.pagination;
      state.reloadList = false;
    });
    builder.addCase(getFeatures.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export default earthquakeSlice.reducer;
