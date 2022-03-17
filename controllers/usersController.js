//invocamos a nuestro modelos
const User = require('../models/user');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');
const { findById } = require('../models/user');

module.exports = {
    async getAll(req,res,next){
        try {
            const data = await User.getAll();
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Error al obtener los usuarios'
            })
        }
    },

    async findById(req,res,next){
        try {
            const id = req.params.id;
            const data = await User.findByUserId(id);
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Error al obtener el suario Actualizadoo'
            })
        }
    },

    //nos creamos un nuevo metodo asyncrono para realizar el registro

    async register(req,res,next){
        try {
            const user = req.body;
            const data = await User.create(user);

            await Rol.create(data.id,1);//Rol por defecto

            return res.status(201).json({
                success:true,
                message:'El registro se realizo correctamente',
                data:data.id
            })
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Erro en el registro',
                error:error
            })
        }
    },


    async registerWithImage(req,res,next){
        try {
            const user = JSON.parse(req.body.user);
            console.log(`datos enviados del usuario: ${user}`);
            const files = req.files;

            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`;//aqui asignamos un nombre a la imagen
                const url = await storage(files[0],pathImage);
                if (url != undefined && url != null ) {
                    user.image = url;
                }
            }
            
            const data = await User.create(user);


            await Rol.create(data.id,1);//Rol por defecto

            return res.status(201).json({
                success:true,
                message:'El registro se realizo correctamente',
                data:data.id
            })
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Erro en el registro',
                error:error
            })
        }
    },

    async update(req,res,next){
        try {
            //aqui capturamos los datos del usuario
            const user = JSON.parse(req.body.user);
            console.log(`datos enviados del usuario: ${JSON.stringify(user)}`);
            //falicitamos un archivo
            const files = req.files;

            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`;//aqui asignamos un nombre a la imagen
                const url = await storage(files[0],pathImage);
                if (url != undefined && url != null ) {
                    user.image = url;
                }
            }
            
            await User.update(user);

            return res.status(201).json({
                success:true,
                message:'Los datos del usuario se actulizaron correctamente',
            })
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Hubo un error con la actualizacion de datos del usuario',
                error:error
            })
        }
    },


    //login
    async login(req,res,next){
        try {
            const email =req.body.email;
            const password = req.body.password;
            const myUser = await User.findByEmail(email);

            if (!myUser) {
                return res.status(401).json({
                    success:false,
                    message:'El correo no existe'
                })
            }
            if (User.isPasswordMatched(password,myUser.password)) {
                const token = jwt.sign({id:myUser.id,email:myUser.email},keys.secretOrKey,{
                    //expireIn:(60*60*24) //1 hora
                });
                const data ={
                    id:myUser.id,
                    name:myUser.name,
                    lastname:myUser.lastname,
                    email:myUser.email,
                    phone:myUser.phone,
                    image:myUser.image,
                    session_token:`JWT ${token}`,
                    roles:myUser.roles
                }
                await User.updateToken(myUser.id,`JWT ${token}`);
                
                console.log(`Usuario enviado: ${data}`);
                return res.status(201).json({
                    success:true,
                    data:data,
                    message:'el usuario a sido autenticado'
                });
            }else{
              return res.status(401).json({
                  success:false,
                  message:'la constraseña es incorrecta'
              });  
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success:false,
                message:'Error en el momento de iniciar sesión',
                error:error
            })
        }
    }
}