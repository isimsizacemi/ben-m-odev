import express from "express";
import { protectRoute } from "../middleware/protectRoute.js"; // Koruma middleware'ı içe aktarılır
import {
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeUnlikePost,
} from "../controllers/post.controller.js"; // İlgili işleyici (controller) fonksiyonları içe aktarılır

const router = express.Router(); // Yeni bir router oluşturulur

// /all rotası, protectRoute middleware'ı ile korunur ve getAllPosts işleyicisiyle eşleştirilir
router.get("/all", protectRoute, getAllPosts);

// /following rotası, protectRoute middleware'ı ile korunur ve getFollowingPosts işleyicisiyle eşleştirilir
router.get("/following", protectRoute, getFollowingPosts);

// /likes/:id rotası, protectRoute middleware'ı ile korunur ve getLikedPosts işleyicisiyle eşleştirilir
router.get("/likes/:id", protectRoute, getLikedPosts);

// /user/:username rotası, protectRoute middleware'ı ile korunur ve getUserPosts işleyicisiyle eşleştirilir
router.get("/user/:username", protectRoute, getUserPosts);

// /create rotası, protectRoute middleware'ı ile korunur ve createPost işleyicisiyle eşleştirilir
router.post("/create", protectRoute, createPost);

// /like/:id rotası, protectRoute middleware'ı ile korunur ve likeUnlikePost işleyicisiyle eşleştirilir
router.post("/like/:id", protectRoute, likeUnlikePost);

// /comment/:id rotası, protectRoute middleware'ı ile korunur ve commentOnPost işleyicisiyle eşleştirilir
router.post("/comment/:id", protectRoute, commentOnPost);

// /:id rotası, protectRoute middleware'ı ile korunur ve deletePost işleyicisiyle eşleştirilir
router.delete("/:id", protectRoute, deletePost);

export default router; // Router nesnesi dışa aktarılır
