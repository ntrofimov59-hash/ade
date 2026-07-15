const Footer = () => {
  return (
    <footer className="bg-[#0f0f1e] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Лого и описание */}
          <div>
            <div className="text-3xl font-bold text-white mb-4">
              Adventure<span className="text-yellow-400">Tours</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Настоящие горные приключения на Кавказе с 2016 года. 
              Безопасность, профессионализм и искреннее отношение к каждому гостю.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="text-white font-semibold mb-6">Навигация</h4>
            <div className="space-y-3">
              <a href="#tours" className="block hover:text-white transition-colors">Туры</a>
              <a href="#guides" className="block hover:text-white transition-colors">Гиды</a>
              <a href="#rentals" className="block hover:text-white transition-colors">Аренда транспорта</a>
              <a href="#about" className="block hover:text-white transition-colors">О нас</a>
            </div>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-white font-semibold mb-6">Контакты</h4>
            <div className="space-y-3">
              <p>+7 (999) 123-45-67</p>
              <p>info@adventure-tours.ru</p>
              <p>Приэльбрусье, Кабардино-Балкария</p>
            </div>
          </div>

          {/* Соцсети */}
          <div>
            <h4 className="text-white font-semibold mb-6">Мы в соцсетях</h4>
            <div className="flex gap-6">
              <a href="https://t.me/adventure_tours" target="_blank" className="hover:text-white transition-colors">Telegram</a>
              <a href="https://instagram.com/adventure_tours" target="_blank" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">VK</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm">
          © 2026 Adventure Tours. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;