import { User } from "../models/user.model.js";
import { generateTokens, generateAccessToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register - validation now handled by middleware
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        // req.body is already validated by middleware
        
        // Check for existing user
        const existingUser = await User.findOne({
            $or: [{email: email.toLowerCase()}, {username}]
        })
        
        if(existingUser) {
            return res.status(409).json({
                message: existingUser.email === email.toLowerCase() 
                    ? "Email already registered" 
                    : "Username already taken"
            })
        }
        
        // Create user
        const user = await User.create({
            username,
            email: email.toLowerCase(), // Store email in lowercase
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
        console.error("Registration error:", error)
        res.status(500).json({
            message: "Error registering the user.",
            error: error.message
        })
    }
}

// Login - validation now handled by middleware
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        
        const user = await User.findOne({email: email.toLowerCase()})
        
        if(!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
        
        const isPasswordValid = await user.matchPassword(password)
        if(!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
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

// Refresh token - validation now handled by middleware
export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ 
                message: "Invalid refresh token" 
            });
        }

        const newAccessToken = generateAccessToken(user._id);

        res.status(200).json({
            message: "Access token refreshed",
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error("Token refresh error:", error);

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

// Social login (Google, GitHub, etc.) - validation now handled by middleware
export const oauthLogin = async (req, res) => {
  try {
    const { email, username, provider } = req.body

    let user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      user = await User.create({
        username,
        email: email.toLowerCase(),
        password: `${provider}_${Date.now()}_${Math.random().toString(36)}` // Secure random password
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
      message: "OAuth login successful",
      user: userResponse,
      accessToken,
      refreshToken
    })
  } catch (error) {
    console.error("OAuth login error:", error)
    res.status(500).json({
      message: "Error during OAuth login",
      error: error.message
    })
  }
}

// Logout
export const logout = async (req, res) => {
    try {
        const userId = req.user._id
        await User.findByIdAndUpdate(userId, { refreshToken: null })
        
        res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (error) {
        console.error("Logout error:", error)
        res.status(500).json({
            message: "Error logging out",
            error: error.message
        })
    }
}