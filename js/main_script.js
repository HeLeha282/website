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