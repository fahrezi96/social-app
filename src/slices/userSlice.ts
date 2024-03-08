import { createSlice } from '@reduxjs/toolkit';
import { UserAuth, emptyUser } from '../services/global';

const initialState: { data: UserAuth } = {
  data: localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') || '') : emptyUser,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, data) {
      state.data = data.payload;
      localStorage.setItem('data', JSON.stringify(data.payload));
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
