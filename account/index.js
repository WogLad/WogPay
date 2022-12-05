const socket = io(`http://${document.domain}:80`);

var userID;
var password;
if (localStorage.getItem("wogpayUserID") == null) {
    userID = prompt("Enter your User ID");
    password = prompt("Enter your password");
    if (userID == null || password == null ) { location.reload(); }
    socket.emit("validate-login-details", {id: userID, password: sha256(password)});
}
else {
    socket.emit("get-account-details", localStorage.getItem("wogpayUserID"));
}

socket.on("login-validation-response", (isValid) => {
    if (isValid) {
        localStorage.setItem("wogpayUserID", userID);
        localStorage.setItem("wogpayPassword", password);
        location.reload();
    }
    else {
        alert("The login details are INCORRECT");
        if (confirm("Do you want to sign up with the same details?") == true) {
            socket.emit("create-new-user", {name: prompt("Enter a name for your account"), password: sha256(password)});
            localStorage.setItem("wogpayPassword", password);
            password = null;
        }
    }
});

socket.on("update-user-id", id => {
    localStorage.setItem("wogpayUserID", id);
    location.reload();
});

socket.on("update-account-details", (accountDetails) => {
    document.getElementById("accountName").innerText = `Name: ${accountDetails.name}`;
    document.getElementById("accountID").innerText = `ID: ${accountDetails.id}`;
    document.getElementById("accountBalance").innerText = `Balance: ${new Intl.NumberFormat('en-US',).format(accountDetails.balance)}`;
});