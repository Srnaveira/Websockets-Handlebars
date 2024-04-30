import viewRoutes from './routes/view.routes.js';
import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';

const PORT = 8080;
const app = express()

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));
app.use('/', viewRoutes)


app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
})



