import { Router } from 'express';
import { __dirname } from "../utils.js"
import ProductManager from '../controles/productManager.js';

const router = Router();

const pManager = new ProductManager();


router.get('/', async (req, res) => {
    const listProducts = await pManager.loadProducts();
    res.render('home', {listProducts}) 
});


export default router;
