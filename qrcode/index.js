var qrCodeURL = `http://${location.host}/pay/?receiver_id=${prompt("Enter the ID of the receiver")}&amount=${prompt("Enter the amount of money for the transaction")}`;

var qrcode = new QRCode(document.getElementById("qrcode"), qrCodeURL);

document.getElementById("link").setAttribute("href", qrCodeURL);
document.getElementById("link").innerText = qrCodeURL;