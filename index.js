const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api/usuarios",require('./router/router'));
app.use("/api/tienda",require('./router/tienda_router'));
app.use("/api/producto",require('./router/producto_router'));


app.use('/api/usuarios2', require('./router/FirebaseUsuarioRouter'));
app.use('/api/tienda2', require('./router/FirebaseTiendaRouter'));
app.use('/api/producto2', require('./router/FirebaseProductoRouter'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
