/**
 * Gönderinin oluşturulma tarihini kullanıcı dostu bir formata dönüştürür.
 * @param {string} createdAt - Gönderinin oluşturulma tarihi (ISO 8601 formatında).
 * @returns {string} - Oluşturulma tarihini temsil eden metin dizesi.
 */
export const formatPostDate = (createdAt) => {
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);

    const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
    const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
    const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

    if (timeDifferenceInDays > 1) {
        return createdAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (timeDifferenceInDays === 1) {
        return "1d";
    } else if (timeDifferenceInHours >= 1) {
        return `${timeDifferenceInHours}h`;
    } else if (timeDifferenceInMinutes >= 1) {
        return `${timeDifferenceInMinutes}m`;
    } else {
        return "Just now";
    }
};

/**
 * Kullanıcının üyelik başlangıç tarihini kullanıcı dostu bir formata dönüştürür.
 * @param {string} createdAt - Kullanıcının üyelik başlangıç tarihi (ISO 8601 formatında).
 * @returns {string} - Üyelik başlangıç tarihini temsil eden metin dizesi.
 */
export const formatMemberSinceDate = (createdAt) => {
    const date = new Date(createdAt);
    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `Joined ${month} ${year}`;
};
