import User from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";
import { clearAuthCookies, setAuthCookies } from "../utils/cookie.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      verified: false,
    });

    const emailToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${emailToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your email – Chacha Ki Dukan 🛒🚀",
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050810; color: #ffffff; border-radius: 20px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; margin-bottom: 10px;">Chacha Ki Dukan 🛒</h1>
          <div style="height: 2px; background: linear-gradient(to right, transparent, #3b82f6, transparent); width: 100%;"></div>
        </div>

        <h2 style="color: #f8fafc; text-align: center;">Welcome, ${user.name}! 🚀</h2>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; text-align: center;">
          Ustad Negotiator! Dukandaaro se bhidne ke liye taiyaar ho? <br/>
          Pehle apna email verify kar lo taaki tumhari bargaining history safe rahe.
        </p>

        <div style="text-align: center; margin: 40px 0;">
          <a 
            href="${verificationUrl}" 
            style="
              display: inline-block;
              background-color: #3b82f6;
              color: #ffffff;
              padding: 16px 32px;
              border-radius: 12px;
              text-decoration: none;
              font-size: 16px;
              font-weight: bold;
              box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
              transition: all 0.3s ease;
            "
          >
            Verify My Account
          </a>
        </div>

        <p style="color: #64748b; font-size: 13px; text-align: center; border-top: 1px solid #1e293b; pt-20;">
          Note: Ye link sirf 1 ghante tak valid hai. <br/>
          Agar tumne ye account nahi banaya hai, toh is email ko ignore karein.
        </p>
      </div>
    `
    })
    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      success: true,
    });

  } catch (error) {
    console.error("REGISTER ERROR 👉", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({
        message: "Invalid token or user not found",
        success: false,
      });
    }

    if (user.verified) {
      return res.status(200).json({
        message: "Email already verified",
        success: true,
      });
    }

    user.verified = true;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const hash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    user.sessions.push({
      refreshTokenHash: hash,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Email verified & logged in successfully",
      success: true,
    });

  } catch (error) {
    console.error("Verify email error:", error.message);

    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    if (!user.verified) {
      const emailToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1m" }
      );

      const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${emailToken}`;

      await sendEmail({
      to: user.email,
      subject: "Verify your email – Chacha Ki Dukan 🛒🚀",
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050810; color: #ffffff; border-radius: 20px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; margin-bottom: 10px;">Chacha Ki Dukan 🛒</h1>
          <div style="height: 2px; background: linear-gradient(to right, transparent, #3b82f6, transparent); width: 100%;"></div>
        </div>

        <h2 style="color: #f8fafc; text-align: center;">Welcome, ${user.name}! 🚀</h2>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; text-align: center;">
          Ustad Negotiator! Dukandaaro se bhidne ke liye taiyaar ho? <br/>
          Pehle apna email verify kar lo taaki tumhari bargaining history safe rahe.
        </p>

        <div style="text-align: center; margin: 40px 0;">
          <a 
            href="${verificationUrl}" 
            style="
              display: inline-block;
              background-color: #3b82f6;
              color: #ffffff;
              padding: 16px 32px;
              border-radius: 12px;
              text-decoration: none;
              font-size: 16px;
              font-weight: bold;
              box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
              transition: all 0.3s ease;
            "
          >
            Verify My Account
          </a>
        </div>

        <p style="color: #64748b; font-size: 13px; text-align: center; border-top: 1px solid #1e293b; pt-20;">
          Note: Ye link sirf 1 ghante tak valid hai. <br/>
          Agar tumne ye account nahi banaya hai, toh is email ko ignore karein.
        </p>
      </div>
    `
    })

      return res.status(403).json({
        message: "Account not verified. A new verification link has been sent to your email.",
        success: false,
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const hash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    user.sessions.push({
      refreshTokenHash: hash,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 Days
    });

    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR 👉", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    // YAHAN BADLAV HAI: Stats aur History ko select karo
    const user = await User.findById(req.user._id)
      .select("-password")
      .lean(); // lean() se query fast ho jati hai

    return res.status(200).json({
      success: true,
      user, // Ab isme stats, sellerPerformance sab jayega
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken && req.user) {
      const hash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      req.user.sessions = req.user.sessions.filter(
        (s) => s.refreshTokenHash !== hash
      );

      await req.user.save();
    }

    clearAuthCookies(res);

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized - No refresh token",
        success: false,
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - User not found",
        success: false,
      });
    }

    const hash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = user.sessions.find(
      (s) => s.refreshTokenHash === hash
    );

    if (!session) {
      return res.status(401).json({
        message: "Unauthorized - Invalid session",
        success: false,
      });
    }

    user.sessions = user.sessions.filter(
      (s) => s.refreshTokenHash !== hash
    );

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const newHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    user.sessions.push({
      refreshTokenHash: newHash,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await user.save();

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      message: "Token refreshed",
      success: true,
    });

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized - Invalid or expired refresh token",
      success: false,
    });
  }
};
export const resendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "Email already verified",
        success: false,
      });
    }

    const emailToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${emailToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your email – Chacha Ki Dukan 🛒🚀",
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050810; color: #ffffff; border-radius: 20px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; margin-bottom: 10px;">Chacha Ki Dukan 🛒</h1>
          <div style="height: 2px; background: linear-gradient(to right, transparent, #3b82f6, transparent); width: 100%;"></div>
        </div>

        <h2 style="color: #f8fafc; text-align: center;">Welcome, ${user.name}! 🚀</h2>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; text-align: center;">
          Ustad Negotiator! Dukandaaro se bhidne ke liye taiyaar ho? <br/>
          Pehle apna email verify kar lo taaki tumhari bargaining history safe rahe.
        </p>

        <div style="text-align: center; margin: 40px 0;">
          <a 
            href="${verificationUrl}" 
            style="
              display: inline-block;
              background-color: #3b82f6;
              color: #ffffff;
              padding: 16px 32px;
              border-radius: 12px;
              text-decoration: none;
              font-size: 16px;
              font-weight: bold;
              box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
              transition: all 0.3s ease;
            "
          >
            Verify My Account
          </a>
        </div>

        <p style="color: #64748b; font-size: 13px; text-align: center; border-top: 1px solid #1e293b; pt-20;">
          Note: Ye link sirf 1 ghante tak valid hai. <br/>
          Agar tumne ye account nahi banaya hai, toh is email ko ignore karein.
        </p>
      </div>
    `
    })

    return res.status(200).json({
      message: "Verification email resent successfully",
      success: true,
    });

  } catch (error) {
    console.error("RESEND EMAIL ERROR 👉", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};