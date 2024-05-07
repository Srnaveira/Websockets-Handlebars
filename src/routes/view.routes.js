import { Router } from 'express';
import { __dirname } from "../utils.js"
import ProductManager from '../controles/productManager.js';
import express from 'express';

const router = express.Router();

const pManager = new ProductManager();


router.get('/', async (req, res) => {
    const listProducts = await pManager.loadProducts();
    res.render('home', {listProducts}) 
});


router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts', {});

});


export default router;