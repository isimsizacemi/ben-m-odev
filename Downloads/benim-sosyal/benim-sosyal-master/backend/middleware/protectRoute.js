import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
	try {
		// 1. İsteğin cookies içinde JWT token'ın olup olmadığını kontrol et
		const token = req.cookies.jwt;
		if (!token) {
			// Eğer token sağlanmamışsa, 401 durum kodu ve hata mesajı ile yanıt ver
			return res.status(401).json({ error: "Yetkisiz: Token Sağlanmadı" });
		}

		// 2. JWT secret kullanarak token'ı doğrula
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// 3. Eğer token geçersiz veya süresi dolmuşsa, 401 durum kodu ve hata mesajı ile yanıt ver
		if (!decoded) {
			return res.status(401).json({ error: "Yetkisiz: Geçersiz Token" });
		}

		// 4. Token ile ilişkilendirilmiş kullanıcıyı veritabanından al
		const user = await User.findById(decoded.userId).select("-password");

		// 5. Eğer kullanıcı bulunamazsa, 404 durum kodu ve hata mesajı ile yanıt ver
		if (!user) {
			return res.status(404).json({ error: "Kullanıcı bulunamadı" });
		}

		// Kullanıcı nesnesini ilgili yol işleyicilerinde daha fazla kullanmak üzere istek nesnesine ekle
		req.user = user;

		// Sonraki middleware veya yol işleyicisine devam et
		next();
	} catch (err) {
		// İşlem sırasında bir hata oluşursa, hatayı günlüğe kaydet ve 500 durum kodu ile hata mesajı ile yanıt ver
		console.log("protectRoute middleware'inde Hata", err.message);
		return res.status(500).json({ error: "İç Sunucu Hatası" });
	}
};
