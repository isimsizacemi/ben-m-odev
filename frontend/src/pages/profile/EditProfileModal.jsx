import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

// Profil Düzenleme Modalı bileşeni
const EditProfileModal = ({ authUser }) => {
    // Form verileri için durum değişkeni
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        bio: "",
        link: "",
        newPassword: "",
        currentPassword: "",
    });

    // Profil güncelleme kancaları
    const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

    // Form girişlerinin değişimini izleyen işlev
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Profil kullanıcısı güncellendiğinde yapılacak işlemler
    useEffect(() => {
        if (authUser) {
            setFormData({
                fullName: authUser.fullName,
                username: authUser.username,
                email: authUser.email,
                bio: authUser.bio,
                link: authUser.link,
                newPassword: "",
                currentPassword: "",
            });
        }
    }, [authUser]);

    return (
        <>
            <button
                className='btn btn-outline rounded-full btn-sm'
                onClick={() => document.getElementById("edit_profile_modal").showModal()}
            >
                Profili Düzenle
            </button>
            {/* Profil Düzenleme Modalı */}
            <dialog id='edit_profile_modal' className='modal'>
                <div className='modal-box border rounded-md border-gray-700 shadow-md'>
                    <h3 className='font-bold text-lg my-3'>Profil Güncelleme</h3>
                    {/* Profil güncelleme formu */}
                    <form
                        className='flex flex-col gap-4'
                        onSubmit={(e) => {
                            e.preventDefault();
                            updateProfile(formData);
                        }}
                    >
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='text'
                                placeholder='Ad Soyad'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.fullName}
                                name='fullName'
                                onChange={handleInputChange}
                            />
                            <input
                                type='text'
                                placeholder='Kullanıcı Adı'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.username}
                                name='username'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='email'
                                placeholder='E-posta'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.email}
                                name='email'
                                onChange={handleInputChange}
                            />
                            <textarea
                                placeholder='Biyografi'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.bio}
                                name='bio'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='password'
                                placeholder='Şuanki Şifre'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.currentPassword}
                                name='currentPassword'
                                onChange={handleInputChange}
                            />
                            <input
                                type='password'
                                placeholder='Yeni Şifre'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.newPassword}
                                name='newPassword'
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type='text'
                            placeholder='Bağlantı'
                            className='flex-1 input border border-gray-700 rounded p-2 input-md'
                            value={formData.link}
                            name='link'
                            onChange={handleInputChange}
                        />
                        {/* Profil güncelleme butonu */}
                        <button className='btn btn-primary rounded-full btn-sm text-white'>
                            {isUpdatingProfile ? "Güncelleniyor..." : "Güncelle"}
                        </button>
                    </form>
                </div>
                {/* Modal arka planı */}
                <form method='dialog' className='modal-backdrop'>
                    <button className='outline-none'>Kapat</button>
                </form>
            </dialog>
        </>
    );
};

export default EditProfileModal;
