import { AuthTokens } from "@/types/auth.types";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const authTokenService ={
    /** Lưu tokens vào localStorage (client-side only) */
    persistTokens(tokens: AuthTokens): void {
        if (typeof window === "undefined") return;
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    },
    /** Lấy access token */
    getAccessToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },
    /** Lấy refresh token */
    getRefreshToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },
    /** Xóa tokens khỏi localStorage */
    clearTokens(): void {
        if (typeof window === "undefined") return;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
    /** Kiểm tra xem đã đăng nhập chưa */
    hasTokens(): boolean {
        return !!this.getAccessToken();
    }
}