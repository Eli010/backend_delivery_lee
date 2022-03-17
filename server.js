const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const storage = require('./utils/cloud_storage');

/*
    INICIALIZAMOS FIREBASE ADMIN
*/

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//para subir el archivo a firebase
const upload = multer({
    storage: multer.memoryStorage()
})

/*
*AQUI INSTANCIAMOS LAS RUTAS
*/
const users = require('./routes/usersRoutes');

const port = process.env.PORT || 3000;

//para identificar posibles errores
app.use(logger('dev'));
//parseamos nuestro codigo en formato json
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
//agreamos codigo para la seguridad
app.disabled('x-powered-by');

app.set('port', port);

/*
*LLAMAMOS LAS RUTAS
*/
users(app,upload);

server.listen(3000,'192.168.1.35' || 'localhost',function(){
    console.log('Aplicacion en nodejs '+ port + ' inicido....')
});


app.get('/',(req,res)=>{
    res.send('Ruta Raiz del backend');
});

app.get('/test',(req,res)=>{
    res.send('ruta de pruebaaaa');
});

app.use((err,req,res,next)=>{
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app:app,
    server:server
}





/* base del backend primer paso:
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const port = process.env.PORT || 3000;

app.set('port', port);

server.listen(3000,'192.168.1.34' || 'localhost',function(){
    console.log('Aplicacion en nodejs '+ port + ' inicido....')
});*/