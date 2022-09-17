const { param } =  require('express/lib/request');
const mysql = require('mysql2/promise');
const config = require('./config');

async function query(sql,params){
    
    const connection = await mysql.createConnection(config.db);
    const [results,] = await connection.execute(sql,params);

    connection.end(function(err){
        console.log('clossing connection');
        if(err){
            return console.log('error ' + err.message);

        }
        console.log('database connection was succesfully closed');

    });

    connection.destroy();

    return results;


}

async function queryOnly (connection,sql,params){
    const [results,] = await connection.execute(sql,params);

    return results;
}

module.exports = {
    query,
    queryOnly
}