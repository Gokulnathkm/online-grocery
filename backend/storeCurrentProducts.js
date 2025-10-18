require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./model/product');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/online-grocery', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Exact products from the UI (same names, prices, images)
const currentProducts = [
  { name: "Basmati Rice 1kg", price: 75, image: "https://plus.unsplash.com/premium_photo-1658527064466-df8ed3bbe6e7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGJhc21hdGklMjByaWNlfGVufDB8fDB8fHww", stock: 100 },
  { name: "Wheat Flour 1kg", price: 50, image: "https://images.unsplash.com/photo-1627735483792-233bf632619b?q=80&w=2085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", stock: 100 },
  { name: "Sunflower Oil 1L", price: 180, image: "https://media.istockphoto.com/id/186768677/photo/pouring-eating-oil-in-frying-pan.jpg?s=1024x1024&w=is&k=20&c=rLxVl5KrB77C0tP9rP5bu5eK04IrEWYoWDTIZwfUxCQ=", stock: 100 },
  { name: "Sugar 1kg", price: 60, image: "https://plus.unsplash.com/premium_photo-1726072362679-2b2023862024?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", stock: 100 },
  { name: "Salt 1kg", price: 40, image: "https://images.unsplash.com/photo-1634612831148-03a8550e1d52?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2FsdHxlbnwwfHwwfHx8MA%3D%3D", stock: 100 },
  { name: "Ghee 1L", price: 500, image: "https://media.istockphoto.com/id/1187181045/photo/pure-or-desi-ghee-clarified-melted-butter-healthy-fats-bulletproof-diet-concept-or-paleo.jpg?s=1024x1024&w=is&k=20&c=-4zQOcgG2okpWgMADLsPhwyieXawsF95998EG-tdwEw=", stock: 100 },
  { name: "Tea 500g", price: 200, image: "https://media.istockphoto.com/id/1467843547/photo/black-tea-dust-dried-and-grinded-tea-leaves-powder-on-spoon-lose-leaf-tea-dust-view-cha-preto.webp?a=1&b=1&s=612x612&w=0&k=20&c=WtDmBhkgkZ7UROmEEu1JtWNHwNaexntfV9LVh_a4jOs=", stock: 100 },
  { name: "Coffee 250g", price: 300, image: "https://media.istockphoto.com/id/533840078/photo/coffee-ground-in-portafilter-for-espresso.webp?a=1&b=1&s=612x612&w=0&k=20&c=wSnzer7Xw2uE6scz3fEJ1VCU7JzRYZcXMVb8unG7UPE=", stock: 100 },
  { name: "Tomatoes 1kg", price: 60, image: "https://images.unsplash.com/photo-1671528443617-26b1ecebb66f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHRvbWF0b2VzfGVufDB8fDB8fHww", stock: 100 },
  { name: "Onions 1kg", price: 50, image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25pb25zfGVufDB8fDB8fHww", stock: 100 },
  { name: "Potatoes 1kg", price: 45, image: "https://images.unsplash.com/photo-1508313880080-c4bef0730395?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG90YXRvZXN8ZW58MHx8MHx8fDA%3D", stock: 100 },
  { name: "Garlic 250g", price: 70, image: "https://images.unsplash.com/photo-1636210589096-a53d5dacd702?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8R2FybGljfGVufDB8fDB8fHww", stock: 100 },
  { name: "Ginger 250g", price: 80, image: "https://images.unsplash.com/photo-1635843104103-ddd88e1c5141?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2luZ2VyfGVufDB8fDB8fHww", stock: 100 },
  { name: "Milk 1L", price: 60, image: "https://media.istockphoto.com/id/1337307092/photo/pouring-fresh-milk-in-glass.webp?a=1&b=1&s=612x612&w=0&k=20&c=t2HYWRK8wpNgDx9YTB__Y0znmS0c9PU8qZ8uUA0TD5w=", stock: 100 },
  { name: "Curd 500g", price: 50, image: "https://media.istockphoto.com/id/1049728740/photo/plain-curd-or-yogurt-or-dahi-in-hindi-served-in-a-bowl-over-moody-background-selective-focus.webp?a=1&b=1&s=612x612&w=0&k=20&c=BDcP3eYHXvSQ0i_znppv2fLUiyghKq7xAfKO9MEASGE=", stock: 100 },
  { name: "Eggs 12pcs", price: 120, image: "https://plus.unsplash.com/premium_photo-1676686125407-227f3d352df8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWdnc3xlbnwwfHwwfHx8MA%3D%3D", stock: 100 },
  { name: "Cheese 200g", price: 180, image: "https://images.unsplash.com/photo-1683314573422-649a3c6ad784?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlZXNlfGVufDB8fDB8fHww", stock: 100 },
  { name: "Butter 250g", price: 150, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnV0dGVyfGVufDB8fDB8fHww", stock: 100 },
  { name: "Paneer 500g", price: 200, image: "https://media.istockphoto.com/id/1210307314/photo/homemade-indian-paneer-cheese-made-from-fresh-milk-and-lemon-juice-diced-in-a-wooden-bowl-on.webp?a=1&b=1&s=612x612&w=0&k=20&c=lxl09yuBFdNixpBtfraw3FR9Z1TMzohRVTKj5nDcFdY=", stock: 100 }
];

// Store products function
const storeCurrentProducts = async () => {
  try {
    await connectDB();
    
    // Check if products already exist
    const existingProducts = await Product.find();
    console.log(`Found ${existingProducts.length} existing products in database`);
    
    if (existingProducts.length > 0) {
      console.log('\nExisting products:');
      existingProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - ₹${product.price} (Stock: ${product.stock})`);
      });
      
      const response = await new Promise((resolve) => {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        readline.question('\nDo you want to clear existing products and add the current UI products? (y/N): ', (answer) => {
          readline.close();
          resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
      });
      
      if (!response) {
        console.log('Operation cancelled. Existing products remain unchanged.');
        process.exit(0);
      }
      
      // Clear existing products
      await Product.deleteMany({});
      console.log('Cleared existing products from database.');
    }
    
    // Insert current products
    console.log('\nStoring current UI products to database...');
    const products = await Product.insertMany(currentProducts);
    console.log(`\n✅ Successfully stored ${products.length} products to the database!`);
    
    // Display the stored products
    console.log('\n📦 Stored products:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price} (Stock: ${product.stock})`);
    });
    
    console.log('\n🎉 All current UI products have been successfully stored in the database!');
    console.log('The admin dashboard will now load these products from the database.');
    
  } catch (error) {
    console.error('❌ Error storing products:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run the function
console.log('🔄 Storing current UI products to database...');
storeCurrentProducts();
