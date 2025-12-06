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
document.addEventListener('DOMContentLoaded', () => {
   const wrapper = document.getElementById('reviewsWrapper');
   const prevBtn = document.getElementById('prevBtn');
   const nextBtn = document.getElementById('nextBtn');
   const dotsContainer = document.getElementById('carouselDots');
   const cards = wrapper.children;
   const cardCount = cards.length;
   let currentIndex = 0;

   // Создание точек
   for (let i = 0; i < cardCount; i++) {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
   }
   updateDots();

   // Переключение на слайд
   function goToSlide(index) {
      if (index < 0) index = cardCount - 1;
      if (index >= cardCount) index = 0;
      currentIndex = index;
      wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
   }

   // Обновление активной точки
   function updateDots() {
      const dots = dotsContainer.children;
      for (let i = 0; i < dots.length; i++) {
         dots[i].classList.toggle('active', i === currentIndex);
      }
   }

   // Кнопки
   prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
   nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

   // Автопрокрутка (опционально, можно убрать)
   // setInterval(() => goToSlide(currentIndex + 1), 5000);
});



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
