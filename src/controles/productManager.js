import fs from 'fs/promises';
import { __dirname } from '../utils.js'

export default class ProductManager {
    constructor() {
        this.productsFileName = "productos.json";
        this.directoryPath = __dirname+"/";
    }

    async addProduct(product) {
        try {
            //Chequeo con la funcion que el producto tenga todo los campos
            if (!this.isValidProduct(product)) {
                console.error("Error: El formato de producto ingresado no es válido");
                throw new Error('Error: El producto no es válido');
            }
            //Envio el code del producto ingresado a la funcion para chequear si algun producto
            //tiene ese mismo code asignado
            if (await this.isCodeDuplicated(product.code)) {
                console.error("Error: El código del producto ya está en uso");
                throw new Error('Error: El código del producto ya está en uso');
            }
            //traigo el contenido del archivo json
            let fileContent = await this.loadProducts();
            //defino el campo id del producto y le asigno un valor unico
            const lastId = fileContent.length > 0 ? fileContent[fileContent.length - 1].id : 0;
            product.id = lastId + 1;
             if(product.status === undefined){
                    product.status = true;
             }

            //Agrego el producto ingresado al array de objetos 
            fileContent.push(product);
            //Escribo el prducto
            await fs.writeFile(`${this.directoryPath}${this.productsFileName}`, JSON.stringify(fileContent , null, 2));
            console.log("Se cargó correctamente el producto");
        } catch (error) {
            console.error("No se pudo agregar el producto", error);
            throw error;
        }
    
    }

    isValidProduct(product) {
        return (
            typeof product.title === 'string' &&
            typeof product.description === 'string' &&
            typeof product.code === 'string' &&
            typeof product.price === 'number' &&
            product.price > 0 &&
            (typeof product.status === 'boolean' ||
            product.status === undefined ) &&
            Number.isInteger(product.stock) &&
            product.stock >= 0 &&
            typeof product.category === 'string' &&
            (typeof product.thumbnail === 'string'||
            product.thumbnail === undefined)
        );
    }



    async isCodeDuplicated(code) {
        try {
            const fileContent = await this.loadProducts();
            // usa 'some' para verificar duplicados 
            return fileContent.some(p => p.code === code); 
        } catch (error) {
             return false;
        }
        
    }

    async loadProducts() {
        try {
            const products = await fs.readFile(`${this.directoryPath}${this.productsFileName}`, 'utf8');
            return JSON.parse(products);
        } catch (error) {
            await fs.writeFile(`${this.directoryPath}${this.productsFileName}`,JSON.stringify([], null, 2));
            const products = await fs.readFile(`${this.directoryPath}${this.productsFileName}`, 'utf8');
            return JSON.parse(products);
        }
        
    }

    async getProducts(){
            const products = await this.loadProducts();
            console.log(products);
    }

    async getProductById(id) {
        const fileContent = await this.loadProducts();
        const searching = fileContent.find(product => product.id === id);
        if(!searching){
            console.log(`El id ingresado: ${id} no corresponde a ningun id de productos`);
            return;
        }
        console.log(searching);
        return searching;
    }

    async updateProduct(id, infoUpdate){
        try {
            const products = await this.loadProducts();
            const productIndex = products.findIndex(element => element.id === id);
            if (productIndex === -1) {
                console.log(`No se encontró ningún producto con id ${id}.`);
                //return; <== se cambio el return por esta el throw new Error....
                throw new Error(`message: No se encontro ese producto`);
                
            }
            
            Object.assign(products[productIndex], infoUpdate);
            await fs.writeFile(`${this.directoryPath}${this.productsFileName}`, JSON.stringify(products, null, 2));
            console.log("Producto actualizado correctamente.");
        } catch (error) {
            console.error("No se pudo actualizar el producto:", error);
            //linea agregada para manejo de errores
            throw error;                
        }

    }

    async deleteProduct(id){
        try {
            const fileContent = await this.loadProducts();
            const  newArray= [];
            if(fileContent.find(p => p.id === id)) {
                fileContent.forEach(element => {
                    if(element.id ===id){

                    } else {
                        newArray.push(element);
                    }
                });
            } else {
                console.log(`El producto id ingresado: ${id} no existe`)
                throw new Error(`message: El producto id ingresado: ${id} no existe`);;
            }

        console.log(newArray);
        await fs.writeFile(`${this.directoryPath}${this.productsFileName}`, JSON.stringify( newArray , null, 2))
            
        } catch (error) {
            console.error("Dio este mensaje de error ", error);
            throw error;
        }
    }

}
