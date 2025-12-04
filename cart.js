// Функция добавления товара в корзину
function addToCart(product) {
   let cart = JSON.parse(localStorage.getItem('cart')) || [];

   // Проверяем, есть ли уже такой товар
   const existing = cart.find(item => item.id === product.id);
   if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
   } else {
      cart.push({ ...product, quantity: 1 });
   }

   localStorage.setItem('cart', JSON.stringify(cart));
   updateCartBadge(); // обновить счётчик в шапке (опционально)
   alert('Товар добавлен в корзину!');
}

// Обновление значка количества товаров в корзине (если есть иконка 🛒)
function updateCartBadge() {
   const cart = JSON.parse(localStorage.getItem('cart')) || [];
   const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
   const badge = document.querySelector('#cart-count');
   if (badge) badge.textContent = totalItems;
}

// Обработчик клика по кнопке "В корзину"
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
   });
});

// Вызов при загрузке страницы (чтобы обновить значок)
document.addEventListener('DOMContentLoaded', updateCartBadge);