/*************** Data *****************/
const PRODUCTS = [
  {
    id: "p1",
    name: "AeroFit Smart Watch",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=1200&q=80&auto=format&fit=crop",
    category: "Wearables",
    description: "24/7 heart-rate, sleep tracking, notifications, 7-day battery."
  },
  {
    id: "p2",
    name: "Sonic Buds Pro",
    price: 59.00,
    image: "https://images.unsplash.com/photo-1518441902113-c1d3b2a21e37?w=1200&q=80&auto=format&fit=crop",
    category: "Audio",
    description: "Active noise-cancelling wireless earbuds with charging case."
  },
  {
    id: "p3",
    name: "Peak Runner Shoes",
    price: 89.50,
    image: "https://images.unsplash.com/photo-1528701800489-20be3c2ea5be?w=1200&q=80&auto=format&fit=crop",
    category: "Footwear",
    description: "Lightweight running shoes with breathable knit upper."
  },
  {
    id: "p4",
    name: "Urban Pack 25L",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1520975693411-b37da9411bfb?w=1200&q=80&auto=format&fit=crop",
    category: "Bags",
    description: "Water-resistant everyday backpack with laptop sleeve."
  },
  {
    id: "p5",
    name: "Polar Jacket",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=1200&q=80&auto=format&fit=crop",
    category: "Apparel",
    description: "All-weather insulated jacket with storm hood."
  },
  {
    id: "p6",
    name: "Focus Keyboard",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop",
    category: "Accessories",
    description: "Low-profile mechanical keyboard with white backlight."
  },
  {
    id: "p7",
    name: "Voyage Sunglasses",
    price: 29.90,
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80&auto=format&fit=crop",
    category: "Accessories",
    description: "Polarized lenses with UV400 protection."
  },
  {
    id: "p8",
    name: "Hydro Bottle 1L",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&q=80&auto=format&fit=crop",
    category: "Outdoor",
    description: "BPA-free stainless steel bottle keeps drinks cold 24h."
  }
];

/*************** Cart (LocalStorage) *****************/
const CART_KEY = "perform_cart_v1";
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const cartCountEl = document.querySelectorAll("[data-cart-count]");

function updateCartBadge(){
  const count = getCart().reduce((n,i)=>n + i.qty, 0);
  cartCountEl.forEach(el => el.textContent = count);
}
function addToCart(id, qty=1){
  const cart = getCart();
  const item = cart.find(c=>c.id===id);
  if(item){ item.qty += qty; } else { cart.push({id, qty}); }
  saveCart(cart); updateCartBadge();
}
function setQty(id, qty){
  const cart = getCart().map(i=> i.id===id ? {...i, qty: Math.max(1, qty)} : i);
  saveCart(cart); updateCartBadge();
}
function removeFromCart(id){
  saveCart(getCart().filter(i=>i.id!==id));
  updateCartBadge();
}
function emptyCart(){
  saveCart([]); updateCartBadge();
}
function productById(id){ return PRODUCTS.find(p=>p.id===id); }
updateCartBadge();

/*************** Page: Products listing *****************/
const productsGrid = document.getElementById("productsGrid");
if(productsGrid){
  const params = new URLSearchParams(location.search);
  const q = (params.get("q")||"").toLowerCase();
  const filtered = q ? PRODUCTS.filter(p=> p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : PRODUCTS;

  productsGrid.innerHTML = filtered.map(p=>`
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <div class="card product-card h-100">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <span class="badge-cat mb-2">${p.category}</span>
          <h6 class="mb-1">${p.name}</h6>
          <div class="mb-2"><span class="price">$${p.price.toFixed(2)}</span></div>
          <div class="mt-auto d-grid gap-2">
            <a class="btn btn-outline-secondary" href="product.html?id=${p.id}"><i class="fa-regular fa-eye me-1"></i> View</a>
            <button class="btn btn-primary" data-add="${p.id}"><i class="fa-solid fa-cart-plus me-1"></i> Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  productsGrid.addEventListener("click",(e)=>{
    const btn = e.target.closest("[data-add]");
    if(!btn) return;
    addToCart(btn.getAttribute("data-add"), 1);
  });
}

/*************** Page: Product detail *****************/
const pdpWrap = document.getElementById("pdpWrap");
if(pdpWrap){
  const id = new URLSearchParams(location.search).get("id");
  const p = productById(id) || PRODUCTS[0];
  pdpWrap.innerHTML = `
    <div class="row g-4 align-items-start">
      <div class="col-lg-6">
        <img class="pdp-img shadow" src="${p.image}" alt="${p.name}">
      </div>
      <div class="col-lg-6">
        <span class="badge-cat mb-2">${p.category}</span>
        <h2 class="fw-bold">${p.name}</h2>
        <p class="text-muted">${p.description}</p>
        <div class="h4 my-3">$${p.price.toFixed(2)}</div>
        <div class="d-flex align-items-center gap-2 my-3">
          <label class="form-label m-0">Qty</label>
          <input type="number" min="1" value="1" class="form-control qty-input" id="qtyInput">
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary" id="addBtn"><i class="fa-solid fa-cart-plus me-2"></i>Add to Cart</button>
          <a href="products.html" class="btn btn-outline-secondary">Back to Products</a>
        </div>
      </div>
    </div>
  `;
  document.getElementById("addBtn").addEventListener("click", ()=>{
    const qty = Math.max(1, parseInt(document.getElementById("qtyInput").value || "1", 10));
    addToCart(p.id, qty);
  });
}

/*************** Page: Cart *****************/
const cartTable = document.getElementById("cartTable");
const cartSummary = document.getElementById("cartSummary");

function renderCart(){
  if(!cartTable || !cartSummary) return;
  const cart = getCart();
  if(cart.length===0){
    cartTable.innerHTML = `<div class="empty-state text-center">
      <h5 class="mb-2">Your cart is empty</h5>
      <p class="text-muted mb-3">Start shopping to add items to your cart.</p>
      <a class="btn btn-primary" href="products.html"><i class="fa-solid fa-bag-shopping me-1"></i> Browse Products</a>
    </div>`;
    cartSummary.innerHTML = "";
    return;
  }

  let subtotal = 0;
  const rows = cart.map(item=>{
    const p = productById(item.id);
    const line = p.price * item.qty; subtotal += line;
    return `
      <tr>
        <td><img class="thumb me-2" src="${p.image}" alt="${p.name}">${p.name}<div class="text-muted small">${p.category}</div></td>
        <td>$${p.price.toFixed(2)}</td>
        <td>
          <input type="number" min="1" class="form-control form-control-sm qty" data-id="${p.id}" value="${item.qty}">
        </td>
        <td class="fw-semibold">$${line.toFixed(2)}</td>
        <td><button class="btn btn-sm btn-outline-danger" data-remove="${p.id}"><i class="fa-regular fa-trash-can"></i></button></td>
      </tr>
    `;
  }).join("");

  cartTable.innerHTML = `
    <div class="table-responsive">
      <table class="table align-middle">
        <thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;

  const shipping = subtotal > 0 ? 7.5 : 0;
  const tax = subtotal * 0.08;
  const grand = subtotal + shipping + tax;

  cartSummary.innerHTML = `
    <div class="card p-3">
      <h6 class="mb-3">Order Summary</h6>
      <div class="d-flex justify-content-between"><span>Subtotal</span><strong>$${subtotal.toFixed(2)}</strong></div>
      <div class="d-flex justify-content-between"><span>Shipping</span><strong>$${shipping.toFixed(2)}</strong></div>
      <div class="d-flex justify-content-between"><span>Tax (8%)</span><strong>$${tax.toFixed(2)}</strong></div>
      <hr>
      <div class="d-flex justify-content-between h5"><span>Total</span><strong>$${grand.toFixed(2)}</strong></div>
      <button class="btn btn-primary w-100 mt-3" id="checkoutBtn"><i class="fa-solid fa-lock me-1"></i> Checkout</button>
      <button class="btn btn-outline-secondary w-100 mt-2" id="emptyBtn">Empty Cart</button>
    </div>
  `;

  cartTable.addEventListener("input",(e)=>{
    const q = e.target.closest(".qty");
    if(!q) return;
    const id = q.getAttribute("data-id");
    const val = Math.max(1, parseInt(q.value||"1",10));
    setQty(id, val);
    renderCart();
  });
  cartTable.addEventListener("click",(e)=>{
    const btn = e.target.closest("[data-remove]");
    if(!btn) return;
    removeFromCart(btn.getAttribute("data-remove"));
    renderCart();
  });
  document.getElementById("emptyBtn").addEventListener("click", ()=>{ emptyCart(); renderCart(); });
  document.getElementById("checkoutBtn").addEventListener("click", ()=>{ alert("Demo: Frontend-only checkout. Implement backend to proceed."); });
}
renderCart();

/*************** Navbar search (products page redirect) *****************/
const navSearch = document.getElementById("navSearch");
const navSearchBtn = document.getElementById("navSearchBtn");
if(navSearchBtn){
  navSearchBtn.addEventListener("click", ()=>{
    const q = (navSearch.value||"").trim();
    location.href = q ? `products.html?q=${encodeURIComponent(q)}` : 'products.html';
  });
}
if(navSearch){
  navSearch.addEventListener("keydown",(e)=>{ if(e.key==="Enter"){ e.preventDefault(); navSearchBtn.click(); }});
}
