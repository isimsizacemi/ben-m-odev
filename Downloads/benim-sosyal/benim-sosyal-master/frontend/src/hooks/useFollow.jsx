import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Takip etme kancası
const useFollow = () => {
    const queryClient = useQueryClient();

    // Takip işlemi için mutate fonksiyonunu kullanma
    const { mutate: follow, isPending } = useMutation({
        // Takip işlemini gerçekleştiren fonksiyon
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`/api/users/follow/${userId}`, {
                    method: "POST",
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Bir şeyler yanlış gitti!");
                }
                return;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        // Başarı durumunda yapılacak işlemler
        onSuccess: () => {
            // Önerilen kullanıcılar ve oturum açmış kullanıcı önbelleğini geçersiz kılma
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
            ]);
        },
        // Hata durumunda yapılacak işlemler
        onError: (error) => {
            // Hata mesajını gösterme
            toast.error(error.message);
        },
    });

    return { follow, isPending };
};

export default useFollow;
