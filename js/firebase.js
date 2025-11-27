// Firebase Configuration
// Replace with your Firebase credentials from console.firebase.google.com

const firebaseConfig = {
    apiKey: "AIzaSyCe3pLn3O717wc9uNqw9GhbBv09JunX0wU",
    authDomain: "blessedshop.firebaseapp.com",
    projectId: "blessedshop",
    storageBucket: "blessedshop.appspot.com",
    messagingSenderId: "845279848142",
    appId: "1:845279848142:web:a89861e49f591ef612129f",
    measurementId: "G-4173NKLHDT"
};

// Initialize Firebase
// Note: Replace with actual Firebase initialization if using real Firebase
// For development, we'll use mock functions

// Mock Firebase initialization
const mockFirebaseApp = {
    initialized: true,
    config: firebaseConfig
};

// Sample product data for demo
const mockProducts = [
    {
        id: "1",
        name: "iPhone 15 Pro",
        price: 999.99,
        category: "phones",
        description: "Latest Apple flagship smartphone with advanced camera system",
        image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=300&h=300&fit=crop",
        stock: 50
    },
    {
        id: "2",
        name: "Samsung Galaxy S24",
        price: 899.99,
        category: "phones",
        description: "Powerful Android device with stunning display",
        image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300&h=300&fit=crop",
        stock: 40
    },
    {
        id: "3",
        name: "Nike Air Max 90",
        price: 129.99,
        category: "shoes",
        description: "Iconic sneaker with comfortable cushioning",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        stock: 100
    },
    {
        id: "4",
        name: "Adidas Ultraboost",
        price: 179.99,
        category: "shoes",
        description: "Premium running shoe with boost technology",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        stock: 80
    },
    {
        id: "5",
        name: "Tesla Model 3",
        price: 43990,
        category: "cars",
        description: "Electric sedan with outstanding performance",
        image: "https://images.unsplash.com/photo-1560958089-b8a63c51c446?w=300&h=300&fit=crop",
        stock: 5
    },
    {
        id: "6",
        name: "BMW M440i",
        price: 68500,
        category: "cars",
        description: "Luxury sport car with premium features",
        image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=300&h=300&fit=crop",
        stock: 3
    },
    {
        id: "7",
        name: "Sony WH-1000XM5",
        price: 399.99,
        category: "electronics",
        description: "Premium wireless headphones with noise cancellation",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        stock: 60
    },
    {
        id: "8",
        name: "iPad Pro 12.9",
        price: 1099.99,
        category: "electronics",
        description: "Powerful tablet for professionals",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop",
        stock: 25
    }
];

// Store mock products in localStorage
if (!localStorage.getItem('mockProducts')) {
    localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
}

console.log('Firebase configuration loaded (mock)');
