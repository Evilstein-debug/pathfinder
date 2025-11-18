import { User } from "../models/user.model.js";
import { generateTokens, generateAccessToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//register
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if(!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            res.status(400).json({message: "Enter a valid email address."})
        }
        const existingUser = await User.findOne({
            $or: [{email}, {username}]
        })
        if(existingUser) {
            return res.status(409).json({
                message: "User already exists!"
            })
        }
        const user = await User.create({
            username,
            email,
            password
        })

        const { accessToken, refreshToken } = generateTokens(user._id)
        user.refreshToken = refreshToken
        await user.save()

        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        }

        res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
            accessToken,
            refreshToken
        })
    }
    catch (error) {
        console.error("Registeration error:", error)
        res.status(500).json({
            message: "Error registering the user.",
            error: error.message
        })
    }
}

//login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if(!email || !password) {
            return res.status(400).json({
                message: "Email and password is required."
            })
        }
        const user = await User.findOne({email})
        if(!user) {
            return res.status(401).json({
                message: "Invalid Email or Password."
            })
        }
        const isPasswordValid = await user.matchPassword(password)
        if(!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid Email or Password."
            })
        }

        const { accessToken, refreshToken } = generateTokens(user._id)
        user.refreshToken = refreshToken
        await user.save()

        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        }
        res.status(200).json({
            message: "Login Successful",
            user: userResponse,
            accessToken,
            refreshToken
        })
    }
    catch (error) {
        console.error("Login error:", error)
        res.status(500).json({
            message: "Error logging in.",
            error: error.message
        })
    }
}

//POST /api/auth/refresh
export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ 
                message: "Refresh token is required" 
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        );

        // Find user and check if refresh token matches
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ 
                message: "Invalid refresh token" 
            });
        }

        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({ 
                message: "Refresh token is expired or invalid" 
            });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user._id);

        res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        });

    } catch (error) {
        console.error("Refresh token error:", error);
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ 
                message: "Invalid refresh token" 
            });
        }
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ 
                message: "Refresh token expired" 
            });
        }

        res.status(500).json({ 
            message: "Error refreshing token",
            error: error.message 
        });
    }
};

// Social login (Google, GitHub, etc.)
export const oauthLogin = async (req, res) => {
  try {
    const { email, username, provider } = req.body

    if (!email || !username || !provider) {
      return res.status(400).json({
        message: "Email, username, and provider are required"
      })
    }

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        username,
        email,
        password: `${provider}_${Date.now()}` //dummy password
      })
      console.log(`New social user created: ${email} via ${provider}`)
    }

    const { accessToken, refreshToken } = generateTokens(user._id)

    user.refreshToken = refreshToken
    await user.save()

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    }

    res.status(200).json({
      message: "Social login successful",
      user: userResponse,
      accessToken,
      refreshToken
    })
  } catch (error) {
    console.error("Social login error:", error)
    res.status(500).json({
      message: "Error with social login",
      error: error.message
    })
  }
}

// logout
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
    try {
        const userId = req.user?._id; // Assumes auth middleware sets req.user

        if (!userId) {
            return res.status(401).json({ 
                message: "User not authenticated" 
            });
        }

        // Remove refresh token from database
        await User.findByIdAndUpdate(
            userId,
            { $unset: { refreshToken: "" } },
            { new: true }
        );

        res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ 
            message: "Error logging out",
            error: error.message 
        });
    }
};