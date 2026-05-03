const API_URL = "https://avelia-fashion-752376492797.us-central1.run.app/chat";
document.addEventListener('DOMContentLoaded', () => {
    // ---- Elements ----
    const cartIcon = document.getElementById('cart-icon');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountEl = document.getElementById('cart-count');

    // ---- Cart Logic ----
    let cart = JSON.parse(localStorage.getItem('avelia_cart')) || [];

    function saveCart() {
        localStorage.setItem('avelia_cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        if (cartCountEl) {
            cartCountEl.textContent = cart.length;
        }
    }

    function renderCart() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color: var(--color-gray); text-align:center; margin-top:2rem;">Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        if (cartTotalEl) {
            cartTotalEl.textContent = `$${total.toFixed(2)}`;
        }
        updateCartCount();

        // Add listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                removeFromCart(index);
            });
        });
    }

    function addToCart(product) {
        cart.push(product);
        saveCart();
        renderCart();
        openCart();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        renderCart();

        // Update checkout page if we are on it
        if (typeof renderCheckout === 'function') {
            renderCheckout();
        }
    }

    function openCart() {
        if (cartDrawer && overlay) {
            cartDrawer.classList.add('open');
            overlay.classList.add('visible');
        }
    }

    function closeCart() {
        if (cartDrawer && overlay) {
            cartDrawer.classList.remove('open');
            overlay.classList.remove('visible');
        }
    }

    if (cartIcon) cartIcon.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);

    // Initial render
    updateCartCount();
    renderCart();

    // ---- Load Products on Index Page ----
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        fetch(`${API_URL}/products`)
            .then(res => res.json())
            .then(products => {
                products.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card fade-in';
                    card.innerHTML = `
                        <div class="product-image-container">
                            <img src="${product.imageUrl}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-price">$${product.price.toFixed(2)}</p>
                            <button class="btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                        </div>
                    `;
                    productsContainer.appendChild(card);

                    // Add to cart listener
                    card.querySelector('.btn-add-to-cart').addEventListener('click', () => {
                        addToCart(product);
                    });
                });

                // Observe new elements
                document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
            })
            .catch(err => console.error("Error fetching products:", err));
    }

    // ---- Intersection Observer for Fade-In Animation ----
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // ---- Chat UI Logic ----
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    function toggleChat() {
        if (chatWindow) chatWindow.classList.toggle('open');
    }

    if (chatToggle) chatToggle.addEventListener('click', toggleChat);
    if (closeChat) closeChat.addEventListener('click', toggleChat);

    function addMessage(text, sender) {
        const msgEl = document.createElement('div');
        msgEl.className = `message ${sender}`;
        msgEl.textContent = text;
        chatMessages.appendChild(msgEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        })
            .then(res => res.json())
            .then(data => {
                addMessage(data.response, 'bot');
            })
            .catch(err => {
                console.error(err);
                addMessage("Our concierge is currently unavailable. Please try again later.", 'bot');
            });
    }

    if (chatSend) chatSend.addEventListener('click', sendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Initial bot message
    if (chatMessages && chatMessages.children.length === 0) {
        addMessage("Welcome to Avelia. How may I assist you today?", 'bot');
    }
});
