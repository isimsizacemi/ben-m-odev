import express from "express";
import { protectRoute } from "../middleware/protectRoute.js"; // Koruma middleware'ı içe aktarılır
import {
    followUnfollowUser,
    getSuggestedUsers,
    getUserProfile,
    updateUser
} from "../controllers/user.controller.js"; // İlgili işleyici (controller) fonksiyonları içe aktarılır

const router = express.Router(); // Yeni bir router oluşturulur

// /profile/:username rotası, protectRoute middleware'ı ile korunur ve getUserProfile işleyicisiyle eşleştirilir
router.get("/profile/:username", protectRoute, getUserProfile);

// /suggested rotası, protectRoute middleware'ı ile korunur ve getSuggestedUsers işleyicisiyle eşleştirilir
router.get("/suggested", protectRoute, getSuggestedUsers);

// /follow/:id rotası, protectRoute middleware'ı ile korunur ve followUnfollowUser işleyicisiyle eşleştirilir
router.post("/follow/:id", protectRoute, followUnfollowUser);

// /update rotası, protectRoute middleware'ı ile korunur ve updateUser işleyicisiyle eşleştirilir
router.post("/update", protectRoute, updateUser);

export default router; // Router nesnesi dışa aktarılır
