require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./Product');
const User = require('./user');

const PRODUCTS = [
  { name: "Classic Cheeseburger", description: "Juicy beef patty, melted cheddar, fresh lettuce, tomato & our secret sauce.", price: 2500, category: "burgers", emoji: "🍔", badge: "Popular", rating: 4.9, reviewCount: 124, featured: true },
  { name: "Spicy Chicken Burger", description: "Crispy fried chicken with jalapeño mayo, pickles & sriracha drizzle.", price: 2800, category: "burgers", emoji: "🌶️", badge: "Hot", rating: 4.8, reviewCount: 89, featured: true },
  { name: "Chocolate Lava Cake", description: "Rich moist chocolate sponge with warm melting center.", price: 3500, category: "cakes", emoji: "🎂", badge: "Bestseller", rating: 5.0, reviewCount: 201, featured: true },
  { name: "Vanilla Birthday Cake", description: "Multi-layer vanilla sponge with buttercream frosting, custom decorations.", price: 4500, category: "cakes", emoji: "🎂", badge: "Custom", rating: 4.9, reviewCount: 156, featured: true },
  { name: "Puff Puff Pack (10pcs)", description: "Traditional Nigerian deep-fried dough balls. Crispy outside, fluffy inside.", price: 800, category: "snacks", emoji: "🫓", badge: "Nigerian", rating: 4.9, reviewCount: 312, featured: true },
  { name: "Meat Pie (4pcs)", description: "Flaky pastry filled with seasoned minced meat, potatoes & carrots.", price: 1200, category: "pastries", emoji: "🥐", badge: "", rating: 4.8, reviewCount: 98 },
  { name: "Chicken Shawarma", description: "Grilled chicken, cabbage slaw, tomatoes & special garlic sauce in warm wrap.", price: 2200, category: "sandwich", emoji: "🌯", badge: "Trending", rating: 4.7, reviewCount: 77, featured: true },
  { name: "Club Sandwich", description: "Triple-decker with turkey, bacon, egg, lettuce, tomato & mayo.", price: 1800, category: "sandwich", emoji: "🥪", badge: "", rating: 4.6, reviewCount: 54 },
  { name: "Jollof Rice + Chicken", description: "Party-style jollof rice cooked with tomatoes & spices, served with grilled chicken.", price: 2000, category: "nigerian", emoji: "🍲", badge: "Nigerian", rating: 5.0, reviewCount: 289, featured: true },
  { name: "Egusi Soup + Eba", description: "Hearty melon seed soup with assorted meat & stockfish, served with soft eba.", price: 1800, category: "nigerian", emoji: "🍛", badge: "Nigerian", rating: 4.9, reviewCount: 167 },
  { name: "Fried Rice & Plantain", description: "Nigerian fried rice with mixed vegetables & sweet fried ripe plantain.", price: 1900, category: "nigerian", emoji: "🍳", badge: "", rating: 4.8, reviewCount: 143 },
  { name: "Vanilla Cupcakes (6pcs)", description: "Light, fluffy vanilla cupcakes with swirled buttercream frosting.", price: 2500, category: "cakes", emoji: "🧁", badge: "", rating: 4.7, reviewCount: 82 },
  { name: "Strawberry Smoothie", description: "Blended fresh strawberries, banana, yogurt & honey. No added sugar.", price: 1500, category: "drinks", emoji: "🥤", badge: "Fresh", rating: 4.8, reviewCount: 91 },
  { name: "Pineapple Smoothie", description: "Fresh pineapple blended with coconut milk, ginger & lime.", price: 1400, category: "drinks", emoji: "🍍", badge: "", rating: 4.7, reviewCount: 63 },
  { name: "Suya (Beef Skewers)", description: "Thinly sliced beef marinated in suya spice blend, grilled to perfection.", price: 1500, category: "nigerian", emoji: "🍢", badge: "Hot", rating: 4.9, reviewCount: 198 },
  { name: "Chin Chin (Large Pack)", description: "Crunchy fried snack made with flour, milk & sugar.", price: 1000, category: "snacks", emoji: "🍪", badge: "Snack", rating: 4.6, reviewCount: 74 },
  { name: "Sausage Roll (6pcs)", description: "Seasoned sausage wrapped in flaky puff pastry, baked golden brown.", price: 1200, category: "pastries", emoji: "🥖", badge: "", rating: 4.7, reviewCount: 86 },
  { name: "Moi Moi (4 wraps)", description: "Steamed bean pudding with fish, eggs & peppers. Nigerian classic.", price: 1600, category: "nigerian", emoji: "🫘", badge: "Nigerian", rating: 4.8, reviewCount: 109 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/angel-kitchen');
  await Product.deleteMany({});
  await Product.insertMany(PRODUCTS);
  const adminExists = await User.findOne({ email: 'angelinainnovates@2gmail.com' });
  if (!adminExists) await User.create({ name: 'Admin', email: 'angelinainnovates@gmail.com', password: 'Darasimi@2010', role: 'admin', country: 'Nigeria' });
  console.log(`✅ Seeded ${PRODUCTS.length} products + admin user`);
  console.log('   Admin: angelinainnovates@gmail.com / Darasimi@2010');
  process.exit(0);
}
seed().catch(e => { console.error(e);
  process.exit(1); });