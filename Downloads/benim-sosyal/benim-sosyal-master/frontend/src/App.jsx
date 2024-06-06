import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Ana uygulama bileşeni
function App() {
    // Kullanıcı kimliği ve yükleme durumunu almak için kullanılan sorgu
    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                console.log("authUser is here:", data);
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        retry: false,
    });

    // Yükleme durumu için koşul kontrolü
    if (isLoading) {
        return (
            // Yükleme durumu gösterici
            <div className='h-screen flex justify-center items-center'>
                <LoadingSpinner size='lg' />
            </div>
        );
    }

    // Ana bileşenin dönüşü
    return (
        // Ana uygulama konteyneri
        <div className='flex max-w-6xl mx-auto'>
            {/* Kullanıcı oturumu açtıysa, kenar çubuğunu göster */}
            {authUser && <Sidebar />}
            {/* Rotaların belirtildiği bileşen */}
            <Routes>
                {/* Ana sayfa rotası */}
                <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
                {/* Giriş sayfası rotası */}
                <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
                {/* Kayıt sayfası rotası */}
                <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
                {/* Bildirim sayfası rotası */}
                <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
                {/* Kullanıcı profil sayfası rotası */}
                <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
            </Routes>
            {/* Kullanıcı oturumu açtıysa sağ paneli göster */}
            {authUser && <RightPanel />}
            {/* Bildirimler için toast bileşeni */}
            <Toaster />
        </div>
    );
}

// Uygulama bileşenini dışa aktar
export default App;
