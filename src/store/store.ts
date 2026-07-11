import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice/authSlice';
import uiReducer from '../features/auth/slice/uiSlice';
import ownerReducer from '../features/user/slice/ownerSlice';
import { authApi } from '../features/auth/api/authAPI';
import { userApi } from '../features/user/api/userAPI';
import { bookingApi } from '../features/booking/api/bookingAPI';
import { pitchApi } from '../features/pitch/api/pitchAPI';
import { adminApi } from '@/features/admin/api/admin.api';
import { adminPaymentApi } from '@/features/admin/api/adminPaymentAPI';
import { casualMatchApi } from '@/features/casual-match/api/casualMatch.api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    owner: ownerReducer,

    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [pitchApi.reducerPath]: pitchApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [adminPaymentApi.reducerPath]: adminPaymentApi.reducer,
    [casualMatchApi.reducerPath]: casualMatchApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      userApi.middleware, 
      bookingApi.middleware,
      pitchApi.middleware,
      adminApi.middleware,
      adminPaymentApi.middleware,
      casualMatchApi.middleware,
    ),
});

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

