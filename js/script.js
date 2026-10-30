
const WHATSAPP_NUMBER = "255760684043";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Accessories",
    price: 85000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Accessories",
    price: 120000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
  },
  {
    id: 3,
    name: "Modern Laptop",
    category: "Computers",
    price: 950000,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"
  },
  {
    id: 4,
    name: "Smartphone",
    category: "Phones",
    price: 650000,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
  },
  {
    id: 5,
    name: "Wireless Earbuds",
    category: "Accessories",
    price: 65000,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600"
  },
  {
    id: 6,
    name: "Tablet Device",
    category: "Computers",
    price: 450000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600"
  },
  {
    id: 7,
    name: "Android Phone",
    category: "Phones",
    price: 380000,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"
  },
  {
    id: 8,
    name: "Gaming Headset",
    category: "Accessories",
    price: 110000,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=600"
  }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");

let cart = JSON.parse(localStorage.getItem("technova-cart")) || [];

function formatPrice(price) {
  return new Intl.NumberFormat("en-TZ").format(price);
}

function saveCart() {
  localStorage.setItem("technova-cart", JSON.stringify(cart));
}

function renderProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-price">TZS ${formatPrice(product.price)}</p>
        <button class="add-button" data-add="${product.id}">
          Add to Cart +
        </button>
      </div>
    </article>
  `).join("");

  document.getElementById("productTotal").textContent =
    `${filteredProducts.length} Products`;

  document.getElementById("emptyMessage").hidden =
    filteredProducts.length !== 0;
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  document.getElementById("cartCount").textContent = totalQuantity;
  document.getElementById("cartTotal").textContent =
    `TZS ${formatPrice(totalPrice)}`;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>TZS ${formatPrice(item.price)}</p>
        <div class="quantity-controls">
          <button data-minus="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button data-plus="${item.id}">+</button>
          <button class="remove-button" data-remove="${item.id}">
            Remove
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("active");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("active");
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty. Add products first.");
    return;
  }

  if (!/^255\d{9}$/.test(WHATSAPP_NUMBER)) {
    alert("Please configure the store WhatsApp number in script.js first.");
    return;
  }

  const orderLines = cart.map(item =>
    `${item.name} x ${item.quantity} = TZS ${formatPrice(item.price * item.quantity)}`
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const message = [
    "Hello TechNova Store!",
    "",
    "I would like to place this order:",
    ...orderLines,
    "",
    `TOTAL: TZS ${formatPrice(total)}`,
    "",
    "Please confirm availability and delivery details."
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(Number(button.dataset.add));
  }
});

cartItems.addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  const remove = event.target.closest("[data-remove]");

  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
  if (remove) removeFromCart(Number(remove.dataset.remove));
});

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("checkoutButton").addEventListener(
  "click", checkoutWhatsApp
);

document.getElementById("clearCart").addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

document.getElementById("contactButton").addEventListener("click", event => {
  event.preventDefault();

  if (!/^255\d{9}$/.test(WHATSAPP_NUMBER)) {
    alert("Please configure the store WhatsApp number in script.js first.");
    return;
  }

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello TechNova Store, I need more information.")}`,
    "_blank",
    "noopener,noreferrer"
  );
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
