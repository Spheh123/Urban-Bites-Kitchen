const restaurantPhone = "27671234567";

const menuItems = [
  {
    id: 1,
    name: "Midnight Truffle Gatsby",
    category: "Gatsby",
    price: 149.0,
    description:
      "Toasted roll layered with steak strips, truffle aioli, parmesan fries, and charred onion relish.",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Cape Heat Gatsby",
    category: "Gatsby",
    price: 132.0,
    description:
      "Spicy chicken, peri-peri fries, smoked slaw, and a glossy chilli butter finish.",
    image:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Gold Standard Burger",
    category: "Burgers",
    price: 118.0,
    description:
      "Prime beef patty, cheddar, caramelized onions, signature sauce, and crisp lettuce on a brioche bun.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "Black Pepper Smash",
    category: "Burgers",
    price: 124.0,
    description:
      "Double smashed patties, pepper glaze, cheddar, pickles, and onion jam with fries.",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    name: "Velvet Citrus Spritz",
    category: "Drinks",
    price: 52.0,
    description:
      "A bright sparkling mocktail with citrus syrup, mint, and a refined golden finish.",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    name: "Smoked Vanilla Cola",
    category: "Drinks",
    price: 44.0,
    description:
      "House-crafted cola with vanilla, citrus peel, and subtle smoked spice.",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
  },
];

const state = {
  activeCategory: "All",
  cart: [],
};

const menuGrid = document.querySelector("#menu-grid");
const filterGroup = document.querySelector("#menu-filters");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartCount = document.querySelector("#cart-count");
const whatsappOrder = document.querySelector("#whatsapp-order");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

function formatCurrency(value) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(value);
}

function renderFilters() {
  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];

  filterGroup.innerHTML = categories
    .map(
      (category) => `
        <button
          class="filter-chip ${state.activeCategory === category ? "active" : ""}"
          type="button"
          data-category="${category}"
        >
          ${category}
        </button>
      `
    )
    .join("");
}

function renderMenu() {
  const filteredItems =
    state.activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === state.activeCategory);

  menuGrid.innerHTML = filteredItems
    .map(
      (item) => `
        <article class="menu-card reveal is-visible">
          <img src="${item.image}" alt="${item.name}" />
          <div class="menu-card-body">
            <span class="tag">${item.category}</span>
            <div class="menu-card-top">
              <div>
                <h3>${item.name}</h3>
              </div>
              <span class="price">${formatCurrency(item.price)}</span>
            </div>
            <p>${item.description}</p>
            <button class="button button-primary" type="button" data-add-id="${item.id}">
              Add to Cart
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function updateWhatsAppLink(total) {
  if (state.cart.length === 0) {
    whatsappOrder.href = "#";
    whatsappOrder.setAttribute("aria-disabled", "true");
    whatsappOrder.classList.add("is-disabled");
    return;
  }

  const orderLines = state.cart.map((item) => `- ${item.name} x${item.quantity}`);
  const message = [
    "Hello Urban Bites Kitchen, I would like to place an order:",
    "",
    ...orderLines,
    "",
    `Subtotal: ${formatCurrency(total)}`,
    "Please confirm availability and collection/delivery details.",
  ].join("\n");

  whatsappOrder.href = `https://wa.me/${restaurantPhone}?text=${encodeURIComponent(message)}`;
  whatsappOrder.setAttribute("aria-disabled", "false");
  whatsappOrder.classList.remove("is-disabled");
}

function renderCart() {
  if (state.cart.length === 0) {
    cartItems.innerHTML =
      '<p class="cart-empty">Your cart is empty. Add menu items to begin.</p>';
    cartTotal.textContent = formatCurrency(0);
    cartCount.textContent = "0 items";
    updateWhatsAppLink(0);
    return;
  }

  const total = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <div class="cart-row">
          <div>
            <strong>${item.name}</strong>
            <p>${formatCurrency(item.price)} each</p>
            <div class="cart-qty">
              <button type="button" data-qty-change="-1" data-cart-id="${item.id}" aria-label="Decrease quantity">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-qty-change="1" data-cart-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <strong>${formatCurrency(item.price * item.quantity)}</strong>
        </div>
      `
    )
    .join("");

  cartTotal.textContent = formatCurrency(total);
  cartCount.textContent = `${totalItems} item${totalItems === 1 ? "" : "s"}`;
  updateWhatsAppLink(total);
}

function addToCart(itemId) {
  const existingItem = state.cart.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const item = menuItems.find((menuItem) => menuItem.id === itemId);
    state.cart.push({ ...item, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(itemId, delta) {
  state.cart = state.cart
    .map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + delta } : item
    )
    .filter((item) => item.quantity > 0);

  renderCart();
}

function setupScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupEvents() {
  filterGroup.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    state.activeCategory = button.dataset.category;
    renderFilters();
    renderMenu();
  });

  menuGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-id]");
    if (!button) return;
    addToCart(Number(button.dataset.addId));
  });

  cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-id]");
    if (!button) return;

    changeQuantity(
      Number(button.dataset.cartId),
      Number(button.dataset.qtyChange)
    );
  });

  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

renderFilters();
renderMenu();
renderCart();
setupEvents();
setupScrollReveal();
