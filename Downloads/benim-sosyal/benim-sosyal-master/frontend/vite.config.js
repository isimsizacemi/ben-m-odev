import { defineConfig } from "vite"; // Vite'den defineConfig fonksiyonunu içe aktarır
import react from "@vitejs/plugin-react"; // @vitejs/plugin-react modülünü içe aktarır

// Vite yapılandırmasını tanımlar
export default defineConfig({
	plugins: [react()], // Vite eklentilerini belirtir, burada React desteği sağlayan eklenti eklenir
	server: {
		port: 3000, // Geliştirme sunucusunun çalışacağı port numarasını belirtir
		proxy: {
			"/api": { // /api ile başlayan tüm istekleri hedef sunucuya yönlendirir
				target: "http://localhost:5000", // Hedef sunucu adresini belirtir
				changeOrigin: true, // Hedef sunucuya gönderilen taleplerin Origin başlığını değiştirmeyi sağlar
			},
		},
	},
});
