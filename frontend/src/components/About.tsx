const About = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Фото */}
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg" 
              alt="Гиды в горах"
              className="rounded-3xl shadow-2xl w-full h-full object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-[#1a1a2e] px-8 py-6 rounded-2xl shadow-xl">
              <div className="text-5xl font-bold">9</div>
              <div className="text-sm uppercase tracking-widest">лет в горах</div>
            </div>
          </div>

          {/* Текст */}
          <div>
            <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-5 py-2 rounded-full mb-6">
              С 2016 ГОДА
            </span>
            
            <h2 className="text-5xl font-bold leading-tight mb-8 text-gray-900">
              Мы живём в горах —<br />и делимся ими с вами
            </h2>

            <div className="space-y-6 text-lg text-gray-600">
              <p>
                Adventure Tours начинался с небольшой группы друзей, которые водили людей на Эльбрус. 
                Сегодня это команда из 25 профессиональных гидов, которая ежегодно проводит более 150 туров.
              </p>
              <p>
                Мы не продаём стандартные пакеты. Каждый маршрут собирается индивидуально под вашу группу, 
                уровень подготовки и желания.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl font-bold text-yellow-500">25</div>
                <div className="text-sm text-gray-500 mt-1">ГИДОВ</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-500">150+</div>
                <div className="text-sm text-gray-500 mt-1">ТУРОВ В ГОД</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-500">500+</div>
                <div className="text-sm text-gray-500 mt-1">КЛИЕНТОВ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;