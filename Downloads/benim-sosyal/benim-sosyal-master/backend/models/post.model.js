import mongoose from "mongoose";

// Bildirim şeması tanımı
const notificationSchema = new mongoose.Schema(
	{
		// Bildirimi gönderen kullanıcı
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Bildirimi alan kullanıcı
		to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Bildirimin türü (follow, like)
		type: {
			type: String,
			required: true,
			enum: ["follow", "like"],
		},
		// Bildirimin okunup okunmadığı
		read: {
			type: Boolean,
			default: false,
		},
	},
	// Zaman damgaları (createdAt, updatedAt)
	{ timestamps: true }
);

// Bildirim modelini oluştur ve dışa aktar
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
