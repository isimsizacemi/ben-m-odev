import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

// `Posts` bileşeni, farklı türdeki gönderilerin listesini görüntüler.
// Bu, "For You", "Following", "User Posts" ve "Liked Posts" gibi farklı beslemeleri destekler.
// Gönderiler, `Post` bileşenini kullanarak gösterilir.
const Posts = ({ feedType, username, userId }) => {
    // Gönderi API son noktasını belirlemek için yardımcı bir fonksiyon.
    const getPostEndpoint = () => {
        switch (feedType) {
            case "forYou":
                return "/api/posts/all";
            case "following":
                return "/api/posts/following";
            case "posts":
                return `/api/posts/user/${username}`;
            case "likes":
                return `/api/posts/likes/${userId}`;
            default:
                return "/api/posts/all";
        }
    };

    const POST_ENDPOINT = getPostEndpoint();

    // Gönderileri almak için React Query kancasını kullanma.
    const {
        data: posts, // Gönderi verileri
        isLoading, // Yükleniyor durumu
        refetch, // Verileri yenileme işlevi
        isRefetching, // Yenileme durumu
    } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const res = await fetch(POST_ENDPOINT);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    // Yenileme efektini tetikleme.
    useEffect(() => {
        refetch();
    }, [feedType, refetch, username]);

    return (
        <>
            {/* Yükleniyor veya yenileniyor durumunda, iskeletler gösterilir */}
            {(isLoading || isRefetching) && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {/* Gönderi yoksa uygun mesaj gösterilir */}
            {!isLoading && !isRefetching && posts?.length === 0 && (
                <p className='text-center my-4'>No posts in this tab. Switch 👻</p>
            )}
            {/* Gönderiler yüklendiyse, `Post` bileşeni kullanılarak gösterilir */}
            {!isLoading && !isRefetching && posts && (
                <div>
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};
export default Posts;
