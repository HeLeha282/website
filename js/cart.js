// Функция добавления товара в корзину
function addToCart(product) {
   let cart = JSON.parse(localStorage.getItem('cart')) || [];
   const existing = cart.find(item => item.id === product.id);
   if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
   } else {
      cart.push({ ...product, quantity: 1 });
   }
   localStorage.setItem('cart', JSON.stringify(cart));
   updateCartBadge();
}

// Обновление счётчика в шапке
function updateCartBadge() {
   const cart = JSON.parse(localStorage.getItem('cart')) || [];
   const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
   const badge = document.querySelector('#cart-count');
   if (badge) badge.textContent = totalItems;
}

// Обновляет UI кнопки "В корзину" на основе наличия товара в корзине
function updateAddToCartButtons() {
   const cart = JSON.parse(localStorage.getItem('cart')) || [];
   const productCards = document.querySelectorAll('.product-card');

   productCards.forEach(card => {
      const id = card.dataset.id;
      const isInCart = cart.some(item => item.id === id);

      // Обновляем основную кнопку (desktop)
      const desktopBtn = card.querySelector('.btn-add-to-cart');
      if (desktopBtn) {
         if (isInCart) {
            desktopBtn.textContent = 'Товар в корзине';
            desktopBtn.style.backgroundColor = 'var(--success)';
            desktopBtn.style.boxShadow = '1px 1px 8px rgba(39, 220, 11, 0.3)';
            desktopBtn.disabled = true;
         } else {
            desktopBtn.textContent = 'В корзину';
            desktopBtn.style.backgroundColor = '';
            desktopBtn.style.boxShadow = '';
            desktopBtn.disabled = false;
         }
      }

      // Обновляем мобильную иконку (если нужно визуальное отличие)
      const mobileBtn = card.querySelector('.btn-add-to-cart-mobile');
      if (mobileBtn) {
         if (isInCart) {
            mobileBtn.style.backgroundColor = 'rgba(74, 222, 128, 0.6)'; // var(--success) не работает в inline-style!
            mobileBtn.style.opacity = '0.8';
         } else {
            mobileBtn.style.backgroundColor = '';
            mobileBtn.style.opacity = '';
         }
         // ⚠️ Не делайте mobileBtn.disabled — это <span>, disabled не работает!
      }
   });
}

// Обработчики кликов
document.addEventListener('DOMContentLoaded', () => {
   // Инициализация кнопок при загрузке
   updateAddToCartButtons();

   // Основная кнопка "В корзину"
   document.querySelectorAll('.btn-add-to-cart').forEach(button => {
      button.addEventListener('click', function () {
         const card = this.closest('.product-card');
         const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseFloat(card.dataset.price),
            image: card.dataset.image
         };
         addToCart(product);
         // Обновляем UI — можно обновить только эту кнопку, но проще всё
         updateAddToCartButtons();
      });
   });

   // Мобильная иконка
   document.querySelectorAll('.btn-add-to-cart-mobile').forEach(icon => {
      icon.addEventListener('click', function () {
         const card = this.closest('.product-card');
         const id = card.dataset.id;
         const cart = JSON.parse(localStorage.getItem('cart')) || [];
         if (cart.some(item => item.id === id)) return; // уже в корзине — ничего не делать

         // иначе — добавляем
         const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseFloat(card.dataset.price),
            image: card.dataset.image
         };
         addToCart(product);
         updateAddToCartButtons();
      });
   });

   // Обновить счётчик в шапке
   updateCartBadge();
});