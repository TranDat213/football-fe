import { useRouter } from "next/navigation";
import { useOwnerRegisterMutation } from "../api/userAPI";
import { useState } from "react";
import { OwnerRegisterFormData } from "../schema/user.schema";
import { toast } from "sonner";
import { ROUTES } from "@/lib/route.constants";


export function useOwnerRegister() {
    const router = useRouter();
    const [ownerRegister, { isLoading }] = useOwnerRegisterMutation();

    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const registerOwner = async (data: OwnerRegisterFormData) => {
        try {
            setError(null);
            setFieldErrors({});
            const res = await ownerRegister(data).unwrap();
            console.log(res);
            toast.success('Đăng ký thành công!');
            router.push(ROUTES.ownerRegister);
        } catch (err: any) {
            // Nếu backend trả về validation errors
            if (err?.data?.errors) {
                setFieldErrors(err.data.errors);
            }

            const message =
                err?.data?.message ?? 'Gửi đơn đăng ký thất bại. Vui lòng thử lại.';

            setError(message);
            toast.error(message);
        }
    };

    return {
        registerOwner,
        isLoading,
        error,
        fieldErrors,
    };
}