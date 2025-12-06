function initBurgerMenu() {
   const header = document.querySelector("header");
   const burger = document.getElementById("burger");
   const nav = header.querySelector('nav');


   if (!header || !burger) return;//защита от ошибок, если не найдется header или burger

   burger.addEventListener("click", function (e) {
      e.stopPropagation(); // предотвращаем закрытие при клике на бургер 
      // (то есть следующий слушатель событий)
      header.classList.toggle("open");
   });

   // Закрытие при клике вне header
   document.addEventListener("click", function (e) {
      if (!nav.contains(e.target)) {
         header.classList.remove("open");
      }
   });

   // Закрытие по нажатию Esc (опционально, но удобно)
   document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
         header.classList.remove("open");
      }
   });
}

initBurgerMenu();


// для карусели в reviews
// Карусель отзывов
function initReviewsCarousel() {
   const track = document.getElementById('carouselTrack');
   const dotsContainer = document.getElementById('carouselDots');
   const prevBtn = document.getElementById('prevBtn');
   const nextBtn = document.getElementById('nextBtn');
   const cards = document.querySelectorAll('.review-card');

   if (!track || cards.length === 0) return;

   let currentIndex = 0;
   let cardsPerView = getCardsPerView();
   let totalSlides = Math.ceil(cards.length / cardsPerView);

   // Создаем индикаторы
   function createIndicators() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
         const dot = document.createElement('span');
         dot.addEventListener('click', () => goToSlide(i));
         dotsContainer.appendChild(dot);
      }
      updateIndicators();
   }

   // Обновляем индикаторы
   function updateIndicators() {
      const dots = dotsContainer.querySelectorAll('span');
      dots.forEach((dot, index) => {
         dot.classList.toggle('active', index === currentIndex);
      });
   }

   // Получаем количество карточек на экране
   function getCardsPerView() {
      return window.innerWidth <= 768 ? 1 : 2;
   }

   // Переход к конкретному слайду
   function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
      updateCarousel();
   }

   // Обновляем карусель
   function updateCarousel() {
      const cardWidth = cards[0].offsetWidth + 30; // ширина карточки + gap
      const translateX = -currentIndex * cardsPerView * cardWidth;
      track.style.transform = `translateX(${translateX}px)`;
      updateIndicators();
   }

   // Следующий слайд
   function nextSlide() {
      if (currentIndex < totalSlides - 1) {
         currentIndex++;
      } else {
         currentIndex = 0; // Возврат к началу
      }
      updateCarousel();
   }

   // Предыдущий слайд
   function prevSlide() {
      if (currentIndex > 0) {
         currentIndex--;
      } else {
         currentIndex = totalSlides - 1; // Переход к последнему
      }
      updateCarousel();
   }

   // Автопрокрутка (опционально)
   let autoSlideInterval;

   function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 5000); // 5 секунд
   }

   function stopAutoSlide() {
      clearInterval(autoSlideInterval);
   }

   // Обработчики событий
   prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoSlide();
      startAutoSlide();
   });

   nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoSlide();
      startAutoSlide();
   });

   // Обработчик изменения размера окна
   function handleResize() {
      cardsPerView = getCardsPerView();
      totalSlides = Math.ceil(cards.length / cardsPerView);
      createIndicators();
      updateCarousel();
   }

   // Пауза автопрокрутки при наведении
   track.addEventListener('mouseenter', stopAutoSlide);
   track.addEventListener('mouseleave', startAutoSlide);

   // Инициализация
   createIndicators();
   updateCarousel();
   startAutoSlide();

   // Обработчик изменения размера окна
   window.addEventListener('resize', handleResize);

   // Touch events для мобильных устройств
   let startX = 0;
   let isDragging = false;

   track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      stopAutoSlide();
   });

   track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;

      if (Math.abs(diff) > 50) {
         if (diff > 0) {
            nextSlide();
         } else {
            prevSlide();
         }
         isDragging = false;
      }
   });

   track.addEventListener('touchend', () => {
      isDragging = false;
      startAutoSlide();
   });
}

// Инициализируем карусель при загрузке DOM
document.addEventListener('DOMContentLoaded', initReviewsCarousel);




//для поднятия картинки в товарах пори добавлении в корзину /pages
// для поднятия картинки в товарах при добавлении в корзину /pages
document.addEventListener('DOMContentLoaded', () => {
   // ... ваша существующая логика ...

   // НОВОЕ: анимация увеличения изображения и бордер для карточки при нажатии на иконку корзины
   document.querySelectorAll('.btn-add-to-cart-mobile').forEach(icon => {
      icon.addEventListener('click', function () {
         const productCard = this.closest('.product-card');
         const img = productCard.querySelector('img');

         // Анимация изображения
         if (img) {
            img.style.transform = 'scale(1.03)';
            img.style.transition = 'transform 0.15s linear';
         }

         // Анимация карточки
         productCard.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.25)';
         productCard.style.borderColor = 'rgba(67, 97, 238, 0.4)';
         productCard.style.transition = 'box-shadow 0.15s linear, border-color 0.15s linear';

         setTimeout(() => {
            // Возврат изображения
            if (img) {
               img.style.transform = 'scale(1)';
               // transition можно не повторять — он уже задан
            }

            // Возврат карточки к исходному состоянию
            productCard.style.transform = '';
            productCard.style.boxShadow = '';
            productCard.style.borderColor = '';
            // transition остаётся — браузер сам плавно вернёт значения из CSS
         }, 300);
      });
   });
});
