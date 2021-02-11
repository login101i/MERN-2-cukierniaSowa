const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const colors=require('colors')


const products = require('../data/products');

// Setting dotenv file
dotenv.config({ path: 'backend/config/config.env' })

connectDatabase();

const seedProducts = async () => {
    try {

        await Product.deleteMany();
        console.log('Produkty zostały usunięte.'.red.inverse);

        await Product.insertMany(products)
        console.log('Dodano wszystkie produkty.'.green.inverse)

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedProducts()