let cart = [];

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  localStorage.setItem('leoCart', JSON.stringify(cart));
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  showAlert(`${product.name} added to cart!`, 'success');
  updateCartCount();
}

function renderCartItems() {
  const cartContainer = document.getElementById('cartItems');
  if (!cartContainer) return;

  cartContainer.innerHTML = '';
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    // Clear summary if cart is empty
    if (document.getElementById('cartSummary')) {
      document.getElementById('cartSummary').innerHTML = '';
    }
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <strong>${item.name}</strong><br>
          $${item.price} × ${item.qty} = $${item.price * item.qty}
        </div>
        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  // Cart summary and checkout button
  const summaryDiv = document.getElementById('cartSummary');
  if (summaryDiv) {
    let total = 0;
    try {
      total = cart.reduce((sum, item) => sum + (item.price * item.qty || 0), 0);
    } catch (e) {
      total = 0;
    }
    summaryDiv.innerHTML = `
      <div class="card p-3 bg-dark text-white">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span><strong>Total:</strong></span>
          <span style="font-size:1.2em;">$${total.toFixed(2)}</span>
        </div>
        <button class="btn btn-success w-100" onclick="checkoutCart()">Proceed to Checkout</button>
      </div>
    `;
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCartItems();
  showAlert('Item removed from cart.', 'info');
}

function checkoutCart() {
  // Get wallet balance from localStorage
  let walletBalance = parseFloat(localStorage.getItem('leoWalletBalance'));
  let total = 0;
  try {
    total = cart.reduce((sum, item) => sum + (item.price * item.qty || 0), 0);
  } catch (e) {
    total = 0;
  }
  if (isNaN(walletBalance)) walletBalance = 0;
  if (total > walletBalance) {
    showAlert('Insufficient balance to complete checkout.', 'danger');
    return;
  }
  // Deduct from balance and clear cart
  walletBalance -= total;
  localStorage.setItem('leoWalletBalance', walletBalance.toFixed(2));
  cart = [];
  updateCartCount();
  renderCartItems();
  if (document.getElementById('cartSummary')) {
    document.getElementById('cartSummary').innerHTML = '';
  }
  showAlert('Checkout successful! Your cart is now empty.', 'success');
}
