//invocamos la controlador
const UsersController = require('../controllers/usersController');

module.exports = (app,upload)=>{

    //RUTA PARA TRAER DATOS
    app.get('/api/users/getAll', UsersController.getAll);

    //RUTA PRA TRAER DATOS ACTUALIZADOS
    app.get('/api/users/findById/:id', UsersController.findById);

    
    //RUTA PARA GUARDAR DATOS
    // app.post('/api/users/create',UsersController.register);
    app.post('/api/users/create',upload.array('image',1), UsersController.registerWithImage);
    
    //login
    app.post('/api/users/login',UsersController.login);
    
    //RUTA para actualizar
    app.put('/api/users/update',upload.array('image',1), UsersController.update);
}