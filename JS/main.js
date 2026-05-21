document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. CONTROL DEL MENÚ MÓVIL
  // ==========================================
  const menuToggle = document.getElementById("mobile-menu");
  const navMenu = document.getElementById("nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      navMenu.classList.toggle("active");
      if (navMenu.classList.contains("active")) {
        menuToggle.textContent = "✕";
      } else {
        menuToggle.textContent = "☰";
      }
    });
  }

  // ==========================================
  // 2. SISTEMA DE FILTRO DE MARCAS
  // ==========================================
  const filterButtons = document.querySelectorAll(
    "#brands-filter-box .brand-item",
  );
  const productCards = document.querySelectorAll(
    "#catalog-products .product-card",
  );
  const noProductsMessage = document.getElementById("no-products-message");

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const selectedFilter = button.getAttribute("data-filter");
        let visibleProductsCount = 0;

        productCards.forEach((card) => {
          const productBrand = card.getAttribute("data-brand");
          if (selectedFilter === "all" || productBrand === selectedFilter) {
            card.classList.remove("hidden");
            visibleProductsCount++;
          } else {
            card.classList.add("hidden");
          }
        });

        if (noProductsMessage) {
          noProductsMessage.style.display =
            visibleProductsCount === 0 ? "block" : "none";
        }
      });
    });
  }

  // ==========================================
  // 3. LÓGICA DEL CARRITO CON BOTÓN FLOTANTE
  // ==========================================
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotalPrice = document.querySelector(".cart-total-price");

  // Captura el nuevo botón volador y su burbuja numérica
  const floatingCartBtn = document.getElementById("floating-cart-btn");
  const cartCountBadge = document.getElementById("cart-count-badge");

  let cartList = [];

  function openCart() {
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.add("open");
      cartOverlay.classList.add("active");
    }
  }

  function closeCart() {
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.remove("open");
      cartOverlay.classList.remove("active");
    }
  }

  // Eventos para cerrar (Fondo oscuro y botón X)
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // Abrir el carrito lateral desde el nuevo botón flotante
  if (floatingCartBtn) {
    floatingCartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    });
  }

  // Captura el clic en cualquier botón de agregar de las tarjetas de producto
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-add-cart")) {
      e.preventDefault();

      const productCard = e.target.closest(".product-card");
      if (productCard) {
        const titleElement = productCard.querySelector(".product-title");
        const priceElement = productCard.querySelector(".current-price");

        if (titleElement && priceElement) {
          const title = titleElement.textContent;
          const priceText = priceElement.textContent;
          // Limpia el texto para dejar solo el número decimal
          const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));

          agregarAlCarrito(title, price);
        }
      }
    }
  });

  function agregarAlCarrito(title, price) {
    cartList.push({ title, price });
    actualizarInterfazCarrito();
    openCart(); // Abre el menú deslizable automáticamente al añadir
  }

  function actualizarInterfazCarrito() {
    if (!cartItemsContainer || !cartTotalPrice) return;

    // Actualiza el número de la burbuja flotante del botón volador
    if (cartCountBadge) {
      cartCountBadge.textContent = cartList.length;
    }

    cartItemsContainer.innerHTML = "";

    if (cartList.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
      cartTotalPrice.textContent = "S/. 0.00";
      return;
    }

    let total = 0;

    cartList.forEach((item, index) => {
      total += item.price;
      const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <span>S/. ${item.price.toFixed(2)}</span>
                    </div>
                    <button class="btn-remove-item" data-index="${index}">Quitar</button>
                </div>
            `;
      cartItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
    });

    cartTotalPrice.textContent = `S/. ${total.toFixed(2)}`;

    // Evento para eliminar productos individuales dentro del carrito lateral
    const removeButtons =
      cartItemsContainer.querySelectorAll(".btn-remove-item");
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const indexToRemove = e.target.getAttribute("data-index");
        cartList.splice(indexToRemove, 1);
        actualizarInterfazCarrito();
      });
    });
  }
});
