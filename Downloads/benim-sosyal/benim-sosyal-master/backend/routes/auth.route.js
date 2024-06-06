import express from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js"; // İlgili işleyici (controller) fonksiyonları içe aktarılır
import { protectRoute } from "../middleware/protectRoute.js"; // Koruma middleware'ı içe aktarılır

const router = express.Router(); // Yeni bir router oluşturulur

// /me rotası, protectRoute middleware'ı ile korunur ve getMe işleyicisiyle eşleştirilir
router.get("/me", protectRoute, getMe);

// /signup rotası, signup işleyicisiyle eşleştirilir
router.post("/signup", signup);

// /login rotası, login işleyicisiyle eşleştirilir
router.post("/login", login);

// /logout rotası, logout işleyicisiyle eşleştirilir
router.post("/logout", logout);

export default router; // Router nesnesi dışa aktarılır
