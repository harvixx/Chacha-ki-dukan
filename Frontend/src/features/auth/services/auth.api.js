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
export const logout = () => {
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