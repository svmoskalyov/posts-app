import { createSlice } from "@reduxjs/toolkit";

const state = {
  userId: null,
  name: null,
  photo: null,
  stateChange: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      ...payload,
    }),

    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authSingOut: () => state,
  },
});

export const { updateUserProfile, authStateChange, authSingOut } =
  authSlice.actions;
export default authSlice.reducer;
