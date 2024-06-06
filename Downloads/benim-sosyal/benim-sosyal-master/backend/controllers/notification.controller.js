import Notification from "../models/notification.model.js";

// Kullanıcının bildirimlerini getiren fonksiyon
export const getNotifications = async (req, res) => {
	try {
		const userId = req.user._id;

		// Kullanıcının aldığı bildirimleri bul, gönderenin kullanıcı adı ve profil resmiyle birlikte getir
		const notifications = await Notification.find({ to: userId }).populate({
			path: "from",
			select: "username profileImg",
		});

		// Kullanıcının tüm bildirimlerini okundu olarak işaretle
		await Notification.updateMany({ to: userId }, { read: true });

		// Bildirimleri JSON olarak yanıtla
		res.status(200).json(notifications);
	} catch (error) {
		console.log("getNotifications fonksiyonunda hata", error.message);
		res.status(500).json({ error: "İç Sunucu Hatası" });
	}
};

// Kullanıcının bildirimlerini silen fonksiyon
export const deleteNotifications = async (req, res) => {
	try {
		const userId = req.user._id;

		// Kullanıcının tüm bildirimlerini sil
		await Notification.deleteMany({ to: userId });

		// Bildirimlerin başarıyla silindiğine dair mesajı JSON olarak yanıtla
		res.status(200).json({ message: "Bildirimler başarıyla silindi" });
	} catch (error) {
		console.log("deleteNotifications fonksiyonunda hata", error.message);
		res.status(500).json({ error: "İç Sunucu Hatası" });
	}
};
