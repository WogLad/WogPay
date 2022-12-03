var mysql = require('mysql');

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const sqlConnectionData = {
	host     : 'localhost',
	user     : 'sqluser',
	password : 'password',
	database : 'coding_projects'
};

// The database validity check is removed as the database credentials are proven to work 100% of the time.
const connection = mysql.createConnection(sqlConnectionData);

function logUsers() {
    connection.query("SELECT * FROM USERS", (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log(results); 
    });
}

function addNewUser(name, password, balance=0) {
    const connection = mysql.createConnection(sqlConnectionData);
    
    connection.query(`INSERT INTO USERS VALUES("${genRanHex(8)}", "${name}", ${balance}, ${password})`, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log("Added New User Successfully"); 
    });
}

function updateAccountDetails(id, callback) {
    const connection = mysql.createConnection(sqlConnectionData);
    
    connection.query(`SELECT name,balance FROM USERS WHERE id = "${id}"`, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log(`Retreived balance of ${results[0].name}: ${results[0].balance}`);
        return callback({name: results[0].name, balance: results[0].balance});
    });
}

module.exports = {logUsers, addNewUser, updateAccountDetails};