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
// обновляем цвет кнопки "В корзину", в зависимости от того, есть ли товар в корзине
function updateAddToCartButtons() {
   const cart = JSON.parse(localStorage.getItem('cart')) || [];
   const productCards = document.querySelectorAll('.product-card');
   productCards.forEach(card => {
      const id = card.dataset.id;
      const isInCart = cart.some(item => item.id === id);

      // Обновляем основную кнопку (на пк)
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
      // Обновляем мобильную иконку 
      const mobileBtn = card.querySelector('.btn-add-to-cart-mobile');
      if (mobileBtn) {
         if (isInCart) {
            mobileBtn.style.backgroundColor = 'rgba(74, 222, 128, 0.6)';
            mobileBtn.style.opacity = '0.8';
         } else {
            mobileBtn.style.backgroundColor = '';
            mobileBtn.style.opacity = '';
         }
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
         // обновляем цвета кнопок
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


// для получения из Local Storage на странице basket.html

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentSort = 'default';
document.addEventListener('DOMContentLoaded', () => {
   cart.forEach((item, i) => {
      if (item.addedAt === undefined) item.addedAt = i;
   });
   saveCart();
   renderCart();
   const cartContainer = document.getElementById('cart-content');
   cartContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('inc')) {
         const id = e.target.dataset.id;
         const added = e.target.dataset.added;
         changeQuantity(id, added, 1);
      } else if (e.target.classList.contains('dec')) {
         const id = e.target.dataset.id;
         const added = e.target.dataset.added;
         changeQuantity(id, added, -1);
      } else if (e.target.closest('.remove-btn')) {
         const btn = e.target.closest('.remove-btn');
         const id = btn.dataset.id;
         const added = btn.dataset.added;
         removeFromCart(id, added);
      }
   });
   document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
         currentSort = btn.dataset.sort;
         document.querySelectorAll('.sort-btn')
            .forEach(b => b.classList.remove('active'));
         btn.classList.add('active');
         renderCart();
      });
   });
   document.getElementById('clear-cart')?.addEventListener('click', () => {
      if (confirm('Очистить корзину?')) {
         cart = [];
         saveCart();
         renderCart();
      }
   });
   document.getElementById('checkout-btn')?.addEventListener('click', () => {
      if (cart.length === 0) {
         alert('Корзина пуста!');
         return;
      }
      let asa = 'Функция оформления заказа будет доступна в ближайшее время!' +
         '\nСпасибо за интерес к PC Components!';
      alert(asa);
   });
});

function renderCart() {
   const container = document.getElementById('cart-content');
   if (cart.length === 0) {
      container.innerHTML = `
              <div class="empty-cart">
                Ваша корзина пуста.<br>
                <a href="catalog.html" style="color: var(--accent); text-decoration: underline;">Перейти в каталог</a>
              </div>
            `;
      updateTotal();
      return;
   }
   let displayCart = [...cart];
   switch (currentSort) {
      case 'price-asc':
         displayCart.sort((a, b) => a.price - b.price);
         break;
      case 'price-desc':
         displayCart.sort((a, b) => b.price - a.price);
         break;
      case 'name':
         displayCart.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
         break;
      default:
         displayCart.sort((a, b) => a.addedAt - b.addedAt);
         break;
   }
   let html = '';
   displayCart.forEach(item => {
      const qty = item.quantity || 1;
      const itemTotal = item.price * qty;
      html += `
              <div class="cart-item" data-id="${item.id}" data-added="${item.addedAt}">
                <img src="${item.image || 'img/placeholder.jpg'}" alt="${item.name}">
                <div class="item-info">
                  <div class="item-header">
                    <h3>${item.name}</h3>
                    <button class="remove-btn" data-id="${item.id}" data-added="${item.addedAt}">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                  <div class="item-price">${item.price.toLocaleString()} ₽</div>
                  <div class="quantity-control">
                    <button class="quantity-btn dec" data-id="${item.id}" data-added="${item.addedAt}"
                     ${qty <= 1 ? 'disabled' : ''}>−</button>
                    <span class="quantity-value" data-id="${item.id}" data-added="${item.addedAt}">${qty}</span>
                    <button class="quantity-btn inc" data-id="${item.id}" data-added="${item.addedAt}">+</button>
                  </div>
                  <div class="item-total" data-id="${item.id}" data-added="${item.addedAt}">
                    Итого: <strong>${itemTotal.toLocaleString()} ₽</strong>
                  </div>
                </div>
              </div>
            `;
   });

   container.innerHTML = html;
   updateTotal();
}

function updateCartItemUI(id, addedAt) {
   const item = cart.find(i => i.id === id && i.addedAt == addedAt);
   if (!item) return;

   const qty = item.quantity || 1;
   const itemTotal = item.price * qty;

   const qtyEl = document.querySelector(`.quantity-value[data-id="${id}"][data-added="${addedAt}"]`);
   if (qtyEl) qtyEl.textContent = qty;

   const totalEl = document.querySelector(`.item-total[data-id="${id}"][data-added="${addedAt}"]`);
   if (totalEl) {
      totalEl.innerHTML = `Итого: <strong>${itemTotal.toLocaleString()} ₽</strong>`;
   }

   const decBtn = document.querySelector(`.quantity-btn.dec[data-id="${id}"][data-added="${addedAt}"]`);
   if (decBtn) {
      if (qty <= 1) {
         decBtn.disabled = true;
         decBtn.style.opacity = '0.5';
         decBtn.style.cursor = 'not-allowed';
      } else {
         decBtn.disabled = false;
         decBtn.style.opacity = '1';
         decBtn.style.cursor = 'pointer';
      }
   }

   updateTotal();
}

function updateTotal() {
   const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
   document.getElementById('total-price').textContent = total.toLocaleString() + ' ₽';
}

function removeFromCart(id, addedAt) {
   const index = cart.findIndex(i => i.id === id && i.addedAt == addedAt);
   if (index === -1) return;

   const itemEl = document.querySelector(`.cart-item[data-id="${id}"][data-added="${addedAt}"]`);
   if (itemEl) {
      itemEl.classList.add('fade-out');
      setTimeout(() => {
         cart.splice(index, 1);
         saveCart();
         renderCart();
      }, 300);
   }
}

function changeQuantity(id, addedAt, delta) {
   const item = cart.find(i => i.id === id && i.addedAt == addedAt);
   if (!item) return;

   const newQty = (item.quantity || 1) + delta;
   if (newQty < 1) return;

   item.quantity = newQty;
   saveCart();
   updateCartItemUI(id, addedAt);
}

function saveCart() {
   localStorage.setItem('cart', JSON.stringify(cart));
}