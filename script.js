// ADD TO CART
function addToCart(name, price) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
        name: name,
        price: price
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart!");
}


// LOAD CART
function loadCart() {
    if (!checkLogin()) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let container = document.getElementById("cart-items");

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<h2 class='empty-cart'>Your cart is empty</h2>";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        let div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <div class="cart-left">
                <h3>${item.name}</h3>
                <p>₹${item.price} × ${item.quantity}</p>
            </div>

            <div class="cart-right">
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;

        container.appendChild(div);
    });

    let totalBox = document.createElement("div");
    totalBox.classList.add("total-box");
    totalBox.innerHTML = `<h2>Total: ₹${total}</h2>`;
    container.appendChild(totalBox);

    // PLACE ORDER BUTTON
    let orderBtn = document.createElement("button");
    orderBtn.innerText = "Place Order";
    orderBtn.classList.add("order-btn");

    orderBtn.onclick = function() {
        showOrderSuccess();
        localStorage.removeItem("cart");
    };

    container.appendChild(orderBtn);
}


// REMOVE ITEM
function removeItem(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


// LOGIN USER
function loginUser() {
    let name = document.getElementById("name").value;
    let mobile = document.getElementById("mobile").value;
    let email = document.getElementById("email").value;
    let address = document.getElementById("address").value;

    // CHECK EMPTY
    if (!name || !mobile || !email || !address) {
        alert("Please fill all fields");
        return;
    }

    // MOBILE VALIDATION (10 digits only)
    if (mobile.length !== 10 || isNaN(mobile)) {
        alert("Mobile number must be exactly 10 digits");
        return;
    }

    // EMAIL VALIDATION (@ symbol)
    if (!email.includes("@")) {
        alert("Email must contain @ symbol");
        return;
    }

    let user = {
        name: name,
        mobile: mobile,
        email: email,
        address: address
    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Login Successful!");
    window.location.href = "products.html";
}


// CHECK LOGIN
function checkLogin() {

    let user = JSON.parse(localStorage.getItem("user"));

    if (!user) {

        let container = document.getElementById("cart-items");

        if (container) {
            container.innerHTML = `
                <div style="text-align:center; margin-top:50px;">
                    <h2>Please login first</h2>
                    <button onclick="goToLogin()" style="padding:10px 20px; margin-top:20px;">
                        Go to Login
                    </button>
                </div>
            `;
        }

        return false;
    }

    return true;
}


// GO TO LOGIN
function goToLogin() {
    window.location.href = "login.html";
}


// SHOW USER NAME
function showUserName() {

    let user = JSON.parse(localStorage.getItem("user"));

    let nameBox = document.getElementById("user-name");

    if (user && nameBox) {
        nameBox.innerHTML = "Hello, " + user.name;
    }
}

function showOrderSuccess() {
    let msg = document.createElement("div");
    msg.classList.add("order-message");
    msg.innerText = "Order Placed Successfully!";

    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
        loadCart();
    }, 2000);
}