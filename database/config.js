const mongoose = require('mongoose');
require('dotenv').config();

class Database{

    constructor(){
       
        this.conexion();
    }

    conexion(){
        mongoose.connect(process.env.DB_URI)
        .then((e)=>console.log('Database connection successful'))
        .catch(error=>console.log('Database connection error',error))
    }
}


module.exports = {
   Database
}

