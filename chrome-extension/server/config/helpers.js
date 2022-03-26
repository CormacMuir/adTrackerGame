const mysqli = require('mysqli');
const conn = new mysqli({
    //MySQL db connection details

    host: 'us-cdbr-east-05.cleardb.net',
    post: '3386',
    user: 'b03851587ae154',
    password: '5cb8ad8a',
    database: 'heroku_6e85a026a1900c7'
});
let db = conn.emit(false, '');

module.exports = {
    database: db
}