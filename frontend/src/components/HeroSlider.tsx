import { useState, useEffect } from 'react';

const slides = [
  {
    image: "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg",
    title: "Открой горы с нами",
    subtitle: "Восхождения, гастротуризм и незабываемые приключения на Кавказе"
  },
  {
    image: "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg",
    title: "Гастрономические туры",
    subtitle: "Дегустации лучших сыров и вин Кавказа"
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    title: "Аренда транспорта",
    subtitle: "Внедорожники, байки и велосипеды для гор"
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `linear-gradient(rgba(26,26,46,0.7), rgba(26,26,46,0.8)), url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-32">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {slide.title}
            </h1>
            <p className="text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              {slide.subtitle}
            </p>
            <button 
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-400 hover:bg-yellow-300 text-[#1a1a2e] text-xl font-semibold px-10 py-5 rounded-full transition-all duration-300"
            >
              Забронировать тур
            </button>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all ${index === currentSlide ? 'bg-yellow-400 scale-125' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;