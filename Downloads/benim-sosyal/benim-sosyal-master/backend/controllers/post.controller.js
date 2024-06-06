import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

// Yeni bir gönderi oluşturan fonksiyon
export const createPost = async (req, res) => {
	try {
		// İstek gövdesinden metin ve img alanlarını al
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		// Kullanıcıyı bul
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

		// Metin veya görüntü alanlarının boş olup olmadığını kontrol et
		if (!text && !img) {
			return res.status(400).json({ error: "Gönderi metin veya resim içermeli" });
		}

		// Eğer bir görüntü varsa, bulut hizmeti kullanarak yükle
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		// Yeni bir gönderi belgesi oluştur
		const newPost = new Post({
			user: userId,
			text,
			img,
		});

		// Gönderiyi kaydet
		await newPost.save();
		// Yeni gönderiyi JSON olarak yanıtla
		res.status(201).json(newPost);
	} catch (error) {
		// Hata durumunda içsel sunucu hatası döndür ve hatayı konsola kaydet
		res.status(500).json({ error: "İç sunucu hatası" });
		console.log("createPost kontrolcüsünde hata: ", error);
	}
};

// Bir gönderiyi silen fonksiyon
export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Gönderi bulunamadı" });
		}

		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Bu gönderiyi silme yetkiniz yok" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Gönderi başarıyla silindi" });
	} catch (error) {
		console.log("deletePost kontrolcüsünde hata: ", error);
		res.status(500).json({ error: "İç sunucu hatası" });
	}
};

// Bir gönderiye yorum yapma fonksiyonu
export const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Metin alanı zorunludur" });
		}
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Gönderi bulunamadı" });
		}

		const comment = { user: userId, text };

		post.comments.push(comment);
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.log("commentOnPost kontrolcüsünde hata: ", error);
		res.status(500).json({ error: "İç sunucu hatası" });
	}
};

// Gönderiyi beğenme veya beğenmeme fonksiyonu
export const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Gönderi bulunamadı" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Gönderiyi beğenmekten vazgeç
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			// Gönderiyi beğen
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("likeUnlikePost kontrolcüsünde hata: ", error);
		res.status(500).json({ error: "İç sunucu hatası" });
	}
};

// Tüm gönderileri getiren fonksiyon
export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {
		console.log("getAllPosts kontrolcüsünde hata: ", error);
		res.status(500).json({ error: "İç sunucu hatası" });
	}
};

// Kullanıcının beğendiği gönderileri getiren fonksiyon
export const getLikedPosts = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("getLikedPosts kontrolcüsünde hata: ", error);
		res.status(500).json({ error: "İç sunucu hatası" });
	}
};

// Kullanıcının takip ettiği kişilerin gönderilerini getiren fonksiyon
export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

		const following = user.following;

		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("getFollowingPosts kontrolcüsünde hata: ", error);
		res.status(500).json({ error: "İç sunucu hatası" });
	}
};

// Belirli bir kullanıcının gönderilerini getiren fonksiyon
export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("getUserPosts kontrolcüsünde hata: ", error);
		res.status(500).json({ error: "İç sunucu hatası" });
	}
};
