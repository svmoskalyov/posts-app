import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: [],
  reducers: {
    updatePosts: (state, { payload }) => {
      return payload;
    },
    updatePostById: (state, { payload }) => {
      const index = state.findIndex(({ id }) => id === payload.id);
      state[index] = { ...state[index], ...payload };
    },
  },
});

export const { updatePosts, updatePostById } = postSlice.actions;
export default postSlice.reducer;
