import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#1a1a2e]/95 backdrop-blur-md border-b border-yellow-400/20">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="text-3xl font-bold text-white">
          Adventure<span className="text-yellow-400">Tours</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-white">
          <a href="#tours" className="hover:text-yellow-400 transition-colors">Туры</a>
          <a href="#guides" className="hover:text-yellow-400 transition-colors">Гиды</a>
          <a href="#rentals" className="hover:text-yellow-400 transition-colors">Аренда</a>
          <a href="#about" className="hover:text-yellow-400 transition-colors">О нас</a>
          <a href="#contact" className="hover:text-yellow-400 transition-colors">Контакты</a>
        </nav>

        <button 
          onClick={() => alert('Открывается модальное окно бронирования')}
          className="bg-yellow-400 text-[#1a1a2e] px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-all"
        >
          Забронировать
        </button>

        {/* Мобильное меню */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-3xl text-white"
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
