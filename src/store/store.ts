import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice/authSlice';
import uiReducer from '../features/auth/slice/uiSlice';
import ownerReducer from '../features/user/slice/ownerSlice';
import { authApi } from '../features/auth/api/authAPI';
import { userApi } from '../features/user/api/userAPI';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    owner: ownerReducer,

    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
