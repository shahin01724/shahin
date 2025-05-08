        // Cart data
        let cart = [];
        let currentView = 'products'; // products, detail, checkout, processing, confirmation
        let selectedProduct = null;
        let selectedColor = null;
        let selectedSize = null;
        let isImageZoomed = false;
        let isDragging = false;
        let startX, startY, scrollLeft, scrollTop;
        let messageShown = false;
        let messageInterval;

        // DOM elements
        const productsGrid = document.getElementById('products-grid');
        const productDetail = document.getElementById('product-detail');
        const checkoutForm = document.getElementById('checkout-form');
        const orderProcessing = document.getElementById('order-processing');
        const orderConfirmation = document.getElementById('order-confirmation');
        const floatingCart = document.getElementById('floating-cart');
        const cartCount = document.getElementById('cart-count');
        const checkoutBtn = document.getElementById('checkout-btn');
        const clearCartBtn = document.getElementById('clear-cart');
        const clearCartBtnFloating = document.getElementById('clear-cart-btn');
        const backToProducts = document.getElementById('back-to-products');
        const backToHome = document.getElementById('back-to-home');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const closeMenuBtn = document.querySelector('.close-menu-btn');
        const overlay = document.querySelector('.overlay');
        const districtInput = document.getElementById('district');
        const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
        const orderSummary = document.getElementById('order-summary');
        const orderTotal = document.getElementById('order-total');
        const deliveryCharge = document.getElementById('delivery-charge');
        const cartItemsContainer = document.getElementById('cart-items');
        const invoiceContainer = document.getElementById('invoice-container');
        const invoice = document.getElementById('invoice');
        const closeInvoiceBtn = document.getElementById('close-invoice');
        const printInvoiceBtn = document.getElementById('print-invoice');
        const saveInvoiceBtn = document.getElementById('save-invoice');
        const downloadInvoiceBtn = document.getElementById('download-invoice');
        const productOrderForm = document.getElementById('product-order-form');
        const productCustomerForm = document.getElementById('product-customer-form');
        const backToDetailBtn = document.getElementById('back-to-detail');
        const freeDeliveryOption = document.getElementById('free-delivery-option');
        const cartFreeDeliveryOption = document.getElementById('cart-free-delivery-option');
        const chatboxToggle = document.getElementById('chatbox-toggle');
        const chatboxMessage = document.getElementById('chatbox-message');
        const chatboxContent = document.getElementById('chatbox-content');
        const chatboxClose = document.getElementById('chatbox-close');
        const closeMessage = document.getElementById('close-message');
        const messageNotification = document.getElementById('message-notification');
        const sendWhatsapp = document.getElementById('send-whatsapp');
        const sendMessenger = document.getElementById('send-messenger');
        const chatboxInput = document.getElementById('chatbox-input');

        // Initialize the app
        function init() {
            renderProducts();
            setupEventListeners();
            updateCartCount();
            setupChatbox();
        }


        // Setup chatbox functionality
        function setupChatbox() {
            // Show initial message after 2 seconds
            setTimeout(() => {
                showMessage();
            }, 2000);
            
            // Set interval to show message every 10 seconds if not shown yet
            messageInterval = setInterval(() => {
                if (!messageShown) {
                    showMessage();
                }
            }, 10000);
        }

        // Show chat message
        function showMessage() {
            if (messageShown) return;
            
            chatboxMessage.style.display = 'block';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                if (chatboxMessage.style.display === 'block') {
                    chatboxMessage.style.display = 'none';
                }
            }, 5000);
        }

        // Close chat message
        function closeMessageHandler() {
            chatboxMessage.style.display = 'none';
            messageShown = true;
            clearInterval(messageInterval);
        }

        // Render products grid
        function renderProducts() {
            productsGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                
                const stockBadge = document.createElement('div');
                stockBadge.className = `stock-badge ${product.stock <= 5 ? 'stock-low' : ''}`;
                stockBadge.textContent = product.stock <= 5 ? `Low Stock (${product.stock})` : `In Stock (${product.stock})`;
                
                // Add delivery free badge if applicable
                if (product.deliveryFree) {
                    const deliveryBadge = document.createElement('div');
                    deliveryBadge.className = 'delivery-free-badge';
                    deliveryBadge.textContent = 'Free Delivery';
                    productCard.appendChild(deliveryBadge);
                }
                
                const productImage = document.createElement('img');
                productImage.src = product.image;
                productImage.alt = product.title;
                productImage.className = 'product-image';
                productImage.addEventListener('click', () => showProductDetail(product.id));
                
                const productInfo = document.createElement('div');
                productInfo.className = 'product-info';
                
                const productTitle = document.createElement('h3');
                productTitle.className = 'product-title';
                productTitle.textContent = product.title;
                productTitle.addEventListener('click', () => showProductDetail(product.id));
                
                const priceContainer = document.createElement('div');
                priceContainer.className = 'price-container';
                
                const currentPrice = document.createElement('span');
                currentPrice.className = 'current-price';
                currentPrice.textContent = `৳${product.price}`;
                
                const originalPrice = document.createElement('span');
                originalPrice.className = 'original-price';
                originalPrice.textContent = `৳${product.originalPrice}`;
                
                priceContainer.appendChild(currentPrice);
                priceContainer.appendChild(originalPrice);
                
                const productActions = document.createElement('div');
                productActions.className = 'product-actions';
                
                const addToCartBtn = document.createElement('button');
                addToCartBtn.className = 'btn btn-primary';
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                addToCartBtn.addEventListener('click', () => addToCart(product.id));
                
                const buyNowBtn = document.createElement('button');
                buyNowBtn.className = 'btn btn-success';
                buyNowBtn.innerHTML = '<i class="fas fa-bolt"></i> Buy Now';
                buyNowBtn.addEventListener('click', () => buyNow(product.id));
                
                // Disable buttons if stock is low
                if (product.stock <= 5) {
                    addToCartBtn.disabled = true;
                    buyNowBtn.disabled = true;
                    addToCartBtn.classList.add('disabled');
                    buyNowBtn.classList.add('disabled');
                }
                
                productActions.appendChild(addToCartBtn);
                productActions.appendChild(buyNowBtn);
                
                const socialButtons = document.createElement('div');
                socialButtons.className = 'social-buttons';
                
                const whatsappBtn = document.createElement('button');
                whatsappBtn.className = 'btn btn-whatsapp btn-sm';
                whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> WhatsApp';
                whatsappBtn.addEventListener('click', () => window.open('https://wa.me/8801724674681', '_blank'));
                
                const messengerBtn = document.createElement('button');
                messengerBtn.className = 'btn btn-messenger btn-sm';
                messengerBtn.innerHTML = '<i class="fab fa-facebook-messenger"></i> Messenger';
                messengerBtn.addEventListener('click', () => window.open('https://m.me/SayfulShahin', '_blank'));
                
                const callBtn = document.createElement('button');
                callBtn.className = 'btn btn-call btn-sm';
                callBtn.innerHTML = '<i class="fas fa-phone"></i> Call Now';
                callBtn.addEventListener('click', () => window.open('tel:+8801724674681'));
                
                socialButtons.appendChild(whatsappBtn);
                socialButtons.appendChild(messengerBtn);
                socialButtons.appendChild(callBtn);
                
                productInfo.appendChild(productTitle);
                productInfo.appendChild(priceContainer);
                productInfo.appendChild(productActions);
                productInfo.appendChild(socialButtons);
                
                productCard.appendChild(stockBadge);
                productCard.appendChild(productImage);
                productCard.appendChild(productInfo);
                
                productsGrid.appendChild(productCard);
            });
        }

        // Show product detail view
        function showProductDetail(productId) {
            selectedProduct = products.find(p => p.id === productId);
            if (!selectedProduct) return;
            
            // Update product detail view
            document.getElementById('detail-title').textContent = selectedProduct.title;
            document.getElementById('detail-price').textContent = `৳${selectedProduct.price}`;
            document.getElementById('detail-original-price').textContent = `৳${selectedProduct.originalPrice}`;
            document.getElementById('detail-description').textContent = selectedProduct.description;
            
            // Set main image to the product's main image
            const mainImage = document.getElementById('detail-main-image');
            mainImage.src = selectedProduct.image;
            mainImage.alt = selectedProduct.title;
            
            // Clear and add thumbnails
            const thumbnailContainer = document.getElementById('thumbnail-container');
            thumbnailContainer.innerHTML = '';
            
            // Add main image as first thumbnail
            const mainThumbnail = document.createElement('img');
            mainThumbnail.src = selectedProduct.image;
            mainThumbnail.alt = selectedProduct.title;
            mainThumbnail.className = 'thumbnail active';
            mainThumbnail.addEventListener('click', () => {
                mainImage.src = selectedProduct.image;
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                mainThumbnail.classList.add('active');
            });
            thumbnailContainer.appendChild(mainThumbnail);
            
            // Add other images as thumbnails
            selectedProduct.images.forEach((image, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = image;
                thumbnail.alt = `${selectedProduct.title} - Image ${index + 1}`;
                thumbnail.className = 'thumbnail';
                
                thumbnail.addEventListener('click', () => {
                    mainImage.src = image;
                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    thumbnail.classList.add('active');
                });
                
                thumbnailContainer.appendChild(thumbnail);
            });
            
            // Clear and add color options
            const colorOptions = document.getElementById('color-options');
            colorOptions.innerHTML = '';
            
            const colorSwatches = document.getElementById('color-swatches');
            colorSwatches.innerHTML = '';
            
            selectedProduct.colors.forEach(color => {
                // Color text options
                const colorOption = document.createElement('div');
                colorOption.className = 'variant-option';
                colorOption.textContent = color;
                
                colorOption.addEventListener('click', () => {
                    document.querySelectorAll('#color-options .variant-option').forEach(o => o.classList.remove('selected'));
                    colorOption.classList.add('selected');
                    selectedColor = color;
                    
                    // Update main image to selected color if available
                    if (selectedProduct.colorImages && selectedProduct.colorImages[color]) {
                        mainImage.src = selectedProduct.colorImages[color];
                        mainImage.alt = `${selectedProduct.title} - ${color}`;
                        
                        // Update thumbnails to show the selected color's images
                        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                            if (index === 0) {
                                thumb.src = selectedProduct.colorImages[color];
                                thumb.alt = `${selectedProduct.title} - ${color}`;
                            }
                        });
                    }
                });
                
                colorOptions.appendChild(colorOption);
                
                // Color swatches
                if (selectedProduct.colorCodes && selectedProduct.colorCodes[color]) {
                    const colorSwatch = document.createElement('div');
                    colorSwatch.className = 'color-swatch';
                    colorSwatch.style.backgroundColor = selectedProduct.colorCodes[color];
                    colorSwatch.title = color;
                    
                    colorSwatch.addEventListener('click', () => {
                        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
                        colorSwatch.classList.add('selected');
                        selectedColor = color;
                        
                        // Update main image to selected color if available
                        if (selectedProduct.colorImages && selectedProduct.colorImages[color]) {
                            mainImage.src = selectedProduct.colorImages[color];
                            mainImage.alt = `${selectedProduct.title} - ${color}`;
                            
                            // Update thumbnails to show the selected color's images
                            document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                                if (index === 0) {
                                    thumb.src = selectedProduct.colorImages[color];
                                    thumb.alt = `${selectedProduct.title} - ${color}`;
                                }
                            });
                        }
                    });
                    
                    colorSwatches.appendChild(colorSwatch);
                }
            });
            
            // Clear and add size options
            const sizeOptions = document.getElementById('size-options');
            sizeOptions.innerHTML = '';
            
            selectedProduct.sizes.forEach(size => {
                const sizeOption = document.createElement('div');
                sizeOption.className = 'variant-option';
                sizeOption.textContent = size;
                
                sizeOption.addEventListener('click', () => {
                    document.querySelectorAll('#size-options .variant-option').forEach(o => o.classList.remove('selected'));
                    sizeOption.classList.add('selected');
                    selectedSize = size;
                });
                
                sizeOptions.appendChild(sizeOption);
            });
            
            // Reset quantity
            document.getElementById('quantity-input').value = 1;
            
            // Show/hide free delivery option based on product
            if (selectedProduct.deliveryFree) {
                freeDeliveryOption.style.display = 'block';
                document.querySelector('input[name="product-delivery"][value="free"]').checked = true;
            } else {
                freeDeliveryOption.style.display = 'none';
                document.querySelector('input[name="product-delivery"][value="inside"]').checked = true;
            }
            
            // Update product order summary
            updateProductOrderSummary();
            
            // Show related products
            showRelatedProducts(productId);
            
            // Switch to detail view
            switchView('detail');
            
            // Setup image zoom
            setupImageZoom();
        }

        // Setup image zoom functionality
        function setupImageZoom() {
            const mainImageContainer = document.getElementById('main-image-container');
            const mainImage = document.getElementById('detail-main-image');
            
            // Reset zoom state
            isImageZoomed = false;
            mainImage.classList.remove('zoomed');
            mainImage.style.cursor = 'zoom-in';
            
            // Toggle zoom on click
            mainImage.addEventListener('click', () => {
                isImageZoomed = !isImageZoomed;
                if (isImageZoomed) {
                    mainImage.classList.add('zoomed');
                    mainImage.style.cursor = 'grab';
                } else {
                    mainImage.classList.remove('zoomed');
                    mainImage.style.cursor = 'zoom-in';
                }
            });
            
            // Handle mouse movement for panning
            mainImageContainer.addEventListener('mousemove', (e) => {
                if (!isImageZoomed) return;
                
                e.preventDefault();
                
                const containerRect = mainImageContainer.getBoundingClientRect();
                const x = e.clientX - containerRect.left;
                const y = e.clientY - containerRect.top;
                
                const xPercent = x / containerRect.width;
                const yPercent = y / containerRect.height;
                
                const scrollX = (mainImage.width * xPercent) - (containerRect.width / 2);
                const scrollY = (mainImage.height * yPercent) - (containerRect.height / 2);
                
                mainImageContainer.scrollLeft = scrollX;
                mainImageContainer.scrollTop = scrollY;
            });
            
            // Change cursor when grabbing
            mainImage.addEventListener('mousedown', () => {
                if (isImageZoomed) {
                    mainImage.style.cursor = 'grabbing';
                }
            });
            
            mainImage.addEventListener('mouseup', () => {
                if (isImageZoomed) {
                    mainImage.style.cursor = 'grab';
                }
            });
            
            // Reset cursor when mouse leaves
            mainImageContainer.addEventListener('mouseleave', () => {
                if (isImageZoomed) {
                    mainImage.style.cursor = 'grab';
                }
            });
        }

        // Show related products
        function showRelatedProducts(currentProductId) {
            const relatedSlider = document.getElementById('related-slider');
            relatedSlider.innerHTML = '';
            
            const relatedProducts = products
                .filter(p => p.id !== currentProductId)
                .sort(() => 0.5 - Math.random())
                .slice(0, 5);
            
            relatedProducts.forEach(product => {
                const relatedProduct = document.createElement('div');
                relatedProduct.className = 'related-product';
                
                const productImage = document.createElement('img');
                productImage.src = product.image;
                productImage.alt = product.title;
                productImage.className = 'product-image';
                productImage.style.height = '150px';
                productImage.addEventListener('click', () => showProductDetail(product.id));
                
                const productInfo = document.createElement('div');
                productInfo.className = 'product-info';
                productInfo.style.padding = '10px';
                
                const productTitle = document.createElement('div');
                productTitle.className = 'product-title';
                productTitle.textContent = product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title;
                productTitle.addEventListener('click', () => showProductDetail(product.id));
                
                const priceContainer = document.createElement('div');
                priceContainer.className = 'price-container';
                
                const currentPrice = document.createElement('span');
                currentPrice.className = 'current-price';
                currentPrice.textContent = `৳${product.price}`;
                currentPrice.style.fontSize = '14px';
                
                const originalPrice = document.createElement('span');
                originalPrice.className = 'original-price';
                originalPrice.textContent = `৳${product.originalPrice}`;
                originalPrice.style.fontSize = '12px';
                
                priceContainer.appendChild(currentPrice);
                priceContainer.appendChild(originalPrice);
                
                productInfo.appendChild(productTitle);
                productInfo.appendChild(priceContainer);
                
                relatedProduct.appendChild(productImage);
                relatedProduct.appendChild(productInfo);
                
                relatedSlider.appendChild(relatedProduct);
            });
        }

        // Add product to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            const quantity = parseInt(document.getElementById('quantity-input').value);
            
            // Determine which image to use
            let productImage = product.image;
            if (selectedColor && product.colorImages && product.colorImages[selectedColor]) {
                productImage = product.colorImages[selectedColor];
            }
            
            const existingItem = cart.find(item => item.id === productId && item.color === selectedColor && item.size === selectedSize);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: productImage,
                    color: selectedColor,
                    size: selectedSize,
                    quantity: quantity,
                    deliveryFree: product.deliveryFree
                });
            }
            
            updateCartCount();
            showFloatingCart();
            updateOrderSummary();
        }

// Buy now function
// Buy now function - Final version
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Show product detail and order form
    selectedProduct = product;
    loadProductDetail(product);
    switchView('detail');
    
    setTimeout(() => {
        document.getElementById('product-order-form').style.display = 'block';
        document.getElementById('product-order-form').scrollIntoView({
            behavior: 'smooth'
        });
    }, 300);
    
    // Hide floating cart
    floatingCart.classList.add('hidden');
    
    // Update URL
    const params = new URLSearchParams();
    if (selectedColor) params.set('color', selectedColor);
    if (selectedSize) params.set('size', selectedSize);
    const queryString = params.toString();
    window.history.pushState({}, '', `#${product.slug}${queryString ? `?${queryString}` : ''}`);
}

// Back to products button - Final version
backToProducts.addEventListener('click', function() {
    window.history.pushState({}, '', window.location.pathname);
    switchView('products');
});



        // Update product order summary
        function updateProductOrderSummary() {
            if (!selectedProduct) return;
            
            const quantity = parseInt(document.getElementById('quantity-input').value);
            const subtotal = selectedProduct.price * quantity;
            let charge = 0;
            const deliveryOption = document.querySelector('input[name="product-delivery"]:checked').value;
            
            if (selectedProduct.deliveryFree) {
                charge = 0;
            } else {
                const district = document.getElementById('product-district').value.toLowerCase();
                charge = district === 'dhaka' || district === 'ঢাকা' ? 80 : 120;
            }
            
            const total = subtotal + charge;
            
            document.getElementById('product-subtotal').textContent = `৳${subtotal}`;
            document.getElementById('product-delivery-charge').textContent = selectedProduct.deliveryFree ? 'Free' : `৳${charge}`;
            document.getElementById('product-total').textContent = `৳${total}`;
        }

        // Update cart count
        function updateCartCount() {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = count;
            
            if (count > 0) {
                floatingCart.classList.add('active');
                floatingCart.classList.remove('hidden');
            } else {
                floatingCart.classList.remove('active');
            }
        }

        // Show floating cart temporarily
        function showFloatingCart() {
            floatingCart.classList.add('active');
            floatingCart.classList.remove('hidden');
            
            setTimeout(() => {
                if (parseInt(cartCount.textContent) === 0) {
                    floatingCart.classList.remove('active');
                }
            }, 3000);
        }

        // Update order summary
        function updateOrderSummary() {
            updateCartItemsList();
            
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            let charge = 0;
            
            // Check if all items in cart have free delivery
            const allFreeDelivery = cart.every(item => item.deliveryFree);
            
            if (allFreeDelivery) {
                charge = 0;
                cartFreeDeliveryOption.style.display = 'block';
                document.querySelector('input[name="delivery"][value="free"]').checked = true;
            } else {
                const district = document.getElementById('district').value.toLowerCase();
                charge = district === 'dhaka' || district === 'ঢাকা' ? 80 : 120;
                cartFreeDeliveryOption.style.display = 'none';
                document.querySelector('input[name="delivery"][value="inside"]').checked = true;
            }
            
            const total = subtotal + charge;
            
            const summaryHTML = `
                <h3 class="summary-title">Order Summary</h3>
                <div class="summary-item">
                    <span>Subtotal:</span>
                    <span>৳${subtotal}</span>
                </div>
                <div class="summary-item">
                    <span>Delivery Charge:</span>
                    <span id="delivery-charge">${allFreeDelivery ? 'Free' : `৳${charge}`}</span>
                </div>
                <div class="summary-total">
                    <span>Total:</span>
                    <span id="order-total">৳${total}</span>
                </div>
            `;
            
            orderSummary.innerHTML = summaryHTML;
        }

        // Update cart items list
        function updateCartItemsList() {
            cartItemsContainer.innerHTML = '';
            
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-variant">${item.color || 'Default'}, ${item.size || 'One Size'}</div>
                        <div class="cart-item-price">৳${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease-item" data-index="${index}">-</button>
                            <input type="number" value="${item.quantity}" min="1" class="quantity-input item-quantity" data-index="${index}">
                            <button class="quantity-btn increase-item" data-index="${index}">+</button>
                        </div>
                        <div class="cart-item-remove" data-index="${index}">Remove</div>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            });
            
            document.querySelectorAll('.decrease-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                        updateCartCount();
                        updateOrderSummary();
                    }
                });
            });
            
            document.querySelectorAll('.increase-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    cart[index].quantity++;
                    updateCartCount();
                    updateOrderSummary();
                });
            });
            
            document.querySelectorAll('.item-quantity').forEach(input => {
                input.addEventListener('change', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    const newQuantity = parseInt(e.target.value);
                    if (newQuantity > 0) {
                        cart[index].quantity = newQuantity;
                        updateCartCount();
                        updateOrderSummary();
                    } else {
                        e.target.value = cart[index].quantity;
                    }
                });
            });
            
            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    cart.splice(index, 1);
                    updateCartCount();
                    updateOrderSummary();
                });
            });
        }

        // Update delivery charge and total based on district
        function updateDeliveryAndTotal() {
            const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
            let charge = 0;
            
            if (deliveryOption === 'free') {
                charge = 0;
            } else {
                const district = document.getElementById('district').value.toLowerCase();
                charge = district === 'dhaka' || district === 'ঢাকা' ? 80 : 120;
            }
            
            document.getElementById('delivery-charge').textContent = deliveryOption === 'free' ? 'Free' : `৳${charge}`;
            
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const total = subtotal + charge;
            
            document.getElementById('order-total').textContent = `৳${total}`;
        }

        // Update product delivery charge and total
        function updateProductDeliveryAndTotal() {
            const deliveryOption = document.querySelector('input[name="product-delivery"]:checked').value;
            let charge = 0;
            
            if (deliveryOption === 'free') {
                charge = 0;
            } else {
                const district = document.getElementById('product-district').value.toLowerCase();
                charge = district === 'dhaka' || district === 'ঢাকা' ? 80 : 120;
            }
            
            document.getElementById('product-delivery-charge').textContent = deliveryOption === 'free' ? 'Free' : `৳${charge}`;
            
            const quantity = parseInt(document.getElementById('quantity-input').value);
            const subtotal = selectedProduct.price * quantity;
            const total = subtotal + charge;
            
            document.getElementById('product-total').textContent = `৳${total}`;
        }

        // Switch between views
        function switchView(view) {
            currentView = view;
            
            document.getElementById('products-view').style.display = 'none';
            productDetail.classList.remove('active');
            checkoutForm.classList.remove('active');
            orderProcessing.classList.remove('active');
            orderConfirmation.classList.remove('active');
            
            productOrderForm.style.display = 'none';
            
            switch (view) {
                case 'products':
                    document.getElementById('products-view').style.display = 'block';
                    floatingCart.classList.remove('hidden');
                    break;
                case 'detail':
                    productDetail.classList.add('active');
                    floatingCart.classList.remove('hidden');
                    break;
                case 'checkout':
                    checkoutForm.classList.add('active');
                    floatingCart.classList.add('hidden');
                    break;
                case 'processing':
                    orderProcessing.classList.add('active');
                    floatingCart.classList.add('hidden');
                    break;
                case 'confirmation':
                    orderConfirmation.classList.add('active');
                    floatingCart.classList.add('hidden');
                    break;
            }
            
            window.scrollTo(0, 0);
        }

        // Generate invoice
        function generateInvoice(customerData, isProductOrder = false) {
            const now = new Date();
            const invoiceNumber = 'INV-' + now.getFullYear() + now.getMonth() + now.getDate() + '-' + Math.floor(Math.random() * 1000);
            const invoiceDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            
            document.getElementById('invoice-number').textContent = invoiceNumber;
            document.getElementById('invoice-date').textContent = invoiceDate;
            
            document.getElementById('invoice-customer-name').textContent = customerData.name;
            document.getElementById('invoice-customer-address').textContent = customerData.address;
            document.getElementById('invoice-customer-district').textContent = customerData.district;
            document.getElementById('invoice-customer-phone').textContent = customerData.mobile;
            document.getElementById('invoice-customer-email').textContent = customerData.email || 'N/A';
            
            const invoiceItemsBody = document.getElementById('invoice-items-body');
            invoiceItemsBody.innerHTML = '';
            
            let subtotal = 0;
            
            const itemsToShow = isProductOrder ? [{ 
                id: selectedProduct.id,
                title: selectedProduct.title,
                price: selectedProduct.price,
                image: selectedColor && selectedProduct.colorImages && selectedProduct.colorImages[selectedColor] ? 
                      selectedProduct.colorImages[selectedColor] : selectedProduct.image,
                color: selectedColor || 'Default',
                size: selectedSize || 'One Size',
                quantity: parseInt(document.getElementById('quantity-input').value)
            }] : cart;
            
            itemsToShow.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.title} (${item.color || 'Default'}, ${item.size || 'One Size'})</td>
                    <td><img src="${item.image}" class="item-image" alt="${item.title}"></td>
                    <td>৳${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>৳${itemTotal}</td>
                `;
                
                invoiceItemsBody.appendChild(row);
            });
            
            let deliveryCharge = 0;
            if (isProductOrder) {
                const deliveryOption = document.querySelector('input[name="product-delivery"]:checked').value;
                if (deliveryOption !== 'free') {
                    const district = document.getElementById('product-district').value.toLowerCase();
                    deliveryCharge = district === 'dhaka' || district === 'ঢাকা' ? 80 : 120;
                }
            } else {
                const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
                if (deliveryOption !== 'free') {
                    const district = document.getElementById('district').value.toLowerCase();
                    deliveryCharge = district === 'dhaka' || district === 'ঢাকা' ? 80 : 120;
                }
            }
            
            const total = subtotal + deliveryCharge;
            
            document.getElementById('invoice-subtotal').textContent = `৳${subtotal}`;
            document.getElementById('invoice-delivery').textContent = `৳${deliveryCharge}`;
            document.getElementById('invoice-total').textContent = `৳${total}`;
            
            invoiceContainer.classList.add('active');
            
            sendDataToGoogleSheets(customerData, invoiceNumber, subtotal, deliveryCharge, total, isProductOrder);
        }

        // Send data to Google Sheets
        function sendDataToGoogleSheets(customerData, invoiceNumber, subtotal, deliveryCharge, total, isProductOrder = false) {
            const formData = {
                timestamp: new Date().toISOString(),
                invoiceNumber: invoiceNumber,
                name: customerData.name,
                mobile: customerData.mobile,
                address: customerData.address,
                district: customerData.district,
                email: customerData.email || 'N/A',
                deliveryOption: customerData.delivery === 'free' ? 'Free Delivery' : 
                              (customerData.delivery === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'),
                notes: customerData.notes || 'N/A',
                subtotal: subtotal,
                deliveryCharge: deliveryCharge,
                total: total,
                items: isProductOrder ? [{
                    title: selectedProduct.title,
                    image: selectedColor && selectedProduct.colorImages && selectedProduct.colorImages[selectedColor] ? 
                          selectedProduct.colorImages[selectedColor] : selectedProduct.image,
                    color: selectedColor || 'Default',
                    size: selectedSize || 'One Size',
                    price: selectedProduct.price,
                    quantity: parseInt(document.getElementById('quantity-input').value),
                    total: selectedProduct.price * parseInt(document.getElementById('quantity-input').value)
                }] : cart.map(item => ({
                    title: item.title,
                    image: item.image,
                    color: item.color || 'Default',
                    size: item.size || 'One Size',
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity
                }))
            };
            
            const webAppUrl = 'https://script.google.com/macros/s/AKfycby5bXBbKQmMxg52lLv1KUaixyx8JDxr3ucchfDKjDWMbZpijX_eTM6PyTMtoUVMubjN/exec';
            
            fetch(webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Order saved to Google Sheet:', data);
            })
            .catch(error => {
                console.error('Error saving order:', error);
            });
        }

        // Save invoice as PDF
        function saveInvoiceAsPDF() {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'pt', 'a4');
            
            html2canvas(document.getElementById('invoice'), {
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = canvas.height * imgWidth / canvas.width;
                
                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
                pdf.save(`invoice_${document.getElementById('invoice-number').textContent}.pdf`);
            });
        }

        // Save invoice as JPG
        function saveInvoiceAsJPG() {
            html2canvas(document.getElementById('invoice'), {
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `invoice_${document.getElementById('invoice-number').textContent}.jpg`;
                link.href = canvas.toDataURL('image/jpeg', 1.0);
                link.click();
            });
        }

        // Print invoice
        function printInvoice() {
            const invoiceElement = document.getElementById('invoice');
            const originalContents = document.body.innerHTML;
            
            document.body.innerHTML = invoiceElement.outerHTML;
            window.print();
            document.body.innerHTML = originalContents;
            location.reload();
        }

        // Setup event listeners
        function setupEventListeners() {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.add('active');
                overlay.classList.add('active');
            });
            
            closeMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
            });
            
            overlay.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
            });
            
            backToProducts.addEventListener('click', () => switchView('products'));
            backToHome.addEventListener('click', () => {
                cart = [];
                updateCartCount();
                switchView('products');
            });
            
            backToDetailBtn.addEventListener('click', () => {
                productOrderForm.style.display = 'none';
            });
            
            checkoutBtn.addEventListener('click', () => {
                if (cart.length > 0) {
                    switchView('checkout');
                }
            });
            
            clearCartBtn.addEventListener('click', () => {
                cart = [];
                updateCartCount();
                updateOrderSummary();
            });
            
            clearCartBtnFloating.addEventListener('click', () => {
                cart = [];
                updateCartCount();
                updateOrderSummary();
            });
            
            document.getElementById('add-to-cart-detail').addEventListener('click', () => {
                addToCart(selectedProduct.id);
            });
            
            document.getElementById('buy-now-detail').addEventListener('click', () => {
                buyNow(selectedProduct.id);
            });
            
            document.getElementById('increase-qty').addEventListener('click', () => {
                const input = document.getElementById('quantity-input');
                input.value = parseInt(input.value) + 1;
                updateProductOrderSummary();
            });
            
            document.getElementById('decrease-qty').addEventListener('click', () => {
                const input = document.getElementById('quantity-input');
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                    updateProductOrderSummary();
                }
            });
            
            document.getElementById('quantity-input').addEventListener('change', () => {
                updateProductOrderSummary();
            });
            
            districtInput.addEventListener('input', updateDeliveryAndTotal);
            document.getElementById('product-district').addEventListener('input', updateProductDeliveryAndTotal);
            
            deliveryOptions.forEach(option => {
                option.addEventListener('change', updateDeliveryAndTotal);
            });
            
            document.querySelectorAll('input[name="product-delivery"]').forEach(option => {
                option.addEventListener('change', updateProductDeliveryAndTotal);
            });
            
            document.getElementById('customer-form').addEventListener('submit', (e) => {
                e.preventDefault();
                
                switchView('processing');
                
                setTimeout(() => {
                    const customerData = {
                        name: document.getElementById('full-name').value,
                        mobile: document.getElementById('mobile').value,
                        address: document.getElementById('address').value,
                        district: document.getElementById('district').value,
                        email: document.getElementById('email').value,
                        delivery: document.querySelector('input[name="delivery"]:checked').value,
                        notes: document.getElementById('notes').value
                    };
                    
                    generateInvoice(customerData);
                    
                    setTimeout(() => {
                        switchView('confirmation');
                    }, 5000);
                    
                    cart = [];
                    updateCartCount();
                }, 2000);
            });
            
            document.getElementById('product-customer-form').addEventListener('submit', (e) => {
                e.preventDefault();
                
                switchView('processing');
                
                setTimeout(() => {
                    const customerData = {
                        name: document.getElementById('product-full-name').value,
                        mobile: document.getElementById('product-mobile').value,
                        address: document.getElementById('product-address').value,
                        district: document.getElementById('product-district').value,
                        email: document.getElementById('product-email').value,
                        delivery: document.querySelector('input[name="product-delivery"]:checked').value,
                        notes: document.getElementById('product-notes').value
                    };
                    
                    generateInvoice(customerData, true);
                    
                    setTimeout(() => {
                        switchView('confirmation');
                    }, 5000);
                    
                    cart = [];
                    updateCartCount();
                }, 2000);
            });
            
            closeInvoiceBtn.addEventListener('click', () => {
                invoiceContainer.classList.remove('active');
            });
            
            printInvoiceBtn.addEventListener('click', printInvoice);
            
            saveInvoiceBtn.addEventListener('click', saveInvoiceAsJPG);
            
            downloadInvoiceBtn.addEventListener('click', saveInvoiceAsPDF);
            
            // Chatbox event listeners
            chatboxToggle.addEventListener('click', () => {
                chatboxContent.style.display = chatboxContent.style.display === 'block' ? 'none' : 'block';
                chatboxMessage.style.display = 'none';
                messageShown = true;
                clearInterval(messageInterval);
            });
            
            chatboxClose.addEventListener('click', () => {
                chatboxContent.style.display = 'none';
            });
            
            closeMessage.addEventListener('click', closeMessageHandler);
            
            sendWhatsapp.addEventListener('click', () => {
                const message = chatboxInput.value || 'I need help with my order';
                window.open(`https://wa.me/8801724674681?text=${encodeURIComponent(message)}`, '_blank');
            });
            
            sendMessenger.addEventListener('click', () => {
                const message = chatboxInput.value || 'I need help with my order';
                window.open(`https://m.me/SayfulShahin?text=${encodeURIComponent(message)}`, '_blank');
            });
        }

        // Initialize the app
        document.addEventListener('DOMContentLoaded', init);
		
		// ---------------
    // Switch between views ফাংশনটি নিচের মতো আপডেট করুন
    function switchView(view) {
        currentView = view;
        
        document.getElementById('products-view').style.display = 'none';
        productDetail.classList.remove('active');
        checkoutForm.classList.remove('active');
        orderProcessing.classList.remove('active');
        orderConfirmation.classList.remove('active');
        
        // Hide banner, features and footer sections by default
        document.querySelector('.banner').style.display = 'none';
        document.querySelector('.features').style.display = 'none';
        document.querySelector('footer').style.display = 'none';
        
        // Chatbox will always remain visible
        document.querySelector('.chatbox').style.display = 'block';
        
        productOrderForm.style.display = 'none';
        
        switch (view) {
            case 'products':
                document.getElementById('products-view').style.display = 'block';
                floatingCart.classList.remove('hidden');
                // Show banner, features and footer only on home/products view
                document.querySelector('.banner').style.display = 'block';
                document.querySelector('.features').style.display = 'flex';
                document.querySelector('footer').style.display = 'block';
                break;
            case 'detail':
                productDetail.classList.add('active');
                floatingCart.classList.remove('hidden');
                break;
            case 'checkout':
                checkoutForm.classList.add('active');
                floatingCart.classList.add('hidden');
                break;
            case 'processing':
                orderProcessing.classList.add('active');
                floatingCart.classList.add('hidden');
                break;
            case 'confirmation':
                orderConfirmation.classList.add('active');
                floatingCart.classList.add('hidden');
                break;
        }
        
        window.scrollTo(0, 0);
    }

	
// URL হ্যান্ডলিং ফাংশন
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    
    if (!hash) {
        switchView('products');
        return;
    }
    
    // Parse the URL parameters
    const params = new URLSearchParams(hash.split('?')[1] || '');
    const productSlug = hash.split('?')[0];
    const color = params.get('color') || null;
    const size = params.get('size') || null;
    
    const product = products.find(p => p.slug === productSlug);
    if (product) {
        selectedProduct = product;
        loadProductDetail(product);
        
        // Set selected color and size from URL if available
        if (color) {
            selectedColor = color;
            setTimeout(() => {
                const colorOption = [...document.querySelectorAll('#color-options .variant-option')]
                    .find(opt => opt.textContent === color);
                if (colorOption) colorOption.click();
                
                const colorSwatch = [...document.querySelectorAll('.color-swatch')]
                    .find(sw => sw.title === color);
                if (colorSwatch) colorSwatch.click();
            }, 100);
        }
        
        if (size) {
            selectedSize = size;
            setTimeout(() => {
                const sizeOption = [...document.querySelectorAll('#size-options .variant-option')]
                    .find(opt => opt.textContent === size);
                if (sizeOption) sizeOption.click();
            }, 100);
        }
        
        switchView('detail');
    } else {
        switchView('products');
    }
}

// প্রোডাক্ট ডিটেইল লোড করার ফাংশন
function loadProductDetail(product) {
    document.getElementById('detail-title').textContent = product.title;
    document.getElementById('detail-price').textContent = `৳${product.price}`;
    document.getElementById('detail-original-price').textContent = `৳${product.originalPrice}`;
    document.getElementById('detail-description').textContent = product.description;
    
    // মেইন ইমেজ সেট করা
    const mainImage = document.getElementById('detail-main-image');
    mainImage.src = product.image;
    mainImage.alt = product.title;
    
    // থাম্বনেইল কন্টেইনার ক্লিয়ার করা
    const thumbnailContainer = document.getElementById('thumbnail-container');
    thumbnailContainer.innerHTML = '';
    
    // মেইন ইমেজকে প্রথম থাম্বনেইল হিসেবে যোগ করা
    const mainThumbnail = document.createElement('img');
    mainThumbnail.src = product.image;
    mainThumbnail.alt = product.title;
    mainThumbnail.className = 'thumbnail active';
    mainThumbnail.addEventListener('click', () => {
        mainImage.src = product.image;
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        mainThumbnail.classList.add('active');
    });
    thumbnailContainer.appendChild(mainThumbnail);
    
    // অন্যান্য ইমেজ যোগ করা
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `${product.title} - Image ${index + 1}`;
        thumbnail.className = 'thumbnail';
        
        thumbnail.addEventListener('click', () => {
            mainImage.src = image;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // কালার অপশন সেট করা
    const colorOptions = document.getElementById('color-options');
    colorOptions.innerHTML = '';
    
    const colorSwatches = document.getElementById('color-swatches');
    colorSwatches.innerHTML = '';
    
    product.colors.forEach(color => {
        // টেক্সট কালার অপশন
        const colorOption = document.createElement('div');
        colorOption.className = 'variant-option';
        colorOption.textContent = color;
        
        colorOption.addEventListener('click', () => {
            document.querySelectorAll('#color-options .variant-option').forEach(o => o.classList.remove('selected'));
            colorOption.classList.add('selected');
            selectedColor = color;
            updateProductURL();
            
            if (product.colorImages && product.colorImages[color]) {
                mainImage.src = product.colorImages[color];
                document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                    if (index === 0) thumb.src = product.colorImages[color];
                });
            }
        });
        
        // If this color is selected from URL, mark it as selected
        if (color === selectedColor) {
            colorOption.classList.add('selected');
        }
        
        colorOptions.appendChild(colorOption);
        
        // কালার সোয়াচ
        if (product.colorCodes && product.colorCodes[color]) {
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.style.backgroundColor = product.colorCodes[color];
            colorSwatch.title = color;
            
            colorSwatch.addEventListener('click', () => {
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
                colorSwatch.classList.add('selected');
                selectedColor = color;
                updateProductURL();
                
                if (product.colorImages && product.colorImages[color]) {
                    mainImage.src = product.colorImages[color];
                    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                        if (index === 0) thumb.src = product.colorImages[color];
                    });
                }
            });
            
            // If this color is selected from URL, mark it as selected
            if (color === selectedColor) {
                colorSwatch.classList.add('selected');
            }
            
            colorSwatches.appendChild(colorSwatch);
        }
    });
    
    // সাইজ অপশন সেট করা
    const sizeOptions = document.getElementById('size-options');
    sizeOptions.innerHTML = '';
    
    product.sizes.forEach(size => {
        const sizeOption = document.createElement('div');
        sizeOption.className = 'variant-option';
        sizeOption.textContent = size;
        
        sizeOption.addEventListener('click', () => {
            document.querySelectorAll('#size-options .variant-option').forEach(o => o.classList.remove('selected'));
            sizeOption.classList.add('selected');
            selectedSize = size;
            updateProductURL();
        });
        
        // If this size is selected from URL, mark it as selected
        if (size === selectedSize) {
            sizeOption.classList.add('selected');
        }
        
        sizeOptions.appendChild(sizeOption);
    });
    
    // কোয়ান্টিটি রিসেট করা
    document.getElementById('quantity-input').value = 1;
    
    // ফ্রি ডেলিভারি অপশন
    if (product.deliveryFree) {
        freeDeliveryOption.style.display = 'block';
        document.querySelector('input[name="product-delivery"][value="free"]').checked = true;
    } else {
        freeDeliveryOption.style.display = 'none';
        document.querySelector('input[name="product-delivery"][value="inside"]').checked = true;
    }
    
    updateProductOrderSummary();
    showRelatedProducts(product.id);
    setupImageZoom();
}

// URL আপডেট করার ফাংশন
function updateProductURL() {
    if (!selectedProduct) return;
    
    const params = new URLSearchParams();
    if (selectedColor) params.set('color', selectedColor);
    if (selectedSize) params.set('size', selectedSize);
    
    const queryString = params.toString();
    const newHash = `#${selectedProduct.slug}${queryString ? `?${queryString}` : ''}`;
    
    // Update URL without reloading the page
    window.history.replaceState({}, '', newHash);
}

// showProductDetail ফাংশন আপডেট করুন
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Reset selected variants
    selectedColor = null;
    selectedSize = null;
    
    // Update URL
    window.history.pushState({ productId }, '', `#${product.slug}`);
    
    // প্রোডাক্ট ডিটেইল লোড করুন
    selectedProduct = product;
    loadProductDetail(product);
    switchView('detail');
}

// init ফাংশন আপডেট করুন
function init() {
    renderProducts();
    setupEventListeners();
    updateCartCount();
    setupChatbox();
    
    // URL চেক করুন
    handleHashChange();
    
    // হ্যাশ চেঞ্জ ইভেন্ট লিসেনার যোগ করুন
    window.addEventListener('hashchange', handleHashChange);
}

// back-to-products বাটনের ইভেন্ট লিসেনার আপডেট করুন
backToProducts.addEventListener('click', () => {
    window.history.pushState({}, '', window.location.pathname);
    switchView('products');
});



// URL হ্যান্ডলিং ফাংশন
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    
    if (!hash) {
        switchView('products');
        return;
    }
    
    // Parse the URL parameters
    const params = new URLSearchParams(hash.split('?')[1] || '');
    const productSlug = hash.split('?')[0];
    const color = params.get('color') || null;
    const size = params.get('size') || null;
    
    const product = products.find(p => p.slug === productSlug);
    if (product) {
        selectedProduct = product;
        loadProductDetail(product);
        
        // Set selected color and size from URL if available
        if (color) {
            selectedColor = color;
            setTimeout(() => {
                const colorOption = [...document.querySelectorAll('#color-options .variant-option')]
                    .find(opt => opt.textContent === color);
                if (colorOption) colorOption.click();
                
                const colorSwatch = [...document.querySelectorAll('.color-swatch')]
                    .find(sw => sw.title === color);
                if (colorSwatch) colorSwatch.click();
            }, 100);
        }
        
        if (size) {
            selectedSize = size;
            setTimeout(() => {
                const sizeOption = [...document.querySelectorAll('#size-options .variant-option')]
                    .find(opt => opt.textContent === size);
                if (sizeOption) sizeOption.click();
            }, 100);
        }
        
        switchView('detail');
    } else {
        switchView('products');
    }
}

// প্রোডাক্ট ডিটেইল লোড করার ফাংশন
function loadProductDetail(product) {
    document.getElementById('detail-title').textContent = product.title;
    document.getElementById('detail-price').textContent = `৳${product.price}`;
    document.getElementById('detail-original-price').textContent = `৳${product.originalPrice}`;
    document.getElementById('detail-description').textContent = product.description;
    
    // মেইন ইমেজ সেট করা
    const mainImage = document.getElementById('detail-main-image');
    mainImage.src = product.image;
    mainImage.alt = product.title;
    
    // থাম্বনেইল কন্টেইনার ক্লিয়ার করা
    const thumbnailContainer = document.getElementById('thumbnail-container');
    thumbnailContainer.innerHTML = '';
    
    // মেইন ইমেজকে প্রথম থাম্বনেইল হিসেবে যোগ করা
    const mainThumbnail = document.createElement('img');
    mainThumbnail.src = product.image;
    mainThumbnail.alt = product.title;
    mainThumbnail.className = 'thumbnail active';
    mainThumbnail.addEventListener('click', () => {
        mainImage.src = product.image;
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        mainThumbnail.classList.add('active');
    });
    thumbnailContainer.appendChild(mainThumbnail);
    
    // অন্যান্য ইমেজ যোগ করা
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `${product.title} - Image ${index + 1}`;
        thumbnail.className = 'thumbnail';
        
        thumbnail.addEventListener('click', () => {
            mainImage.src = image;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // কালার অপশন সেট করা
    const colorOptions = document.getElementById('color-options');
    colorOptions.innerHTML = '';
    
    const colorSwatches = document.getElementById('color-swatches');
    colorSwatches.innerHTML = '';
    
    product.colors.forEach(color => {
        // টেক্সট কালার অপশন
        const colorOption = document.createElement('div');
        colorOption.className = 'variant-option';
        colorOption.textContent = color;
        
        colorOption.addEventListener('click', () => {
            document.querySelectorAll('#color-options .variant-option').forEach(o => o.classList.remove('selected'));
            colorOption.classList.add('selected');
            selectedColor = color;
            updateProductURL();
            
            if (product.colorImages && product.colorImages[color]) {
                mainImage.src = product.colorImages[color];
                document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                    if (index === 0) thumb.src = product.colorImages[color];
                });
            }
        });
        
        // If this color is selected from URL, mark it as selected
        if (color === selectedColor) {
            colorOption.classList.add('selected');
        }
        
        colorOptions.appendChild(colorOption);
        
        // কালার সোয়াচ
        if (product.colorCodes && product.colorCodes[color]) {
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.style.backgroundColor = product.colorCodes[color];
            colorSwatch.title = color;
            
            colorSwatch.addEventListener('click', () => {
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
                colorSwatch.classList.add('selected');
                selectedColor = color;
                updateProductURL();
                
                if (product.colorImages && product.colorImages[color]) {
                    mainImage.src = product.colorImages[color];
                    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                        if (index === 0) thumb.src = product.colorImages[color];
                    });
                }
            });
            
            // If this color is selected from URL, mark it as selected
            if (color === selectedColor) {
                colorSwatch.classList.add('selected');
            }
            
            colorSwatches.appendChild(colorSwatch);
        }
    });
    
    // সাইজ অপশন সেট করা
    const sizeOptions = document.getElementById('size-options');
    sizeOptions.innerHTML = '';
    
    product.sizes.forEach(size => {
        const sizeOption = document.createElement('div');
        sizeOption.className = 'variant-option';
        sizeOption.textContent = size;
        
        sizeOption.addEventListener('click', () => {
            document.querySelectorAll('#size-options .variant-option').forEach(o => o.classList.remove('selected'));
            sizeOption.classList.add('selected');
            selectedSize = size;
            updateProductURL();
        });
        
        // If this size is selected from URL, mark it as selected
        if (size === selectedSize) {
            sizeOption.classList.add('selected');
        }
        
        sizeOptions.appendChild(sizeOption);
    });
    
    // কোয়ান্টিটি রিসেট করা
    document.getElementById('quantity-input').value = 1;
    
    // ফ্রি ডেলিভারি অপশন
    if (product.deliveryFree) {
        freeDeliveryOption.style.display = 'block';
        document.querySelector('input[name="product-delivery"][value="free"]').checked = true;
    } else {
        freeDeliveryOption.style.display = 'none';
        document.querySelector('input[name="product-delivery"][value="inside"]').checked = true;
    }
    
    updateProductOrderSummary();
    showRelatedProducts(product.id);
    setupImageZoom();
}

// URL আপডেট করার ফাংশন
function updateProductURL() {
    if (!selectedProduct) return;
    
    const params = new URLSearchParams();
    if (selectedColor) params.set('color', selectedColor);
    if (selectedSize) params.set('size', selectedSize);
    
    const queryString = params.toString();
    const newHash = `#${selectedProduct.slug}${queryString ? `?${queryString}` : ''}`;
    
    // Update URL without reloading the page
    window.history.replaceState({}, '', newHash);
}

// showProductDetail ফাংশন আপডেট করুন
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Reset selected variants
    selectedColor = null;
    selectedSize = null;
    
    // Update URL
    window.history.pushState({ productId }, '', `#${product.slug}`);
    
    // প্রোডাক্ট ডিটেইল লোড করুন
    selectedProduct = product;
    loadProductDetail(product);
    switchView('detail');
}

// init ফাংশন আপডেট করুন
function init() {
    renderProducts();
    setupEventListeners();
    updateCartCount();
    setupChatbox();
    
    // URL চেক করুন
    handleHashChange();
    
    // হ্যাশ চেঞ্জ ইভেন্ট লিসেনার যোগ করুন
    window.addEventListener('hashchange', handleHashChange);
}

// back-to-products বাটনের ইভেন্ট লিসেনার আপডেট করুন
backToProducts.addEventListener('click', () => {
    window.history.pushState({}, '', window.location.pathname);
    switchView('products');
});

// Back to products button - Final version
backToProducts.addEventListener('click', function() {
    // Reset selected variants
    selectedColor = null;
    selectedSize = null;
    window.history.pushState({}, '', window.location.pathname);
    switchView('products');
});

// showProductDetail ফাংশনে পরিবর্তন
function showProductDetail(productId) {
    // Reset selected variants
    selectedColor = null;
    selectedSize = null;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Update URL
    window.history.pushState({ productId }, '', `#${product.slug}`);
    
    // Load product detail
    selectedProduct = product;
    loadProductDetail(product);
    switchView('detail');
}


// Back to product after checkout cart clear
clearCartBtn.addEventListener('click', () => {
    cart = [];
    updateCartCount();
    updateOrderSummary();
    // Redirect to products page
    switchView('products');
});

clearCartBtnFloating.addEventListener('click', () => {
    cart = [];
    updateCartCount();
    updateOrderSummary();
    // Redirect to products page
    switchView('products');
});
