import mongoose from "mongoose";

const connectMongoDB = async () => {
	try {
		// 1. Mongoose kullanarak MongoDB'ye bağlan
		const conn = await mongoose.connect(process.env.MONGO_URI);

		// 2. Bağlantı başarılıysa, bağlanılan MongoDB sunucusunun bilgilerini konsola yazdır
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		// 3. Bağlantı hatası olursa, konsola hata mesajını yazdır ve işlemi sonlandır
		console.error(`Error connection to MongoDB: ${error.message}`);
		process.exit(1); // Uygulamayı sonlandır ve 1 numaralı çıkış kodunu döndür
	}
};

export default connectMongoDB;
