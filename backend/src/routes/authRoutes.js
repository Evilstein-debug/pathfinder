import express from "express";
import { register, login, refreshAccessToken, oauthLogin, logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema,
  oauthSchema 
} from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshTokenSchema), refreshAccessToken);
router.post("/oauthLogin", validate(oauthSchema), oauthLogin);

router.post("/logout", protect, logout);

export default router;