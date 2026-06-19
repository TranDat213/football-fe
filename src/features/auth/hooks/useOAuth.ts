import { useOauthMutation } from '../api/authAPI';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUser } from '../slice/authSlice';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/route.constants';

/** Minimal shape returned by Google Identity Services credential callback. */
interface GoogleCredentialResponse {
  credential: string; // base64url-encoded JWT
}

/** Decode a Google JWT (no verification needed — trust from GSI). */
function decodeGoogleJwt(token: string): { email: string; sub: string } {
  const payload = token.split('.')[1];
  const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  return { email: json.email as string, sub: json.sub as string };
}

export function useOAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [oauthMutate, { isLoading }] = useOauthMutation();

  /**
   * Called by the Google Identity Services callback once the user picks
   * an account. Sends the decoded credentials to the backend.
   */
  const handleGoogleCallback = async (response: GoogleCredentialResponse) => {
    try {
      const { email, sub: providerId } = decodeGoogleJwt(response.credential);

      const res = await oauthMutate({
        email,
        provider: 'GOOGLE',
        providerId,
      }).unwrap();

      dispatch(setUser(res.data.user));
      toast.success('Đăng nhập với Google thành công!');
      router.push(ROUTES.home);
    } catch (err: any) {
      const message =
        err?.data?.message ?? 'Đăng nhập với Google thất bại. Vui lòng thử lại.';
      toast.error(message);
    }
  };

  return { handleGoogleCallback, isLoading };
}
