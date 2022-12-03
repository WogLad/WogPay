const socket = io(`http://${document.domain}:80`);

socket.emit("get-account-details", localStorage.getItem("wogpayUserID"));

socket.on("update-account-details", (accountDetails) => {
    document.getElementById("accountName").innerText = `Name: ${accountDetails.name}`;
    document.getElementById("accountBalance").innerText = `Balance: ${new Intl.NumberFormat('en-US',).format(accountDetails.balance)}`;
});