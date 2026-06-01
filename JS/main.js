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
    "#brands-filter-box .brand-item"
  );

  const productCards = document.querySelectorAll(
    "#catalog-products .product-card"
  );

  const noProductsMessage = document.getElementById(
    "no-products-message"
  );

  if (filterButtons.length > 0 && productCards.length > 0) {

    filterButtons.forEach((button) => {

      button.addEventListener("click", (e) => {

        e.preventDefault();

        filterButtons.forEach((btn) => {
          btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedFilter =
          button.getAttribute("data-filter");

        let visibleProductsCount = 0;

        productCards.forEach((card) => {

          const productBrand =
            card.getAttribute("data-brand");

          if (
            selectedFilter === "all" ||
            productBrand === selectedFilter
          ) {

            card.classList.remove("hidden");
            visibleProductsCount++;

          } else {

            card.classList.add("hidden");

          }
        });

        if (noProductsMessage) {

          noProductsMessage.style.display =
            visibleProductsCount === 0
              ? "block"
              : "none";
        }
      });
    });
  }

  // ==========================================
  // 3. LÓGICA DEL CARRITO
  // ==========================================
  const cartSidebar =
    document.getElementById("cart-sidebar");

  const cartOverlay =
    document.getElementById("cart-overlay");

  const closeCartBtn =
    document.getElementById("close-cart");

  const cartItemsContainer =
    document.getElementById(
      "cart-items-container"
    );

  const cartTotalPrice =
    document.querySelector(".cart-total-price");

  const floatingCartBtn =
    document.getElementById("floating-cart-btn");

  const cartCountBadge =
    document.getElementById("cart-count-badge");

  const btnWhatsapp =
    document.getElementById("btn-whatsapp");

  // ==========================================
  // ARRAY PRINCIPAL DEL CARRITO
  // ==========================================
  let cartList = [];

  // ==========================================
  // ABRIR CARRITO
  // ==========================================
  function openCart() {

    if (cartSidebar && cartOverlay) {

      cartSidebar.classList.add("open");
      cartOverlay.classList.add("active");

    }
  }

  // ==========================================
  // CERRAR CARRITO
  // ==========================================
  function closeCart() {

    if (cartSidebar && cartOverlay) {

      cartSidebar.classList.remove("open");
      cartOverlay.classList.remove("active");

    }
  }

  // ==========================================
  // EVENTOS DEL CARRITO
  // ==========================================
  if (closeCartBtn) {
    closeCartBtn.addEventListener(
      "click",
      closeCart
    );
  }

  if (cartOverlay) {
    cartOverlay.addEventListener(
      "click",
      closeCart
    );
  }

  if (floatingCartBtn) {

    floatingCartBtn.addEventListener(
      "click",
      (e) => {

        e.preventDefault();
        openCart();

      }
    );
  }

  // ==========================================
  // AGREGAR PRODUCTOS AL CARRITO
  // ==========================================
  document.body.addEventListener("click", (e) => {

    const boton =
      e.target.closest(".btn-add-cart");

    if (!boton) return;

    e.preventDefault();

    const productCard =
      boton.closest(".product-card");

    if (!productCard) return;

    const titleElement =
      productCard.querySelector(".product-title");

    const priceElement =
      productCard.querySelector(".current-price");

    // ==========================================
    // TALLA SELECCIONADA
    // ==========================================
    const selectedSizeInput =
      productCard.querySelector(
        'input[name="talla"]:checked'
      );

    const sizeText = selectedSizeInput
      ? ` (Talla: ${selectedSizeInput.value})`
      : "";

    if (!titleElement) return;

    const title =
      titleElement.textContent + sizeText;

    let price = 0;

    // ==========================================
    // OBTENER PRECIO
    // ==========================================
    if (boton.hasAttribute("data-price")) {

      price = parseFloat(
        boton.getAttribute("data-price")
      );

    } else if (
      boton.hasAttribute("data-precio")
    ) {

      price = parseFloat(
        boton.getAttribute("data-precio")
      );

    } else if (priceElement) {

      let priceText =
        priceElement.textContent;

      priceText = priceText
        .replace("S/.", "")
        .trim();

      const cleanPriceText =
        priceText.replace(/[^0-9.]/g, "");

      price = parseFloat(cleanPriceText);
    }

    // ==========================================
    // VALIDAR PRECIO
    // ==========================================
    if (!isNaN(price) && price > 0) {

      agregarAlCarrito(title, price);

    }
  });

  // ==========================================
  // FUNCIÓN AGREGAR AL CARRITO
  // ==========================================
  function agregarAlCarrito(title, price) {

    cartList.push({
      title,
      price
    });

    actualizarInterfazCarrito();

    openCart();
  }

  // ==========================================
  // ACTUALIZAR INTERFAZ DEL CARRITO
  // ==========================================
  function actualizarInterfazCarrito() {

    if (
      !cartItemsContainer ||
      !cartTotalPrice
    ) return;

    // ==========================================
    // BURBUJA DE CANTIDAD
    // ==========================================
    if (cartCountBadge) {

      cartCountBadge.textContent =
        cartList.length;

    }

    cartItemsContainer.innerHTML = "";

    // ==========================================
    // CARRITO VACÍO
    // ==========================================
    if (cartList.length === 0) {

      cartItemsContainer.innerHTML =
        '<p class="empty-cart-msg">Tu carrito está vacío.</p>';

      cartTotalPrice.textContent =
        "S/. 0.00";

      return;
    }

    // ==========================================
    // TOTAL
    // ==========================================
    let total = 0;

    cartList.forEach((item, index) => {

      total += item.price;

      const itemHTML = `
        <div class="cart-item">

          <div class="cart-item-info">
            <h4>${item.title}</h4>
            <span>S/. ${item.price.toFixed(2)}</span>
          </div>

          <button
            class="btn-remove-item"
            data-index="${index}"
          >
            Quitar
          </button>

        </div>
      `;

      cartItemsContainer.insertAdjacentHTML(
        "beforeend",
        itemHTML
      );
    });

    cartTotalPrice.textContent =
      `S/. ${total.toFixed(2)}`;

    // ==========================================
    // ELIMINAR PRODUCTOS
    // ==========================================
    const removeButtons =
      cartItemsContainer.querySelectorAll(
        ".btn-remove-item"
      );

    removeButtons.forEach((btn) => {

      btn.addEventListener("click", (e) => {

        const indexToRemove =
          e.target.getAttribute("data-index");

        cartList.splice(indexToRemove, 1);

        actualizarInterfazCarrito();

      });
    });
  }

// ==========================================
// 4. ENVÍO A WHATSAPP ESTILO ELEGANTE
// ==========================================
if (btnWhatsapp) {

  btnWhatsapp.addEventListener("click", () => {

    const numero = "51946458737";

    // VALIDAR CARRITO
    if (cartList.length === 0) {

      alert("Tu carrito está vacío");

      return;
    }

    // ==========================================
    // CREAR MENSAJE
    // ==========================================
    let mensaje = `¡Hola ALONDRA Zapatería! 👟
Me gustaría realizar el pedido de las siguientes zapatillas:

--------------------------------------------

`;

    let total = 0;

    cartList.forEach((producto, index) => {

      total += producto.price;

      mensaje += `${index + 1}. ${producto.title}
Precio: S/. ${producto.price.toFixed(2)}

`;

    });

    mensaje += `--------------------------------------------

Total a Pagar: S/. ${total.toFixed(2)}`;

    // ==========================================
    // CODIFICAR MENSAJE
    // ==========================================
    const mensajeCodificado =
      encodeURIComponent(mensaje);

    // ==========================================
    // URL WHATSAPP
    // ==========================================
    const url =
      `https://wa.me/${numero}?text=${mensajeCodificado}`;

    // ==========================================
    // ABRIR WHATSAPP
    // ==========================================
    window.open(url, "_blank");

  });

}

});