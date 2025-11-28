// Shopping Cart Functions

// Get cart from localStorage
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
    }
}

// Add item to cart
function addToCart(productId, productPrice) {
    try {
        const cart = getCart();
        const quantity = parseInt(document.getElementById('quantity')?.value || 1);
        
        // Get product details
        let product = null;
        
        // This will be populated by the page when product data is available
        // For now, we'll store the ID and price
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Fetch product details from mock data
            const products = JSON.parse(localStorage.getItem('mockProducts')) || [];
            product = products.find(p => p.id === productId);
            
            if (!product) {
                throw new Error('Product not found');
            }

            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart!');
        
        // Update cart count if visible
        updateCartCount();
        
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding product to cart');
        return false;
    }
}

// Remove item from cart
function removeFromCart(productId) {
    try {
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        console.log('Item removed from cart');
        updateCartCount();
        
        return true;
    } catch (error) {
        console.error('Error removing from cart:', error);
        return false;
    }
}

// Update item quantity
function updateCartQuantity(productId, quantity) {
    try {
        if (quantity < 1) return false;
        
        const cart = getCart();
        const item = cart.find(i => i.id === productId);
        
        if (item) {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error updating quantity:', error);
        return false;
    }
}

// Clear entire cart
function clearCart() {
    try {
        localStorage.removeItem('cart');
        console.log('Cart cleared');
        updateCartCount();
        return true;
    } catch (error) {
        console.error('Error clearing cart:', error);
        return false;
    }
}

// Get cart count
function getCartCount() {
    try {
        const cart = getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    } catch (error) {
        console.error('Error getting cart count:', error);
        return 0;
    }
}

// Get cart total
function getCartTotal() {
    try {
        const cart = getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch (error) {
        console.error('Error calculating cart total:', error);
        return 0;
    }
}

// Update cart count display
function updateCartCount() {
    try {
        const count = getCartCount();
        const cartCountElement = document.getElementById('cartCount');
        
        if (cartCountElement) {
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'inline' : 'none';
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Calculate shipping cost
function getShippingCost(subtotal) {
    // Free shipping on orders over NGN 100,000 (previously $100)
    // Shipping fee: NGN 10,000 (previously $10)
    if (subtotal > 100000) return 0;
    return 10000;
}

// Calculate tax (10% tax rate)
function calculateTax(subtotal) {
    return subtotal * 0.1;
}

// Get complete order summary
function getOrderSummary() {
    try {
        const cart = getCart();
        const subtotal = getCartTotal();
        const shipping = getShippingCost(subtotal);
        const tax = calculateTax(subtotal);
        const total = subtotal + shipping + tax;

        return {
            items: cart,
            subtotal: Math.round(subtotal),
            shipping: Math.round(shipping),
            tax: Math.round(tax),
            total: Math.round(total),
            itemCount: getCartCount()
        };
    } catch (error) {
        console.error('Error getting order summary:', error);
        return null;
    }
}

// Validate cart before checkout
function validateCartForCheckout() {
    try {
        const cart = getCart();
        
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return false;
        }

        const user = getCurrentUser();
        if (!user) {
            alert('Please login before checkout');
            window.location.href = 'login.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error validating cart:', error);
        return false;
    }
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

console.log('Cart functions loaded');
