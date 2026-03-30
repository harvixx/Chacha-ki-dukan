import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../../app/store/slices/authSlice";
import { api } from "../../../api/axios.api";

export const useVerifyEmail = () => {
    const [status, setStatus] = useState("loading");

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const verify = async () => {
            try {
                const token = searchParams.get("token");

                if (!token) {
                    setStatus("error");
                    return;
                }

                await api.get(`/auth/verify-email?token=${token}`);

                // 🔥 user now logged in → fetch real user
                await dispatch(fetchUser()).unwrap();

                setStatus("success");

                setTimeout(() => {
                    navigate("/");
                }, 2000);

            } catch (err) {
                setStatus(err);
            }
        };

        verify();
    }, []);

    return {
        status, // loading | success | error
    };
};