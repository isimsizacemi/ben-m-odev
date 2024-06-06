import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Kullanıcı kaydı fonksiyonu
export const signup = async (req, res) => {
	try {
		const { fullName, username, email, password } = req.body;

		// Email formatının doğruluğunu kontrol et
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Geçersiz email formatı" });
		}

		// Kullanıcı adının mevcut olup olmadığını kontrol et
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Kullanıcı adı zaten alınmış" });
		}

		// E-postanın mevcut olup olmadığını kontrol et
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email zaten alınmış" });
		}

		// Parola uzunluğunu kontrol et
		if (password.length < 6) {
			return res.status(400).json({ error: "Parola en az 6 karakter uzunluğunda olmalıdır" });
		}

		// Parolayı hashle
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Yeni kullanıcı oluştur
		const newUser = new User({
			fullName,
			username,
			email,
			password: hashedPassword,
		});

		// Kullanıcı oluşturulduysa token oluştur ve kaydet
		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			// Yeni kullanıcıyı JSON olarak yanıtla
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			});
		} else {
			res.status(400).json({ error: "Geçersiz kullanıcı verisi" });
		}
	} catch (error) {
		console.log("signup fonksiyonunda hata", error.message);
		res.status(500).json({ error: "İç Sunucu Hatası" });
	}
};

// Kullanıcı girişi fonksiyonu
export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		// Kullanıcı bulunamadıysa veya parola doğru değilse hata döndür
		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Geçersiz kullanıcı adı veya parola" });
		}

		// Token oluştur ve cookie'ye ekle
		generateTokenAndSetCookie(user._id, res);

		// Kullanıcıyı JSON olarak yanıtla
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
		});
	} catch (error) {
		console.log("login fonksiyonunda hata", error.message);
		res.status(500).json({ error: "İç Sunucu Hatası" });
	}
};

// Kullanıcı çıkış fonksiyonu
export const logout = async (req, res) => {
	try {
		// Cookie'yi temizle ve çıkış başarılı mesajı döndür
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Başarıyla çıkış yapıldı" });
	} catch (error) {
		console.log("logout fonksiyonunda hata", error.message);
		res.status(500).json({ error: "İç Sunucu Hatası" });
	}
};

// Kendi bilgilerini getir fonksiyonu
export const getMe = async (req, res) => {
	try {
		// Kullanıcının bilgilerini getir ve parolayı hariç tut
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("getMe fonksiyonunda hata", error.message);
		res.status(500).json({ error: "İç Sunucu Hatası" });
	}
};
