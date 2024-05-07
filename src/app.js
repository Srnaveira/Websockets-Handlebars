import viewRoutes from './routes/view.routes.js';
import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import ProductManager from './controles/productManager.js';

const pManager = new ProductManager();

const PORT = 8080;

const app = express()

const httpServer = app.listen(PORT, () => {
        console.log(`Listening on PORT: ${PORT}`)
});

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));
app.use('/', viewRoutes)

const socketServer = new Server(httpServer);


socketServer.on('connection', socket =>{
        console.log("Nuevo cliente conectado");

        socket.on('message', data =>{
                console.log(data);
        })
        
        
        pManager.loadProducts()
        .then((products) =>{
                socket.emit('listProducts', products)
        })       
        
        socket.broadcast.emit('message_user_conect', "Ha Ingresado un nuevo USUARIO")
        socketServer.emit('event_for_all', "Este evento lo veran todos los usuarios")

        
        socket.on('productAdd', async (product) =>{
                try {
                       const addIsValid = await pManager.addProduct(product)
                       if(addIsValid){
                                await pManager.loadProducts()
                                .then((products) =>{
                                        socket.emit('listProducts', products);
                                        socket.emit('message_add', "Producto Agregado")
                                })      
                        }
                } catch (error) {
                        socket.emit('message_add', "Error al agregar el producto: " + error.message)
                }
        
        })
        


        socket.on('productDelete',  async (pid) =>{
                try {
                        const Productexist = await pManager.getProductById(pid)
        
                        if(Productexist){
                                await pManager.deleteProduct(pid)
                                await pManager.loadProducts()
                                .then((products) =>{
                                        socket.emit('listProducts', products);
                                        socket.emit('message_delete', "Producto Eliminado")
                              })  
                        }
                } catch (error) {
                        socket.emit('message_delete', "Error al Eliminar el producto: " + error.message)
        
                }



        })

})

