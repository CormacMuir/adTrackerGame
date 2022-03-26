const mysqli = require('mysqli');
const conn = new mysqli({
    //MySQL db connection details
    host: 'xx',
    post: 'xx',
    user: 'xx',
    password: 'xx',
    database: 'xx'
});
let db = conn.emit(false, '');

module.exports = {
    database: db
}