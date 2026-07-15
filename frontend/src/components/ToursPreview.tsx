const ToursPreview = () => {
  const tours = [
    {
      id: 1,
      title: "Восхождение на Эльбрус",
      price: 45000,
      duration: "5 дней",
      image: "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg"
    },
    {
      id: 2,
      title: "Гастротур по Кавказу",
      price: 18000,
      duration: "1 день",
      image: "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg"
    },
    {
      id: 3,
      title: "Треккинг к водопадам",
      price: 6500,
      duration: "1 день",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
    }
  ];

  return (
    <section id="tours" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold">Популярные туры</h2>
          <a href="#" className="text-yellow-500 hover:underline">Все туры →</a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tours.map(tour => (
            <div key={tour.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
              <img 
                src={tour.image} 
                alt={tour.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">{tour.title}</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-yellow-500">{tour.price.toLocaleString()} ₽</span>
                    <span className="text-sm text-gray-500"> / {tour.duration}</span>
                  </div>
                  <button className="bg-[#1a1a2e] text-white px-6 py-3 rounded-2xl hover:bg-yellow-400 hover:text-[#1a1a2e] transition-all">
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToursPreview;