// src/features/auth/hooks/useLogout.ts

import { useRouter } from "next/navigation";
import { useLogoutMutation } from "../api/authAPI";
import { useDispatch } from "react-redux";
import { clearAuth } from "../slice/authSlice";
import { userApi } from "@/features/user/api/userAPI";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      dispatch(clearAuth());
      dispatch(userApi.util.resetApiState());

      router.push("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return { handleLogout };
};