import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	// 1. Kullanıcı kimliği ile JWT oluştur
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d", // Token'ın süresi: 15 gün
	});

	// 2. Oluşturulan JWT'yi bir HTTP cookie'sine yerleştir
	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, //MS, Cookie'nin ömrü: 15 gün
		httpOnly: true, // XSS saldırılarını önler
		sameSite: "strict", // CSRF saldırılarını önler
		secure: process.env.NODE_ENV !== "development", // Sadece güvenli bağlantılarda (HTTPS) kullanılması için
	});
};
