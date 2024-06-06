import mongoose from "mongoose";

// Kullanıcı şeması tanımı
const userSchema = new mongoose.Schema(
	{
		// Kullanıcı adı
		username: {
			type: String,
			required: true, // Bu alanın doldurulması zorunlu
			unique: true, // Her kullanıcı için benzersiz olmalı
		},
		// Tam ad
		fullName: {
			type: String,
			required: true, // Bu alanın doldurulması zorunlu
		},
		// Şifre
		password: {
			type: String,
			required: true, // Bu alanın doldurulması zorunlu
			minLength: 6, // Minimum 6 karakter uzunluğunda olmalı
		},
		// E-posta adresi
		email: {
			type: String,
			required: true, // Bu alanın doldurulması zorunlu
			unique: true, // Her kullanıcı için benzersiz olmalı
		},
		// Takipçiler
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [], // Varsayılan değer boş dizi
			},
		],
		// Takip edilenler
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [], // Varsayılan değer boş dizi
			},
		],
		// Profil resmi URL'si
		profileImg: {
			type: String,
			default: "", // Varsayılan değer boş string
		},
		// Kapak resmi URL'si
		coverImg: {
			type: String,
			default: "", // Varsayılan değer boş string
		},
		// Kullanıcı biyografisi
		bio: {
			type: String,
			default: "", // Varsayılan değer boş string
		},
		// Kişisel web sitesi URL'si
		link: {
			type: String,
			default: "", // Varsayılan değer boş string
		},
		// Beğenilen gönderiler
		likedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
				default: [], // Varsayılan değer boş dizi
			},
		],
	},
	// Zaman damgaları (createdAt, updatedAt)
	{ timestamps: true }
);

// Kullanıcı modelini oluştur ve dışa aktar
const User = mongoose.model("User", userSchema);

export default User;
