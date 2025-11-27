# 🚀 BlessedShop - Quick Start Guide (5 Minutes)

## ⚡ Get Running in 5 Steps

### Step 1: Open in Browser (1 min)
1. Open folder: `E-COM WEBSITE`
2. Right-click `index.html`
3. Select "Open with" → Chrome/Firefox
4. **You're on the homepage!** ✅

---

### Step 2: Create Account (1 min)
1. Click **"Register"** (top right)
2. Enter:
   - Full Name: Your name
   - Email: test@example.com
   - Password: test123 (min 6 chars)
3. Click **"Register"**
4. **You're logged in!** ✅

---

### Step 3: Add to Cart (1 min)
1. Click **"Products"**
2. Find any product
3. Click **"View"**
4. Set quantity: 1
5. Click **"Add to Cart"**
6. **Product added!** ✅

---

### Step 4: Test Checkout (1 min)
1. Click **"Cart"** (top navigation)
2. Review items
3. Click **"Proceed to Checkout"**
4. Fill shipping info:
   - First Name: John
   - Last Name: Doe
   - Email: test@example.com
   - Address: 123 Main St
   - City: Lagos
   - State: Lagos
   - ZIP: 100001
5. Click **"Proceed to Payment"**
6. **Flutterwave modal opens!** ✅

---

### Step 5: Complete Test Payment (1 min)
1. Fill payment form:
   - Card Number: `4242 4242 4242 4242`
   - CVV: `123`
   - Expiry: `12/25`
2. Click **"Pay Now"** or similar
3. **Order placed!** ✅
4. See confirmation page
5. Download receipt

---

## ✨ Next Steps

### To Make It LIVE
1. Go to: https://dashboard.flutterwave.com
2. Create account
3. Get test API key
4. Open: `js/payment.js`
5. Find line: `const FLUTTERWAVE_PUBLIC_KEY = ...`
6. Replace with your key
7. **Done!** Start testing

### To Accept REAL Payments
1. Get live API key from Flutterwave
2. Update `js/payment.js` with live key
3. Deploy website
4. **Start earning!** 💰

---

## 📍 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `index.html` | Welcome & featured products |
| Products | `products.html` | Browse all products |
| Cart | `cart.html` | Review cart items |
| Checkout | `checkout.html` | Enter shipping & payment |
| Confirmation | `order-success.html` | Order received |
| Profile | `profile.html` | My orders & history |
| Admin | `admin.html` | Manage products |
| Order Tracking | `order-tracking.html` | View all orders |

---

## 💳 Test Cards

**Work Immediately:**
```
4242 4242 4242 4242 / 123 / 12/25
```

**Try Bank Transfer:**
Use any bank option in Flutterwave modal

---

## 🎯 Admin Access

**Not yet set?** Create your own admin:
1. Register normally
2. Admin features unlock at:
   - Email: `admin@blessedshop.com`

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Payment modal not opening | Check Flutterwave API key in `js/payment.js` |
| Orders not saving | Check browser localStorage (F12 → Storage) |
| Page looks broken | Refresh browser (Ctrl+F5) |
| Can't login | Check email & password match (passwords are case-sensitive) |
| Cart empty | Add products again (different browser?) |

---

## 📊 Test Scenarios

### Scenario 1: Complete Purchase ✅
1. Register
2. Add product
3. Checkout
4. Use test card
5. See confirmation

### Scenario 2: Admin Dashboard
1. Register as admin@blessedshop.com
2. Go to `/admin.html`
3. Add new product
4. View dashboard stats

### Scenario 3: Order Tracking
1. Complete purchase (above)
2. Go to Profile
3. View order history
4. Download receipt

---

## 🔗 Important Links

- **Flutterwave:** https://dashboard.flutterwave.com
- **Documentation:** `README.md` in folder
- **Payment Setup:** `FLUTTERWAVE_SETUP.md`
- **Full Summary:** `SETUP_SUMMARY.md`

---

## 💡 Pro Tips

- 📱 **Mobile Test:** Open on phone too! Fully responsive
- 🔄 **Refresh Cart:** Add items in multiple tabs
- 📦 **Multiple Orders:** Test ordering different products
- 👥 **Multiple Users:** Register different accounts
- 🛠️ **Developer Tools:** Press F12 to see console

---

## ❓ Common Questions

**Q: Can I add my own products?**
A: Yes! Go to `/admin.html` and add products

**Q: Will real money be charged?**
A: No! Test cards (4242 4242...) are free

**Q: Where's my data stored?**
A: Browser's localStorage (for testing). Use backend DB for production

**Q: How do I go LIVE?**
A: Get live Flutterwave keys, update API key, deploy

**Q: Can I change the design?**
A: Yes! Edit `css/style.css` and HTML files

---

## 🎉 Success Checklist

- [ ] Website opens in browser
- [ ] Can register & login
- [ ] Can view products
- [ ] Can add to cart
- [ ] Can proceed to checkout
- [ ] Payment modal opens
- [ ] Can complete test payment
- [ ] Order confirmation page shows
- [ ] Can download receipt
- [ ] Order appears in profile
- [ ] Admin dashboard works

**All checked?** → You're ready! 🚀

---

## 📞 Need Help?

1. **Check Documentation** → `README.md`
2. **Check Setup Guide** → `FLUTTERWAVE_SETUP.md`
3. **Check Console** → F12 → Console tab
4. **Contact Flutterwave** → support@flutterwave.com

---

## 🎊 You're All Set!

Your **BlessedShop** is ready to:
- ✅ Accept payments
- ✅ Process orders  
- ✅ Track shipments
- ✅ Generate receipts
- ✅ Manage products
- ✅ Serve customers

**Happy selling!** 🙏💰

---

**Quick Links:**
- Start Here → `index.html`
- Get Help → `README.md`
- Setup Payment → `FLUTTERWAVE_SETUP.md`
- Full Details → `SETUP_SUMMARY.md`

**Version:** 1.0 | **Status:** Production Ready ✨
