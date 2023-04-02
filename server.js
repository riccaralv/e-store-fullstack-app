import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productsRoute from './routes/productsRoute.js';
import usersRoute from './routes/usersRoute.js';
import ordersRoute from './routes/ordersRoute.js';
import fileUpload from 'express-fileupload'; // npm i express-fileupload
import ImagesCollection from './models/imageSchema.js';
import stream from 'stream';
// import cors from 'cors'; --> lo comento una vez que estoy trabajando en el 'production code'
dotenv.config();
import Stripe from 'stripe'; // 'npm i stripe'
export const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE EXPRESS SERVER
const app = express();

// PORT SETTING
const PORT = process.env.PORT || 4000; // el primero sería para la production

// MONGOOSE CONNECTION
mongoose
  .connect(process.env.URI)
  .then(() => console.log('Connection to DB established!'))
  .catch((err) => console.log(err.message));
// '.connect' es una promise, por eso añadimos then (la conexión se produce correctamente) y catch (hay algún error)

// HANDLING CORS
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  next();
});

// con cualquier request ejecutamos esta función => vamos a adjuntar un header ('Access-Control-Allow-Origin') en todas las respuestas que enviemos y el segundo argumento indica a quién se le permite (en nuestro caso al servidor frontend)
*/

// COMENTAMOS LO SIGUIENTE --> esto lo hago una vez estoy trabajando en el 'production code'
// app.use(cors({ origin: 'http://localhost:5173', exposedHeaders: ['token'] }));
// al principio no lo añadimos, pero después hemos escritot "exposedHeaders:['token']" para que los tokens que enviamos desde el backend puedan verse en el browser

// EXTERNAL MIDDLEWARES
app.use(express.json()); // parsing json data (para cualquier json data que reciba desde una request)
app.use(express.urlencoded({ extended: true })); // form www-form-urlencoded data (true es por si hay nested datas)
app.use(fileUpload()); // handling or parsing form data --> usamos multer or express-fileupload

// EXPRESS.STATIC MIDDLEWARE --> it server static files --> lo hago para que me cargue todos los archivos JS en el 'production code'
app.use(express.static('views/dist'));

// ROUTES
// CREATE INDEX ROUTE --> esto lo hago una vez estoy trabajando en el 'production code'
app.get('/', (req, res) => {
  res.sendFile('./views/dist/index.html', { root: '.' });
});

app.use('/products', productsRoute); // cuando usamos 'app.use()' es porque nos referimos a cualquier request. En este caso se refiere a cualquier request (get, post, etc.) que llegue al endpoint '/products'

app.use('/users', usersRoute);

app.use('/orders', ordersRoute);

app.get('/images/:filename', async (req, res) => {
  const image = await ImagesCollection.findOne({
    filename: req.params.filename,
  });
  // creamos una read stream
  const readStream = stream.Readable.from(image.data); // para
  // con el método pipe() relacionamos el stream con nuestra respuesta (res), que le mandamos al cliente
  readStream.pipe(res);
});

//
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
