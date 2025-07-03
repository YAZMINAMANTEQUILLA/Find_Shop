const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/usuarios",require('./router/router'));
app.use("/api/tienda",require('./router/tienda_router'));



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});