// src/features/auth/hooks/useLogout.ts

import { useRouter } from "next/navigation";
import { authApi, useLogoutMutation } from "../api/authAPI";
import { useDispatch } from "react-redux";
import { clearAuth } from "../slice/authSlice";
import { userApi } from "@/features/user/api/userAPI";
import { bookingApi } from "@/features/booking/api/bookingAPI";
import { pitchApi } from "@/features/pitch/api/pitchAPI";
import { adminApi } from "@/features/admin/api/admin.api";
import { adminPaymentApi } from "@/features/admin/api/adminPaymentAPI";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.log("Logout error:", error);
      // Vẫn tiếp tục clear local state kể cả khi API logout lỗi
      // (ví dụ token đã hết hạn từ trước)
    } finally {
      dispatch(clearAuth());

      // Reset cache của TẤT CẢ API slice, không riêng userApi
      dispatch(authApi.util.resetApiState());
      dispatch(userApi.util.resetApiState());
      dispatch(bookingApi.util.resetApiState());
      dispatch(pitchApi.util.resetApiState());
      dispatch(adminApi.util.resetApiState());
      dispatch(adminPaymentApi.util.resetApiState());

      router.push("/login");
    }
  };

  return { handleLogout };
};