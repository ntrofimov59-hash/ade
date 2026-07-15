const GuidesPreview = () => {
  const guides = [
    {
      name: "Алексей Морозов",
      specialty: "Восхождения и высотный треккинг",
      experience: "12 лет",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Мария Соколова",
      specialty: "Гастрономические туры",
      experience: "8 лет",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Дмитрий Волков",
      specialty: "Треккинг и семейные маршруты",
      experience: "10 лет",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section id="guides" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold">Лучшие гиды</h2>
          <a href="#" className="text-yellow-500 hover:underline">Все гиды →</a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <img 
                src={guide.image} 
                alt={guide.name}
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-1">{guide.name}</h3>
                <p className="text-gray-600 mb-4">{guide.specialty}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{guide.experience} опыта</span>
                  <span className="text-yellow-500">★ {guide.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuidesPreview;