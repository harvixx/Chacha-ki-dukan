import { api } from "../../../api/axios.api";


// register
export const register = (data) => {
    return api.post("/auth/register", data);
};

// login
export const login = (data) => {
    return api.post("/auth/login", data);
};

// get me
export const getMe = () => {
    return api.get("/auth/me");
};

// logout
export const logoutapi = () => {
    return api.post("/auth/logout");
};

//resendEmail
export const resendEmail = async (email) => {
    return await api.post("/auth/resendEmail", { email });
};

// update session
export const updateUserSession = (data) => {
    return api.post("/user/update-session", data);
};
// OTP bhejne ke liye (Forgot Password screen)
export const sendOtp = (data) => {
    return api.post("/auth/sendOtp", data); // data: { email }
};

// OTP verify karne ke liye (OTP screen)
export const verifyOtp = (data) => {
    return api.post("/auth/verifyOtp", data); // data: { email, otp }
};

// Password update karne ke liye (New Password screen)
export const resetPassword = (data) => {
    return api.post("/auth/resetPassword", data); // data: { email, newPassword }
};