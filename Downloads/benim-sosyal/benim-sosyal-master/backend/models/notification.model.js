import mongoose from "mongoose";

// Bildirim şeması tanımı
const notificationSchema = new mongoose.Schema(
	{
		// Bildirimi gönderen kullanıcı
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",  // User modeline referans
			required: true,  // Bu alanın doldurulması zorunlu
		},
		// Bildirimi alan kullanıcı
		to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",  // User modeline referans
			required: true,  // Bu alanın doldurulması zorunlu
		},
		// Bildirimin türü (follow, like)
		type: {
			type: String,
			required: true,  // Bu alanın doldurulması zorunlu
			enum: ["follow", "like"],  // Sadece bu değerleri alabilir
		},
		// Bildirimin okunup okunmadığını belirten alan
		read: {
			type: Boolean,
			default: false,  // Varsayılan değer false
		},
	},
	// Zaman damgaları (createdAt, updatedAt) otomatik olarak eklenecek
	{ timestamps: true }
);

// Bildirim modelini oluştur ve dışa aktar
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
