// 🔥 Common cookie options
const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // prod me true
  sameSite: "strict",
};


// 🍪 Set auth cookies
export const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...baseOptions,
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refreshToken", refreshToken, {
    ...baseOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};


// 🧹 Clear auth cookies (logout)
export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", baseOptions);
  res.clearCookie("refreshToken", baseOptions);
};
