import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary"; // Cloudinary kütüphanesini içe aktarır

import authRoutes from "./routes/auth.route.js"; // Auth rotalarını içe aktarır
import userRoutes from "./routes/user.route.js"; // Kullanıcı rotalarını içe aktarır
import postRoutes from "./routes/post.route.js"; // Post rotalarını içe aktarır
import notificationRoutes from "./routes/notification.route.js"; // Bildirim rotalarını içe aktarır

import connectMongoDB from "./db/connectMongoDB.js"; // MongoDB'ye bağlanmak için fonksiyonu içe aktarır

dotenv.config(); // .env dosyasını yükler

cloudinary.config({ // Cloudinary yapılandırmasını tanımlar
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express(); // Yeni bir Express uygulaması oluşturur
const PORT = process.env.PORT || 5000; // Port numarasını belirler
const __dirname = path.resolve(); // __dirname değişkenini tanımlar

app.use(express.json({ limit: "5mb" })); // req.body'yi ayrıştırmak için json middleware'ini ekler
app.use(express.urlencoded({ extended: true })); // form verilerini ayrıştırmak için urlencoded middleware'ini ekler

app.use(cookieParser()); // Cookie'leri ayrıştırmak için cookie-parser middleware'ini ekler

// Rotaları tanımlar
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Prodüksiyon ortamında React uygulamasının build dosyalarını sunar
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist"))); // frontend/dist klasörünü statik dosya olarak sunar

	// Herhangi bir yol eşleşmediğinde, index.html dosyasını sunar
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => { // Uygulamayı belirtilen portta dinlemeye başlar
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB(); // MongoDB'ye bağlanmayı dener
});
