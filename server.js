var sqlRequests = require("./sqlRequests.js");
var express = require("express");

var app = express();
app.use(express.static('./'));

var server = require("http").Server(app);

var io = require('socket.io')(server, {
	cors: {
		origin: '*',
	}
});

var port = 80;
server.listen(port);

app.get('/', (req, res) => { // DONE
    res.redirect("/account"); // DONE: Should be changed to redirect to "/account" by default. Make login, signup and login validation.
});
// DONE: Make the payment view where it shows you the receiver of the payment, the amount for the payment & the payer's account balance, along with a "PAY" button.
app.get('/pay', (req, res) => {
    res.sendFile(__dirname + "/pay/index.html");
});
app.get('/account', (req, res) => { // DONE
    res.sendFile(__dirname + "/account/index.html");
});

io.on('connection', socket => {
    socket.on("get-account-details", (id) => {
        sqlRequests.updateAccountDetails(id, (accountDetails) => {
            socket.emit("update-account-details", accountDetails);
        });
    });
    socket.on("validate-payment-details", (paymentDetails) => {
        sqlRequests.isValidUser(paymentDetails, (res) => {
            if (res.isValid == true) {
                socket.emit("update-payment-details", res.paymentDetails);
            }
            else {
                socket.emit("invalid-user");
            }
        });
    });
    socket.on("make-payment", (transactionDetails) => {
        sqlRequests.tryToMakePayment(transactionDetails, (isSuccess) => {
            if (isSuccess) {
                socket.emit("update-payment-status", "Payment was SUCCESSFUL");
            }
            else {
                socket.emit("update-payment-status", "Payment FAILED due to payer possessing INSUFFICIENT FUNDS");
            }
        });
    });
    socket.on("validate-login-details", (loginDetails) => {
        sqlRequests.validateLoginDetails(loginDetails, (isValid) => {
            socket.emit("login-validation-response", isValid);
        });
    });
    socket.on("create-new-user", (userLoginDetails) => {
        var id = sqlRequests.addNewUser(userLoginDetails.name, userLoginDetails.password);
        socket.emit("update-user-id", id);
    });
});

// DONE: Make the sql print the users from SQL.
// sqlRequests.logUsers();