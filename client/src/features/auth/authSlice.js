import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerAPI, loginAPI, verifyMfaAPI } from "./authApi.js";

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const registerUser = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await registerAPI(data);
    localStorage.setItem("akiro_token", res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed.");
  }
});

export const loginUser = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await loginAPI(data);
    if (res.data.token) localStorage.setItem("akiro_token", res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed.");
  }
});

export const verifyMFA = createAsyncThunk("auth/verifyMfa", async (data, { rejectWithValue }) => {
  try {
    const res = await verifyMfaAPI(data);
    localStorage.setItem("akiro_token", res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "MFA verification failed.");
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────
const initialState = {
  user: null,
  token: localStorage.getItem("akiro_token") || null,
  isAuthenticated: !!localStorage.getItem("akiro_token"),
  loading: false,
  error: null,
  mfaRequired: false,
  mfaUserId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("akiro_token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.mfaRequired = false;
      state.mfaUserId = null;
    },
    setOAuthUser: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.mfaRequired) {
          state.mfaRequired = true;
          state.mfaUserId = action.payload.userId;
        } else {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // MFA Verify
    builder
      .addCase(verifyMFA.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyMFA.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.mfaRequired = false;
        state.mfaUserId = null;
      })
      .addCase(verifyMFA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setOAuthUser, clearError } = authSlice.actions;
export default authSlice.reducer;
