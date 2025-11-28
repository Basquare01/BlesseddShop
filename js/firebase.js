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

// Sample product data for demo (agricultural categories)
const mockProducts = [
    // Seeds (4)
    {
        id: "s-001",
        name: "Maize Seed - Hybrid",
        price: 2500,
        category: "seeds",
        description: "High-yield hybrid maize seed suited for tropical climates.",
        image: "https://plus.unsplash.com/premium_photo-1705146640695-cab3aa2005f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2VlZHxlbnwwfHwwfHx8MA%3D%3D",
        stock: 200
    },
    {
        id: "s-002",
        name: "Rice Seed - Aromatic",
        price: 1800,
        category: "seeds",
        description: "Aromatic rice seed variety for fragrant, high-quality grain.",
        image: "https://images.unsplash.com/photo-1535117156854-d5c5243361a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNlZWR8ZW58MHx8MHx8fDA%3D",
        stock: 150
    },
    {
        id: "s-003",
        name: "Vegetable Seed Mix",
        price: 900,
        category: "seeds",
        description: "Pack of mixed vegetable seeds: tomato, pepper, onion, and carrot.",
        image: "https://media.istockphoto.com/id/474987794/photo/dry-apple-seeds.webp?a=1&b=1&s=612x612&w=0&k=20&c=qvy-hN8snQ4qkZTzyKvRv8Pml9HVHpRjdAkBqxI_jUo=",
        stock: 300
    },
    {
        id: "s-004",
        name: "Soybean Seed - Certified",
        price: 2200,
        category: "seeds",
        description: "Certified soybean seeds with strong disease resistance.",
        image: "https://media.istockphoto.com/id/2164467736/photo/close-up-of-seeds-spilling-from-paper-bag-against-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=-4ljD2_U6uvjRJLheh48ysI4TSpissy0NN4Tsd3pe9w=",
        stock: 120
    },

    // Machinery (4)
    {
        id: "m-001",
        name: "2WD Mini Tractor",
        price: 6500000,
        category: "machinery",
            description: "Compact 2WD agricultural tractor designed for smallholder farms — efficient tillage, hauling and light ploughing.",
            image: "https://plus.unsplash.com/premium_photo-1661833381528-8ab4bfaf71cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWdyaWN1bHR1cmFsJTIwbWFjaGluZXJ5fGVufDB8fDB8fHww",
        stock: 8
    },
    {
        id: "m-002",
        name: "Power Tiller (Hand Tractor)",
        price: 3200000,
        category: "machinery",
            description: "Heavy-duty power tiller for land preparation, cultivating and ridging — compact and fuel-efficient.",
            image: "https://images.unsplash.com/photo-1689150396762-65ed008390cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YWdyaWN1bHR1cmFsJTIwbWFjaGluZXJ5fGVufDB8fDB8fHww",
        stock: 12
    },
    {
        id: "m-003",
        name: "Combine Harvester (Small)",
        price: 18500000,
        category: "machinery",
            description: "Compact combine harvester for harvesting cereals — cutter, threshing and separation in a single pass for medium-sized fields.",
            image: "https://plus.unsplash.com/premium_photo-1661835218311-0e1ffe741958?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWdyaWN1bHR1cmFsJTIwbWFjaGluZXJ5fGVufDB8fDB8fHww",
        stock: 2
    },
    {
        id: "m-004",
        name: "Motorised Water Pump",
        price: 1450000,
        category: "machinery",
            description: "Reliable motorised irrigation pump delivering high flow for small to medium-scale irrigation systems.",
            image: "https://images.unsplash.com/photo-1595702852378-f9c79111413f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFncmljdWx0dXJhbCUyMG1hY2hpbmVyeXxlbnwwfHwwfHx8MA%3D%3D",
        stock: 20
    },

    // Tools & Equipment (4)
    {
        id: "t-001",
        name: "Hand Hoe - Forged",
        price: 1500,
        category: "tools",
            description: "Sturdy forged hand hoe for effective weeding, bed preparation and planting tasks.",
            image: "https://images.unsplash.com/photo-1640306107674-23b73a335f12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFncmljdWx0dXJhbCUyMHRvb2wlMjBhbmQlMjBlcXVpcG1lbnR8ZW58MHx8MHx8fDA%3D",
        stock: 500
    },
    {
        id: "t-002",
        name: "Pruning Shears",
        price: 2200,
        category: "tools",
            description: "Precision pruning shears with ergonomic grip — ideal for trimming, shaping and maintaining orchards and hedges.",
            image: "https://images.unsplash.com/photo-1662559097550-ab7fc9056ec4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SG9lfGVufDB8fDB8fHww",
        stock: 350
    },
    {
        id: "t-003",
        name: "Seed Drill (Manual)",
        price: 48000,
        category: "tools",
            description: "Manual seed drill for consistent row spacing and depth control to improve germination and reduce seed waste.",
            image: "https://images.unsplash.com/photo-1585483266669-f9ff856159ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SG9lfGVufDB8fDB8fHww",
        stock: 40
    },
    {
        id: "t-004",
        name: "Sprayer Backpack 16L",
        price: 8500,
        category: "tools",
            description: "16-litre backpack sprayer with adjustable nozzle for even pesticide and foliar nutrient application.",
            image: "https://images.unsplash.com/photo-1598851418241-f52c34b6e4c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U2hvdmVsfGVufDB8fDB8fHww",
        stock: 220
    },

    // Soil (4)
    {
        id: "so-001",
        name: "Topsoil - Bag (50kg)",
        price: 4200,
        category: "soil",
            description: "Screened topsoil rich in organic matter — perfect for garden beds and landscaping projects.",
            image: "https://images.unsplash.com/photo-1613036582025-ba1d4ccb3226?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29pbHxlbnwwfHwwfHx8MA%3D%3D",
        stock: 180
    },
    {
        id: "so-002",
        name: "Compost - Bag (50kg)",
        price: 3600,
        category: "soil",
            description: "Well-rotted organic compost to boost soil biology, structure and long-term fertility.",
            image: "https://plus.unsplash.com/premium_photo-1664527009212-73e907133b02?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHNvaWx8ZW58MHx8MHx8fDA%3D",
        stock: 260
    },
    {
        id: "so-003",
        name: "Potting Mix - 25L",
        price: 1900,
        category: "soil",
            description: "Lightweight, well-draining potting mix formulated for seedlings, potted vegetables and ornamentals.",
            image: "https://media.istockphoto.com/id/1340871089/photo/substratum-texture-pattern-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=hfQ_2Dv_mDVmbX8f3WtshIMJid1M_t5ANq_yLC5zG58=",
        stock: 320
    },
    {
        id: "so-004",
        name: "Soil Conditioner (Granular)",
        price: 5200,
        category: "soil",
            description: "Granular soil conditioner to improve soil structure, aeration and moisture retention for heavier soils.",
            image: "https://images.unsplash.com/photo-1582288916603-4698cf723bf6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNvaWx8ZW58MHx8MHx8fDA%3D",
        stock: 140
    },

    // Fertilizers (4)
    {
        id: "f-001",
        name: "NPK 20-10-10 (Bag 50kg)",
        price: 7200,
        category: "fertilizers",
        description: "Balanced NPK 20-10-10 granular fertilizer for promoting strong vegetative and yield development in food crops.",
        image: "https://plus.unsplash.com/premium_photo-1680125265832-ffaf364a8aca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmVydGlsaXplcnxlbnwwfHwwfHx8MA%3D%3D",
        stock: 210
    },
    {
        id: "f-002",
        name: "Urea (46% Nitrogen) - Bag 50kg",
        price: 6800,
        category: "fertilizers",
        description: "Concentrated urea fertilizer (46% N) for rapid nitrogen replenishment during vegetative stages.",
        image: "https://images.unsplash.com/photo-1710223221719-6251cb1b5c5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RmVydGlsaXplcnxlbnwwfHwwfHx8MA%3D%3D",
        stock: 190
    },
    {
        id: "f-003",
        name: "Organic Poultry Manure - Bag 50kg",
        price: 5200,
        category: "fertilizers",
        description: "Composted poultry manure — organic nutrient source that improves soil structure and microbial activity.",
        image: "https://images.unsplash.com/photo-1637500980709-6e65a6c2418a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8RmVydGlsaXplcnxlbnwwfHwwfHx8MA%3D%3D",
        stock: 260
    },
    {
        id: "f-004",
        name: "Micronutrient Mix (Liquid 5L)",
        price: 3200,
        category: "fertilizers",
        description: "Liquid micronutrient concentrate for foliar application to quickly correct trace element deficiencies.",
        image: "https://plus.unsplash.com/premium_photo-1678652879155-bd82999aac9c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEZlcnRpbGl6ZXJ8ZW58MHx8MHx8fDA%3D",
        stock: 140
    }
];

// Store mock products in localStorage
if (!localStorage.getItem('mockProducts')) {
    localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
}

console.log('Firebase configuration loaded (mock)');
