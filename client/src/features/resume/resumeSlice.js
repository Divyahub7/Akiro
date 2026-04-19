import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  uploadResumeAPI,
  analyzeResumeAPI,
  getUserResumesAPI,
  getResumeByIdAPI,
  deleteResumeAPI,
} from "./resumeApi.js";

export const uploadResume = createAsyncThunk("resume/upload", async (formData, { rejectWithValue }) => {
  try {
    const res = await uploadResumeAPI(formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Upload failed.");
  }
});

export const analyzeResume = createAsyncThunk("resume/analyze", async (id, { rejectWithValue }) => {
  try {
    const res = await analyzeResumeAPI(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Analysis failed.");
  }
});

export const fetchUserResumes = createAsyncThunk("resume/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await getUserResumesAPI();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch resumes.");
  }
});

export const fetchResumeById = createAsyncThunk("resume/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const res = await getResumeByIdAPI(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch resume.");
  }
});

export const deleteResume = createAsyncThunk("resume/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteResumeAPI(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Delete failed.");
  }
});

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    resumes: [],
    activeResume: null,
    uploading: false,
    analyzing: false,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearResumeMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setActiveResume: (state, action) => {
      state.activeResume = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => { state.uploading = true; state.error = null; })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.uploading = false;
        state.resumes.unshift(action.payload.resume);
        state.activeResume = action.payload.resume;
        state.successMessage = "Resume uploaded! Click Analyze to get AI feedback.";
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      });

    builder
      .addCase(analyzeResume.pending, (state) => { state.analyzing = true; state.error = null; })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.analyzing = false;
        state.activeResume = action.payload.resume;
        const idx = state.resumes.findIndex((r) => r._id === action.payload.resume._id);
        if (idx !== -1) state.resumes[idx] = action.payload.resume;
        state.successMessage = "Analysis complete!";
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.analyzing = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchUserResumes.pending, (state) => { state.loading = true; })
      .addCase(fetchUserResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload.resumes;
      })
      .addCase(fetchUserResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.activeResume = action.payload.resume;
      });

    builder
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r._id !== action.payload);
        if (state.activeResume?._id === action.payload) state.activeResume = null;
        state.successMessage = "Resume deleted.";
      });
  },
});

export const { clearResumeMessages, setActiveResume } = resumeSlice.actions;
export default resumeSlice.reducer;
