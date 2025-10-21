import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateAccessToken = (userId) => {
    return jwt.sign(
        {_id: userId},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        {_id: userId},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export const generateTokens = (userId) => {
    const accessToken = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)
    return { accessToken, refreshToken }
}