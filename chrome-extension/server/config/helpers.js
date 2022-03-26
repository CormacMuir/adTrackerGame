const mysqli = require('mysqli');
const conn = new mysqli({
    //MySQL db connection details

    host: 'X',
    post: 'X',
    user: 'X',
    password: 'X',
    database: 'X'
});
let db = conn.emit(false, '');

module.exports = {
    database: db
}