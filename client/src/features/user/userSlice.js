import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileAPI, updateProfileAPI, uploadAvatarAPI, getDashboardAPI } from "./userApi.js";

export const fetchProfile = createAsyncThunk("user/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await getProfileAPI();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch profile.");
  }
});

export const updateProfile = createAsyncThunk("user/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const res = await updateProfileAPI(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update profile.");
  }
});

export const uploadAvatar = createAsyncThunk("user/uploadAvatar", async (formData, { rejectWithValue }) => {
  try {
    const res = await uploadAvatarAPI(formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to upload avatar.");
  }
});

export const fetchDashboard = createAsyncThunk("user/fetchDashboard", async (_, { rejectWithValue }) => {
  try {
    const res = await getDashboardAPI();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch dashboard.");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    dashboard: null,
    loading: false,
    updateLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearUserMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => { state.updateLoading = true; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = action.payload.user;
        state.successMessage = "Profile updated successfully!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // Upload avatar
    builder
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.profile) state.profile.avatar = action.payload.avatar;
        state.successMessage = "Avatar updated!";
      });

    // Dashboard
    builder
      .addCase(fetchDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.dashboard;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserMessages } = userSlice.actions;
export default userSlice.reducer;
