import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Kullanıcı profili güncelleme kancası
const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    // Profil güncelleme işlemi için mutateAsync fonksiyonunu kullanma
    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
        // Profil güncelleme işlemini gerçekleştiren fonksiyon
        mutationFn: async (formData) => {
            try {
                const res = await fetch(`/api/users/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Bir şeyler yanlış gitti");
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        // Başarı durumunda yapılacak işlemler
        onSuccess: () => {
            // Profil güncelleme başarılı mesajını gösterme
            toast.success("Profil başarıyla güncellendi");
            // Oturum açmış kullanıcı ve kullanıcı profili önbelleğini geçersiz kılma
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
            ]);
        },
        // Hata durumunda yapılacak işlemler
        onError: (error) => {
            // Hata mesajını gösterme
            toast.error(error.message);
        },
    });

    return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
