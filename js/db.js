// Database Functions - Product and Order Management

// Get all products
async function getProducts() {
    try {
        const products = JSON.parse(localStorage.getItem('mockProducts')) || [];
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Get single product by ID
async function getProductById(productId) {
    try {
        const products = await getProducts();
        return products.find(p => p.id === productId);
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// Add new product (Admin only)
async function addProduct(product) {
    try {
        const products = await getProducts();
        
        // Check if product name already exists
        if (products.some(p => p.name.toLowerCase() === product.name.toLowerCase())) {
            throw new Error('Product already exists');
        }

        products.push(product);
        localStorage.setItem('mockProducts', JSON.stringify(products));
        
        console.log('Product added successfully:', product);
        return true;
    } catch (error) {
        console.error('Error adding product:', error);
        return false;
    }
}

// Delete product (Admin only)
async function deleteProductById(productId) {
    try {
        let products = await getProducts();
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('mockProducts', JSON.stringify(products));
        
        console.log('Product deleted successfully');
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

// Update product (Admin only)
async function updateProduct(productId, updatedData) {
    try {
        const products = await getProducts();
        const index = products.findIndex(p => p.id === productId);
        
        if (index === -1) {
            throw new Error('Product not found');
        }

        products[index] = { ...products[index], ...updatedData };
        localStorage.setItem('mockProducts', JSON.stringify(products));
        
        console.log('Product updated successfully');
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
}

// Save order
function saveOrder(orderData) {
    try {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        const newOrder = {
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            ...orderData,
            date: new Date().toLocaleDateString(),
            status: 'Processing'
        };

        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        console.log('Order saved:', newOrder);
        return newOrder;
    } catch (error) {
        console.error('Error saving order:', error);
        return null;
    }
}

// Get all orders (Firestore if available, otherwise localStorage)
async function getOrders() {
    try {
        let orders = [];
        
        // Always start with localStorage as base (most reliable)
        const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
        const localPendingOrders = JSON.parse(localStorage.getItem('pendingBankTransfers')) || [];
        orders = [...localOrders, ...localPendingOrders];
        
        console.log('Orders from localStorage:', orders);
        
        // If Firebase is initialized, ALSO read from Firestore and merge
        if (window.fb && fb.db) {
            try {
                console.log('Reading orders from Firestore...');
                const snapshot = await fb.db.collection('orders').orderBy('completedAtTS', 'desc').get();
                const firestoreOrders = snapshot.docs.map(d => {
                    const data = d.data();
                    // normalize timestamps
                    if (data.completedAtTS && data.completedAtTS.toDate) data.completedAt = data.completedAtTS.toDate().toISOString();
                    return data;
                });
                console.log('Orders from Firestore:', firestoreOrders);
                // Merge Firestore orders (avoid duplicates by ID)
                const orderIds = new Set(orders.map(o => o.id));
                for (const fsOrder of firestoreOrders) {
                    if (!orderIds.has(fsOrder.id)) {
                        orders.push(fsOrder);
                    }
                }
            } catch (err) {
                console.warn('Error reading orders from Firestore, using localStorage:', err);
            }
            
            // Also read pending bank transfers from Firestore
            try {
                console.log('Reading pending bank transfers from Firestore...');
                const pendingSnapshot = await fb.db.collection('pendingBankTransfers').orderBy('createdAt', 'desc').get();
                const pendingOrders = pendingSnapshot.docs.map(d => d.data());
                console.log('Pending orders from Firestore:', pendingOrders);
                // Merge pending orders (avoid duplicates by ID)
                const orderIds = new Set(orders.map(o => o.id));
                for (const pendingOrder of pendingOrders) {
                    if (!orderIds.has(pendingOrder.id)) {
                        orders.push(pendingOrder);
                    }
                }
            } catch (err) {
                console.warn('Error reading pending bank transfers from Firestore, using localStorage:', err);
            }
        }

        // Sort all orders by creation date (newest first)
        orders.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.date || 0).getTime();
            const dateB = new Date(b.createdAt || b.date || 0).getTime();
            return dateB - dateA;
        });

        console.log('Final orders list:', orders);
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        // Last resort: return localStorage data
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const pendingOrders = JSON.parse(localStorage.getItem('pendingBankTransfers')) || [];
        return [...orders, ...pendingOrders];
    }
}

// Get orders by user email (Firestore if available)
async function getOrdersByUser(email) {
    try {
        if (window.fb && fb.db) {
            // try to query by nested customer.email
            const q = await fb.db.collection('orders').where('customer.email', '==', email).get();
            if (!q.empty) return q.docs.map(d => d.data());

            // fallback: maybe older orders stored with top-level email field
            const q2 = await fb.db.collection('orders').where('email', '==', email).get();
            if (!q2.empty) return q2.docs.map(d => d.data());

            return [];
        }

        const orders = await getOrders();
        return orders.filter(o => (o.customer && o.customer.email === email) || o.email === email);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return [];
    }
}

// Get order statistics (Firestore if available)
async function getOrderStats() {
    try {
        const orders = await getOrders();
        const totalRevenue = orders.reduce((sum, o) => {
            // support multiple possible shapes
            const amt = (o.amounts && o.amounts.total) || o.total || 0;
            return sum + (parseFloat(amt) || 0);
        }, 0);

        return {
            totalOrders: orders.length,
            totalRevenue: totalRevenue.toFixed(2),
            averageOrderValue: (totalRevenue / (orders.length || 1)).toFixed(2)
        };
    } catch (error) {
        console.error('Error calculating statistics:', error);
        return { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
    }
}

// Search products
async function searchProducts(query) {
    try {
        const products = await getProducts();
        return products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        );
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}

// Filter products by category
async function getProductsByCategory(category) {
    try {
        const products = await getProducts();
        return products.filter(p => p.category === category);
    } catch (error) {
        console.error('Error filtering products:', error);
        return [];
    }
}

// Get low stock products (Admin)
async function getLowStockProducts(threshold = 10) {
    try {
        const products = await getProducts();
        return products.filter(p => (p.stock || 0) < threshold);
    } catch (error) {
        console.error('Error getting low stock products:', error);
        return [];
    }
}

console.log('Database functions loaded');
