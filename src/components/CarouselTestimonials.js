import React, { useState, useEffect } from "react";
import styles from "../styles/TestimonyCarousel.module.css";

const testimonials = [
  {
    id: 1,
    author: "John Doe",
    text: "This gym changed my life! The trainers are amazing, and the environment is so motivating.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    author: "Jane Smith",
    text: "Great experience! The workouts are tough, but I love every minute of it. Highly recommend!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    author: "Paul Johnson",
    text: "Excellent trainers and a motivating environment. I'm in the best shape of my life!",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 4,
    author: "Emily Brown",
    text: "Friendly staff and the best workout routines. Highly recommend for anyone looking to get fit.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 5,
    author: "Mike Wilson",
    text: "I love the flexible schedules and the personal attention I get from the instructors.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: 6,
    author: "Sophie Taylor",
    text: "The perfect place to stay fit and healthy. Great instructors and workout plans.",
    image: "https://randomuser.me/api/portraits/women/31.jpg",
  },
  {
    id: 7,
    author: "Chris Green",
    text: "The support and guidance I've received here is exceptional. It has truly been life-changing!",
    image: "https://randomuser.me/api/portraits/men/16.jpg",
  },
];

const CarouselTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [testimonialsPerPage, setTestimonialsPerPage] = useState(3);

  // Manejar el número de testimonios por página basado en el ancho de la ventana
  useEffect(() => {
    const updateTestimonialsPerPage = () => {
      setTestimonialsPerPage(window.innerWidth <= 768 ? 2 : 3);
    };

    updateTestimonialsPerPage(); // Establecer el valor inicial
    window.addEventListener("resize", updateTestimonialsPerPage); // Escuchar redimensionamientos

    return () => window.removeEventListener("resize", updateTestimonialsPerPage); // Limpiar el evento
  }, []);

  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
    }, 3000); // Cambiar cada 3 segundos
    return () => clearInterval(interval);
  }, [isHovered, totalPages]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const getTransformValue = () => {
    const percentage = 100 / testimonialsPerPage;
    return `translateX(-${currentIndex * percentage}%)`;
  };

  return (
    <div
      className={styles.carousel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={styles.testimonialContainer}
        style={{
          transform: getTransformValue(),
        }}
      >
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className={styles.card}>
            <img
              src={testimonial.image}
              alt={testimonial.author}
              className="rounded-full"
            />
            <p className={styles.text}>{testimonial.text}</p>
            <p className={styles.author}>{testimonial.author}</p>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${
              currentIndex === index ? styles.active : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CarouselTestimonials;


