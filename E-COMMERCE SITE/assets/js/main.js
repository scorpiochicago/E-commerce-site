/* assets/js/main.js */

function showSpinner() {
    document.getElementById('globalSpinner').style.display = 'flex';
}

function hideSpinner() {
    document.getElementById('globalSpinner').style.display = 'none';
}

let walletAddress = null;
let walletBalance = 0;

function renderProducts() {
    const list = document.getElementById('productList');
    if (!list) return;
    showSpinner();
    setTimeout(() => {
        list.innerHTML = '';
        const template = document.getElementById('productTemplate');
        products.forEach(prod => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.product-img').src = prod.image;
            clone.querySelector('.product-name').textContent = prod.name;
            clone.querySelector('.product-price').textContent = `$${prod.price.toFixed(2)}`;
            clone.querySelector('.product-category').textContent = prod.category;
            const btn = clone.querySelector('.add-to-cart');
            btn.onclick = () => addToCart(prod);
            list.appendChild(clone);
        });
        hideSpinner();
    }, 500);
}

function showAlert(message, type = 'success') {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert alert-${type} show`;
    alert.classList.remove('d-none');
    setTimeout(() => alert.classList.add('d-none'), 3000);
}

function connectWallet() {
    showSpinner();
    setTimeout(() => {
        walletAddress = 'aleo1xyz...abc';
        document.getElementById('walletAddress').textContent = walletAddress.slice(0, 8) + '...' + walletAddress.slice(-4);
        walletBalance = (Math.random() * 100).toFixed(2);
        document.getElementById('walletBalance').textContent = walletBalance + ' ALEO';
        document.getElementById('connectWallet').classList.add('d-none');
        document.getElementById('disconnectWallet').classList.remove('d-none');
        showAlert('Wallet connected successfully!');
        hideSpinner();
    }, 700);
}

function disconnectWallet() {
    showSpinner();
    setTimeout(() => {
        walletAddress = null;
        walletBalance = 0;
        document.getElementById('walletAddress').textContent = '';
        document.getElementById('walletBalance').textContent = '0 ALEO';
        document.getElementById('connectWallet').classList.remove('d-none');
        document.getElementById('disconnectWallet').classList.add('d-none');
        showAlert('Wallet disconnected.', 'info');
        hideSpinner();
    }, 500);
}

function depositFunds(amount) {
    if (!walletAddress) return showAlert('Connect your wallet first', 'danger');
    showSpinner();
    setTimeout(() => {
        showAlert(`Deposited ${amount} ALEO successfully!`);
        hideSpinner();
    }, 700);
}

function withdrawFunds(amount) {
    if (!walletAddress) return showAlert('Connect your wallet first', 'danger');
    showSpinner();
    setTimeout(() => {
        showAlert(`Withdrew ${amount} ALEO successfully!`);
        hideSpinner();
    }, 700);
}

function checkBalance() {
    if (!walletAddress) return showAlert('Connect your wallet first', 'danger');
    walletBalance = (Math.random() * 100).toFixed(2);
    document.getElementById('walletBalance').textContent = walletBalance + ' ALEO';
    showAlert(`Your current balance is ${walletBalance} ALEO.`);
}

window.onload = function () {
    renderProducts();

    // Place cart button under existing wallet/chat button if it exists
    const chatButton = document.getElementById('connectWallet');
    if (chatButton && !document.getElementById('staticCartButton')) {
        const cartLink = document.createElement('a');
        cartLink.href = 'cart.html';
        cartLink.className = 'btn btn-outline-light ms-3';
        cartLink.id = 'staticCartButton';
        cartLink.innerHTML = 'Cart <span class="badge bg-danger" id="cartCount">0</span>';
        chatButton.parentElement.appendChild(cartLink);
    }

    cart = JSON.parse(localStorage.getItem('leoCart')) || [];
    updateCartCount();

    document.getElementById('connectWallet').onclick = connectWallet;
    document.getElementById('disconnectWallet').onclick = disconnectWallet;

    const depositBtn = document.getElementById('depositBtn');
    if (depositBtn) {
        depositBtn.onclick = () => {
            const amount = parseFloat(document.getElementById('depositAmount').value);
            if (amount > 0) depositFunds(amount);
            else showAlert('Enter a valid deposit amount', 'danger');
        };
    }

    const withdrawBtn = document.getElementById('withdrawBtn');
    if (withdrawBtn) {
        withdrawBtn.onclick = () => {
            const amount = parseFloat(document.getElementById('withdrawAmount').value);
            if (amount > 0) withdrawFunds(amount);
            else showAlert('Enter a valid withdrawal amount', 'danger');
        };
    }

    const checkBalanceBtn = document.getElementById('checkBalanceBtn');
    if (checkBalanceBtn) {
        checkBalanceBtn.onclick = checkBalance;
    }

    if (document.getElementById('cartItems')) {
        renderCartItems();
    }

    // Sync wallet balance badge with localStorage
    const walletBalanceElem = document.getElementById('walletBalance');
    if (walletBalanceElem && localStorage.getItem('leoWalletBalance')) {
        walletBalanceElem.textContent = parseFloat(localStorage.getItem('leoWalletBalance')).toFixed(2) + ' ALEO';
    }
};
