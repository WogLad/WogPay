const socket = io(`http://${document.domain}:80`);

const searchParams = new URLSearchParams(location.search);
socket.emit("validate-payment-details", {id: searchParams.get("receiver_id"), amount: searchParams.get("amount")});

socket.on("update-payment-details", (paymentDetails) => {
    document.getElementById("accountName").innerText = `Receiver's Name: ${paymentDetails.name}`;
    document.getElementById("accountID").innerText = `Receiver's ID: ${paymentDetails.id}`;
    document.getElementById("paymentAmount").innerText = `Amount: ${new Intl.NumberFormat('en-US',).format(paymentDetails.amount)}`;
});

socket.on("invalid-user", () => {
    alert("The user ID is invalid");
});

// TODO:
function makePayment() {

}