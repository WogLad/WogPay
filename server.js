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
    res.redirect("/pay"); // TODO: Should be changed to redirect to "/account" by default.
});
// TODO: Make the payment view where it shows you the receiver of the payment, the amount for the payment & the payer's account balance, along with a "PAY" button.
app.get('/pay/:receiver_id/:amount', (req, res) => {
    res.sendFile(__dirname + "/pay/index.html");
    console.log(`Receiver ID: ${req.params.receiver_id}, Amount: ${req.params.amount}`);
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
});

// DONE: Make the sql print the users from SQL.
// sqlRequests.logUsers();