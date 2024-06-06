// LoadingSpinner bileşeni tanımlanır ve size adında bir parametre alır, varsayılan değeri "md" olarak ayarlanmıştır.
const LoadingSpinner = ({ size = "md" }) => {
    // Spinner boyutunu belirlemek için sizeClass adında bir değişken oluşturulur ve "loading-md" gibi bir sınıf oluşturulur.
    const sizeClass = `loading-${size}`;

    // Spinner bileşeni döndürülür. className özelliği içinde "loading", "loading-spinner" ve belirlenen boyut sınıfı bulunur.
    // Bu sınıflar, spinner için stil belirlemek için kullanılabilir.
    return <span className={`loading loading-spinner ${sizeClass}`} />;
};

// LoadingSpinner bileşeni dışa aktarılır, böylece başka dosyalarda kullanılabilir.
export default LoadingSpinner;
