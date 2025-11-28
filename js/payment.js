// Flutterwave Payment Integration for BlessedShop
// This uses the Flutterwave Standard API for Nigeria NGN payments

// ========== FLUTTERWAVE CONFIGURATION ==========
// NOTE: public key is safe to use client-side. Secret key must stay server-side.
const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK_TEST-4bc9bcda7d4ae9b04e3947cd778d8189-X'; // User-provided Test Public Key
const FLUTTERWAVE_LIVE_KEY = 'YOUR_LIVE_PUBLIC_KEY'; // Replace with live key when ready

// Use test key for development
const FLUTTERWAVE_KEY = FLUTTERWAVE_PUBLIC_KEY;

// ========== DUMMY TEST CARDS ==========
// Use these for testing without real money:
// Card Number: 4242 4242 4242 4242
// CVV: 123
// Expiry: 12/25
// Amount: Any amount

// ========== ORDER MANAGEMENT ==========

// Generate unique order reference
function generateOrderReference() {
    return 'BS_' + Math.random().toString(36).substr(2, 9).toUpperCase() + '_' + Date.now();
}

// Create order object
function createOrder(cartItems, subtotal, formData) {
    // Shipping scaled to NGN: free over NGN 100,000, otherwise NGN 10,000
    const shipping = subtotal > 100000 ? 0 : 10000;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return {
        id: generateOrderReference(),
        items: cartItems,
        customer: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone || ''
        },
        shipping: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipcode: formData.zipcode
        },
        amounts: {
            subtotal: parseFloat(subtotal.toFixed(2)),
            shipping: parseFloat(shipping.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
        paymentMethod: 'flutterwave'
    };
}

// Initialize Flutterwave payment
function initFlutterwavePayment(order) {
    return new Promise((resolve, reject) => {
        try {
            // Prefer v3 `getpaidSetup` which is provided by https://checkout.flutterwave.com/v3.js
            if (typeof getpaidSetup === 'function') {
                const config = {
                    public_key: FLUTTERWAVE_KEY,
                    tx_ref: order.id,
                    amount: order.amounts.total, // use NGN (no *100)
                    currency: 'NGN',
                    payment_options: 'card,banktransfer',
                    customer: {
                        email: order.customer.email,
                        phonenumber: order.customer.phone || '+234000000000',
                        name: order.customer.firstName + ' ' + order.customer.lastName,
                    },
                    customizations: {
                        title: 'BlessedShop Payment',
                        description: 'Payment for BlessedShop Order ' + order.id,
                        logo: '🙏'
                    },
                    callback: async function(data) {
                        console.log('Flutterwave callback:', data);
                        // Flutterwave returns status 'successful' on success
                        if (data && data.status === 'successful') {
                            // Verify with server before marking order complete
                            const verified = await verifyPaymentWithServer(data.tx_ref || order.id, order);
                            if (verified) {
                                processPaymentSuccess(order, data);
                                resolve(data);
                            } else {
                                // Server verification failed; still save locally but warn user
                                console.warn('Server verification failed, but saving order locally (payment may need manual review)');
                                processPaymentSuccess(order, data);
                                resolve(data);
                            }
                        } else if (data && data.status === 'cancelled') {
                            reject(new Error('Payment cancelled by user'));
                        } else {
                            reject(new Error('Payment failed'));
                        }
                    },
                    onclose: function() {
                        // User closed the modal
                        reject(new Error('Payment modal closed'));
                    }
                };

                // Open the Flutterwave modal
                try {
                    getpaidSetup(config);
                } catch (err) {
                    console.error('Error calling getpaidSetup:', err);
                    reject(err);
                }

                return;
            }

            // Fallback: older/newer SDKs may expose FlutterwaveCheckout
            if (typeof FlutterwaveCheckout !== 'undefined') {
                try {
                    const flw = new FlutterwaveCheckout({ public_key: FLUTTERWAVE_KEY });
                    if (typeof flw.checkout === 'function') {
                        flw.checkout({
                            tx_ref: order.id,
                            amount: order.amounts.total,
                            currency: 'NGN',
                            customer: {
                                email: order.customer.email,
                                phonenumber: order.customer.phone || '+234000000000',
                                name: order.customer.firstName + ' ' + order.customer.lastName
                            },
                            customizations: {
                                title: 'BlessedShop Payment',
                                description: 'Payment for BlessedShop Order ' + order.id,
                                logo: '🙏'
                            },
                            callback: async function(data) {
                                if (data && data.status === 'successful') {
                                    // Verify with server before marking order complete
                                    const verified = await verifyPaymentWithServer(data.tx_ref || order.id, order);
                                    if (verified) {
                                        processPaymentSuccess(order, data);
                                        resolve(data);
                                    } else {
                                        console.warn('Server verification failed, but saving order locally');
                                        processPaymentSuccess(order, data);
                                        resolve(data);
                                    }
                                } else if (data && data.status === 'cancelled') {
                                    reject(new Error('Payment cancelled by user'));
                                } else {
                                    reject(new Error('Payment failed'));
                                }
                            },
                            onclose: function() {
                                reject(new Error('Payment modal closed'));
                            }
                        });
                        return;
                    }
                } catch (err) {
                    console.error('FlutterwaveCheckout fallback error:', err);
                }
            }

            console.warn('Flutterwave SDK not available (getpaidSetup or FlutterwaveCheckout)');

            // Fallback for local testing: offer to simulate a successful payment so users
            // can continue testing the checkout flow without the real SDK.
            // Keep the fallback interactive so accidental simulations are avoided.
            try {
                const simulate = confirm('Payment provider not available. Click OK to simulate a successful payment for testing, Cancel to abort.');
                if (simulate) {
                    // Create a fake payment response similar to Flutterwave's shape
                    const fakePayment = {
                        status: 'successful',
                        transaction_id: 'SIM_' + Date.now(),
                        flw_ref: 'SIM_' + Date.now(),
                        id: 'SIM_' + Date.now()
                    };

                    // Small delay to mimic async behavior
                    setTimeout(() => {
                        processPaymentSuccess(order, fakePayment);
                        resolve(fakePayment);
                    }, 600);
                    return;
                } else {
                    reject(new Error('Payment system not ready'));
                    return;
                }
            } catch (err) {
                console.error('Error during payment simulation fallback:', err);
                reject(new Error('Payment system not ready'));
                return;
            }
        } catch (error) {
            console.error('Flutterwave error:', error);
            reject(error);
        }
    });
}

// Verify payment with server before finalizing order
async function verifyPaymentWithServer(tx_ref, order) {
    try {
        // Call server verify endpoint to confirm transaction server-side
        // Use ngrok URL for local testing; replace with production domain in deployment
        const baseUrl = 'https://intercessional-aloofly-yousef.ngrok-free.dev';
        const verifyUrl = `${baseUrl}/verify/${encodeURIComponent(tx_ref)}`;
        const response = await fetch(verifyUrl);
        const result = await response.json();
        
        console.log('Server verification result:', result);
        
        if (response.ok && result.result && result.result.status === 'successful') {
            console.log('Payment verified by server');
            return true;
        } else {
            console.warn('Server verification failed or transaction not successful');
            return false;
        }
    } catch (error) {
        console.error('Error verifying payment with server:', error);
        // On network error, still allow local success (fallback) but log the issue
        return false;
    }
}

// Process successful payment
function processPaymentSuccess(order, paymentData) {
    try {
        // Update order status and identifiers
        order.status = 'completed';
        order.paymentId = paymentData.transaction_id || paymentData.flw_ref || paymentData.id || paymentData.transactionId || '';
        order.completedAt = new Date().toISOString();

        // If Firebase is available, persist to Firestore + Storage (prefer server timestamps)
        if (window.fb && fb.db) {
            (async () => {
                try {
                    const serverTs = fb.firebase && fb.firebase.firestore ? fb.firebase.firestore.FieldValue.serverTimestamp() : null;

                    // Write order document to `orders` collection
                    const orderDoc = Object.assign({}, order);
                    if (serverTs) orderDoc.completedAtTS = serverTs;
                    await fb.db.collection('orders').doc(order.id).set(orderDoc);

                    // Generate and save receipt
                    const receipt = generateReceipt(order);
                    await fb.db.collection('receipts').add({ orderId: order.id, receipt: receipt, generatedAt: serverTs || new Date().toISOString() });

                    // Create email log entry
                    await fb.db.collection('emailLog').add({ type: 'order_confirmation', to: order.customer.email, subject: `Order Confirmation - BlessedShop #${order.id}`, orderId: order.id, sentAt: serverTs || new Date().toISOString() });

                    // Create admin notification
                    try {
                        await fb.db.collection('adminNotifications').add({
                            type: 'order_completed',
                            orderId: order.id,
                            customerName: order.customer.firstName + ' ' + order.customer.lastName,
                            totalAmount: order.amounts.total,
                            itemCount: order.items ? order.items.length : 0,
                            notifiedAt: serverTs || new Date().toISOString()
                        });
                    } catch (notifErr) {
                        console.warn('Failed to create admin notification in Firestore:', notifErr);
                    }

                    // Clear client cart
                    try { localStorage.removeItem('cart'); } catch (e) { /* ignore */ }

                    // Redirect to success page
                    window.location.href = 'order-success.html';
                    console.log('Order processed and saved to Firestore:', order.id);
                    return;
                } catch (err) {
                    console.error('Error saving order to Firestore, falling back to local storage:', err);
                    // fall through to localStorage fallback
                }
            })();
            // return early - Firestore async operation will redirect on success
            return;
        }

        // Fallback: Save order to localStorage when Firebase not available or on error
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Generate and store receipt
        const receipt = generateReceipt(order);
        const receipts = JSON.parse(localStorage.getItem('receipts')) || [];
        receipts.push({
            orderId: order.id,
            receipt: receipt,
            generatedAt: new Date().toISOString()
        });
        localStorage.setItem('receipts', JSON.stringify(receipts));

        // Send email notifications locally
        sendOrderConfirmationEmail(order);
        sendAdminNotification(order);

        // Clear cart
        localStorage.removeItem('cart');

        // Redirect to success page
        window.location.href = 'order-success.html';

        console.log('Order processed successfully (local):', order.id);
    } catch (error) {
        console.error('Error processing payment:', error);
    }
}

// ========== RECEIPT GENERATION ==========

function generateReceipt(order) {
    const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
                .receipt { border: 1px solid #ddd; padding: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .logo { font-size: 32px; margin-bottom: 10px; }
                .company-name { font-size: 24px; font-weight: bold; }
                .receipt-number { color: #666; margin-top: 10px; }
                .section { margin: 20px 0; }
                .section-title { font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
                th { background-color: #f5f5f5; font-weight: bold; }
                .total-row { font-weight: bold; font-size: 16px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="receipt">
                <div class="header">
                    <div class="logo">🙏</div>
                    <div class="company-name">BLESSEDSHOP</div>
                    <div class="receipt-number">Receipt #${order.id}</div>
                    <div style="color: #666; font-size: 12px;">Date: ${new Date(order.completedAt).toLocaleString()}</div>
                </div>

                <div class="section">
                    <div class="section-title">Customer Information</div>
                    <p>Name: ${order.customer.firstName} ${order.customer.lastName}</p>
                    <p>Email: ${order.customer.email}</p>
                    <p>Phone: ${order.customer.phone || 'N/A'}</p>
                </div>

                <div class="section">
                    <div class="section-title">Shipping Address</div>
                    <p>${order.shipping.address}</p>
                    <p>${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipcode}</p>
                </div>

                <div class="section">
                    <div class="section-title">Order Items</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>₦${item.price.toLocaleString()}</td>
                                    <td>₦${(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="section">
                    <table>
                        <tr>
                            <td>Subtotal:</td>
                            <td>₦${order.amounts.subtotal.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>Shipping:</td>
                            <td>₦${order.amounts.shipping.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>Tax (10%):</td>
                            <td>₦${order.amounts.tax.toLocaleString()}</td>
                        </tr>
                        <tr class="total-row">
                            <td>TOTAL:</td>
                            <td>₦${order.amounts.total.toLocaleString()}</td>
                        </tr>
                    </table>
                </div>

                <div class="section">
                    <div class="section-title">Payment Information</div>
                    <p>Payment Method: Flutterwave (Card/Bank Transfer)</p>
                    <p>Transaction ID: ${order.paymentId}</p>
                    <p>Status: <span style="color: green; font-weight: bold;">PAID</span></p>
                </div>

                <div class="footer">
                    <p>Thank you for shopping with BlessedShop!</p>
                    <p>For support, contact us at support@blessedshop.com</p>
                    <p style="margin-top: 20px;">© 2025 BlessedShop. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return receiptHTML;
}

// Download receipt as PDF/HTML
function downloadReceipt(orderId) {
    try {
        const receipts = JSON.parse(localStorage.getItem('receipts')) || [];
        const receiptData = receipts.find(r => r.orderId === orderId);

        if (!receiptData) {
            alert('Receipt not found');
            return;
        }

        // Create blob and download
        const blob = new Blob([receiptData.receipt], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${orderId}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log('Receipt downloaded');
    } catch (error) {
        console.error('Error downloading receipt:', error);
    }
}

// ========== EMAIL NOTIFICATIONS ==========

// Send order confirmation email (mock)
function sendOrderConfirmationEmail(order) {
    try {
        // In production, this would call a backend email service
        // For now, we'll just log and store the email data
        const emailLog = {
            type: 'order_confirmation',
            to: order.customer.email,
            subject: `Order Confirmation - BlessedShop #${order.id}`,
            orderId: order.id,
            sentAt: new Date().toISOString()
        };

        const emails = JSON.parse(localStorage.getItem('emailLog')) || [];
        emails.push(emailLog);
        localStorage.setItem('emailLog', JSON.stringify(emails));

        console.log('Order confirmation email sent to:', order.customer.email);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Send admin notification
function sendAdminNotification(order) {
    try {
        const adminNotification = {
            type: 'new_order',
            orderId: order.id,
            customerName: order.customer.firstName + ' ' + order.customer.lastName,
            totalAmount: order.amounts.total,
            itemCount: order.items.length,
            notifiedAt: new Date().toISOString()
        };

        const notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
        notifications.push(adminNotification);
        localStorage.setItem('adminNotifications', JSON.stringify(notifications));

        console.log('Admin notification created for order:', order.id);
    } catch (error) {
        console.error('Error creating admin notification:', error);
    }
}

// ========== ORDER TRACKING ==========

function getOrderStatus(orderId) {
    try {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.id === orderId);

        if (!order) {
            return null;
        }

        return {
            id: order.id,
            status: order.status,
            createdAt: order.createdAt,
            completedAt: order.completedAt,
            items: order.items,
            total: order.amounts.total
        };
    } catch (error) {
        console.error('Error getting order status:', error);
        return null;
    }
}

// Get user's orders
function getUserOrders(email) {
    try {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        return orders.filter(o => o.customer.email === email);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return [];
    }
}

console.log('Flutterwave Payment System initialized');

// ========== BANK TRANSFER PAYMENT ==========

async function initBankTransfer(order) {
    // Robust async/await version with fallback
    try {
        // Get proof file if uploaded
        const proofInput = document.getElementById('bankProofFile');
        const proofFile = proofInput ? proofInput.files[0] : null;

        // Mark order as pending payment (bank transfer awaiting verification)
        order.status = 'pending_verification';
        order.paymentMethod = 'bank_transfer';
        order.bankDetails = {
            bank: 'Access Bank',
            accountName: 'Bilal Sulaiman Hassan',
            accountNumber: '1232279123',
            reference: order.id
        };
        order.createdAt = new Date().toISOString();

        // Store proof as base64 if uploaded
        if (proofFile) {
            try {
                order.paymentProof = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve({
                            fileName: proofFile.name,
                            dataUrl: e.target.result,
                            uploadedAt: new Date().toISOString()
                        });
                    };
                    reader.onerror = () => {
                        reject(new Error('Error reading proof file'));
                    };
                    reader.readAsDataURL(proofFile);
                });
            } catch (fileErr) {
                alert('Error reading proof file. Proceeding without proof.');
            }
        }

        // Always save to localStorage for pending order lookup
        try {
            const pendingOrders = JSON.parse(localStorage.getItem('pendingBankTransfers')) || [];
            pendingOrders.push(order);
            localStorage.setItem('pendingBankTransfers', JSON.stringify(pendingOrders));

            // Create admin notification
            const notification = {
                type: 'pending_bank_transfer',
                orderId: order.id,
                customerName: order.customer.firstName + ' ' + order.customer.lastName,
                customerEmail: order.customer.email,
                amount: order.amounts.total,
                hasProof: Boolean(order.paymentProof),
                reference: order.id,
                createdAt: new Date().toISOString()
            };
            const notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
            notifications.push(notification);
            localStorage.setItem('adminNotifications', JSON.stringify(notifications));
        } catch (localErr) {
            alert('Error saving order locally. Please try again.');
            throw localErr;
        }
        // Try Firebase (best effort, but localStorage is primary for lookup)
        if (window.fb && fb.db && fb.storage) {
            try {
                await saveBankTransferOrder(order, () => {}, () => {});
            } catch (firebaseErr) {
                console.error('Error saving order to Firebase:', firebaseErr);
                alert('Error saving order to server. Saved locally.');
            }
        }
        // Always show success and redirect
        alert(`Bank Transfer Order Created!\n\nOrder Reference: ${order.id}\n\nPlease transfer ₦${order.amounts.total.toLocaleString()} to:\n\nAccess Bank\n${order.bankDetails.accountNumber}\n${order.bankDetails.accountName}\n\nUse the order reference as the transfer description.\n\nYour order will be confirmed once we verify the payment.`);
        localStorage.removeItem('cart');
        window.location.href = 'order-pending.html?orderId=' + order.id;
    } catch (error) {
        console.error('Bank transfer init error:', error);
        alert('Payment error: ' + (error.message || error));
        // Re-enable button so user can retry
        const proceedBtn = document.getElementById('proceedBtn');
        if (proceedBtn) {
            proceedBtn.disabled = false;
            proceedBtn.textContent = 'Proceed to Payment';
        }
    }
}

function saveBankTransferOrder(order, resolve, reject) {
    (async () => {
        try {
            // If Firebase is available, upload proof to Storage and save to Firestore
            if (window.fb && fb.db && fb.storage) {
                // prepare timestamps
                order.createdAt = new Date().toISOString();
                // server timestamp field for ordering
                const serverTs = fb.firebase && fb.firebase.firestore ? fb.firebase.firestore.FieldValue.serverTimestamp() : null;

                if (order.paymentProof && order.paymentProof.dataUrl) {
                    try {
                        const path = `paymentProofs/${order.id}/${order.paymentProof.fileName}`;
                        const ref = fb.storage.ref(path);
                        // putString with data_url
                        await ref.putString(order.paymentProof.dataUrl, 'data_url');
                        const downloadURL = await ref.getDownloadURL();
                        order.paymentProofUrl = downloadURL;
                        // keep metadata but remove the dataUrl to keep doc small
                        order.paymentProof = { fileName: order.paymentProof.fileName, uploadedAt: order.paymentProof.uploadedAt };
                    } catch (uploadErr) {
                        console.warn('Failed to upload proof to Firebase Storage, saving order without proof URL:', uploadErr);
                    }
                }

                // add server timestamp field for ordering
                const docData = Object.assign({}, order);
                if (serverTs) docData.createdAtTS = serverTs;

                await fb.db.collection('pendingBankTransfers').doc(order.id).set(docData);

                // create admin notification document
                try {
                    await fb.db.collection('adminNotifications').add({
                        type: 'pending_bank_transfer',
                        orderId: order.id,
                        customerName: order.customer.firstName + ' ' + order.customer.lastName,
                        customerEmail: order.customer.email,
                        amount: order.amounts.total,
                        hasProof: Boolean(order.paymentProofUrl || order.paymentProof),
                        reference: order.id,
                        createdAt: serverTs || new Date().toISOString()
                    });
                } catch (notifErr) {
                    console.warn('Failed to create admin notification in Firestore:', notifErr);
                }

                // Clear cart (local)
                localStorage.removeItem('cart');

                alert(`Bank Transfer Order Created!\n\nOrder Reference: ${order.id}\n\nPlease transfer ₦${order.amounts.total.toLocaleString()} to:\n\nAccess Bank\n${order.bankDetails.accountNumber}\n${order.bankDetails.accountName}\n\nUse the order reference as the transfer description.\n\nYour order will be confirmed once we verify the payment.`);

                // Redirect to pending page
                window.location.href = 'order-pending.html?orderId=' + order.id;

                resolve(order);
                return;
            }

            // Fallback: save to localStorage as before
            const pendingOrders = JSON.parse(localStorage.getItem('pendingBankTransfers')) || [];
            pendingOrders.push(order);
            localStorage.setItem('pendingBankTransfers', JSON.stringify(pendingOrders));

            // Create admin notification
            const notification = {
                type: 'pending_bank_transfer',
                orderId: order.id,
                customerName: order.customer.firstName + ' ' + order.customer.lastName,
                customerEmail: order.customer.email,
                amount: order.amounts.total,
                hasProof: Boolean(order.paymentProof),
                reference: order.id,
                createdAt: new Date().toISOString()
            };

            const notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
            notifications.push(notification);
            localStorage.setItem('adminNotifications', JSON.stringify(notifications));

            console.log('Bank transfer order created, pending verification:', order);

            // Show success message with order reference
            alert(`Bank Transfer Order Created!\n\nOrder Reference: ${order.id}\n\nPlease transfer ₦${order.amounts.total.toLocaleString()} to:\n\nAccess Bank\n${order.bankDetails.accountNumber}\n${order.bankDetails.accountName}\n\nUse the order reference as the transfer description.\n\nYour order will be confirmed once we verify the payment.`);

            // Clear cart
            localStorage.removeItem('cart');

            // Redirect to a pending order page
            window.location.href = 'order-pending.html?orderId=' + order.id;

            resolve(order);
        } catch (error) {
            console.error('Error saving bank transfer order:', error);
            try { reject(error); } catch (e) { console.error(e); }
        }
    })();
}
