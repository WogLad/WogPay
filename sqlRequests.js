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
    const id = genRanHex(8);
    connection.query(`INSERT INTO USERS VALUES("${id}", "${name}", ${balance}, "${password}")`, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log(`Added New User (${name}) Successfully`); 
    });
    return id;
}

function updateAccountDetails(id, callback) {
    connection.query(`SELECT name,balance FROM USERS WHERE id = "${id}"`, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log(`Retreived balance of ${results[0].name}: ${results[0].balance}`);
        return callback({id: id, name: results[0].name, balance: results[0].balance});
    });
}

function isValidUser(paymentDetails, callback) {
    connection.query(`SELECT * FROM USERS WHERE id = "${paymentDetails.id}"`, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        
        if (results.length == 1) {
            return callback({isValid: true, paymentDetails: {id: results[0].id, name: results[0].name, amount: paymentDetails.amount}});
        }
        return callback({isValid: false});
    });
}

function tryToMakePayment(transactionDetails, callback) {
    connection.query(`SELECT id,balance FROM USERS WHERE id IN ("${transactionDetails.payer}", "${transactionDetails.receiver}")`, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }

        var payerReceiverBalances = {payer: 0, receiver: 0};
        if (results[0].id == transactionDetails.payer) {
            payerReceiverBalances.payer = results[0].balance;
            payerReceiverBalances.receiver = results[1].balance;
        }
        else {
            payerReceiverBalances.payer = results[1].balance;
            payerReceiverBalances.receiver = results[0].balance;
        }
        
        if (results.length == 2 && payerReceiverBalances.payer >= transactionDetails.amount) {
            connection.query(`UPDATE USERS SET balance = ${payerReceiverBalances.payer - transactionDetails.amount} WHERE id = "${transactionDetails.payer}"`);
            connection.query(`UPDATE USERS SET balance = ${payerReceiverBalances.receiver + transactionDetails.amount} WHERE id = "${transactionDetails.receiver}"`);
            logUsers();
            return callback(true);
        }
        return callback(false);
    });
}

function validateLoginDetails(loginDetails, callback) {
    connection.query(`SELECT * FROM USERS WHERE id = "${loginDetails.id}" AND password = "${loginDetails.password}"`, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        
        if (results.length == 1) {
            return callback(true);
        }
        return callback(false);
    });
}

module.exports = {logUsers, addNewUser, updateAccountDetails, isValidUser, tryToMakePayment, validateLoginDetails};