const promise = require('bluebird');
const options = {
    promiseLib:promise,
    query:(e)=>{}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114,function(stringValue){
    return stringValue;
});

const databaseConfig = {
    //mapa de valores
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'delivery_db',
    'user': 'postgres',
    'password': 'eliaso123'
};

const db = pgp(databaseConfig);
module.exports = db;