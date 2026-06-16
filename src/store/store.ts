import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import uiReducer from './slice/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
