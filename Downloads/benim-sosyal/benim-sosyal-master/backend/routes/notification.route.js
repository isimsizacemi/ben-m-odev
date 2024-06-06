import express from "express";
import { protectRoute } from "../middleware/protectRoute.js"; // Koruma middleware'ı içe aktarılır
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js"; // İlgili işleyici (controller) fonksiyonları içe aktarılır

const router = express.Router(); // Yeni bir router oluşturulur

// / rotası, protectRoute middleware'ı ile korunur ve getNotifications işleyicisiyle eşleştirilir
router.get("/", protectRoute, getNotifications);

// / rotası, protectRoute middleware'ı ile korunur ve deleteNotifications işleyicisiyle eşleştirilir
router.delete("/", protectRoute, deleteNotifications);

export default router; // Router nesnesi dışa aktarılır
