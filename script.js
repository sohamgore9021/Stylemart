// ================= ADD TO CART =================
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
}


// ================= LOAD CART =================
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

        if (!item.quantity) item.quantity = 1;

        let price = Number(item.price);
        let quantity = Number(item.quantity);

        total += price * quantity;

        let div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <div class="cart-left">
                <h3>${item.name}</h3>
                <p>₹${price} × ${quantity}</p>
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
        placeOrder();
    };

    container.appendChild(orderBtn);
}


// ================= REMOVE ITEM =================
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}


// ================= LOGIN =================
function loginUser() {
    let name = document.getElementById("name").value;
    let mobile = document.getElementById("mobile").value;
    let email = document.getElementById("email").value;
    let address = document.getElementById("address").value;

    if (!name || !mobile || !email || !address) {
        alert("Please fill all fields");
        return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
        alert("Mobile number must be 10 digits");
        return;
    }

    if (!email.includes("@")) {
        alert("Email must contain @");
        return;
    }

    let user = { name, mobile, email, address };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Login Successful!");
    window.location.href = "products.html";
}


// ================= CHECK LOGIN =================
function checkLogin() {
    let user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        let container = document.getElementById("cart-items");

        if (container) {
            container.innerHTML = `
                <div style="text-align:center; margin-top:50px;">
                    <h2>Please login first</h2>
                    <button onclick="goToLogin()">Go to Login</button>
                </div>
            `;
        }
        return false;
    }
    return true;
}


// ================= NAVIGATION =================
function goToLogin() {
    window.location.href = "login.html";
}

function showUserName() {
    let user = JSON.parse(localStorage.getItem("user"));
    let nameBox = document.getElementById("user-name");

    if (user && nameBox) {
        nameBox.innerHTML = "Hello, " + user.name;
    }
}


// ================= PLACE ORDER =================
function placeOrder() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let user = JSON.parse(localStorage.getItem("user"));
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let total = 0;

    cart.forEach(item => {
        if (!item.quantity) item.quantity = 1;
        total += item.price * item.quantity;
    });

    let orderData = {
        userName: user.name,
        items: cart,
        total: total,
        time: new Date().toLocaleString()
    };

    orders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(orders));

    showOrderSuccess();

    localStorage.removeItem("cart");
}


// ================= SUCCESS MESSAGE =================
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


// ================= ADMIN LOGIN =================
function adminLogin() {
    let user = document.getElementById("admin-user").value;
    let pass = document.getElementById("admin-pass").value;

    if (user === "admin" && pass === "1234") {
        window.location.href = "admin.html";
    } else {
        alert("Wrong credentials");
    }
}


// ================= LOAD ORDERS =================
function loadOrders() {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let container = document.getElementById("orders-container");

    if (!orders.length) {
        container.innerHTML = "<h2>No Orders Yet</h2>";
        return;
    }

    orders.forEach(order => {
        let div = document.createElement("div");
        div.classList.add("order-box");

        let itemsHTML = "";

        order.items.forEach(item => {
            itemsHTML += `<p>${item.name} × ${item.quantity}</p>`;
        });

        div.innerHTML = `
            <h3>User: ${order.userName}</h3>
            <p>${order.time}</p>
            ${itemsHTML}
            <h4>Total: ₹${order.total}</h4>
        `;

        container.appendChild(div);
    });
}


// ================= ADMIN PRODUCTS =================
function addProduct() {
    let name = document.getElementById("pname").value;
    let price = document.getElementById("pprice").value;
    let image = document.getElementById("pimage").value;

    if (!name || !price || !image) {
        alert("Fill all fields");
        return;
    }

    let products = JSON.parse(localStorage.getItem("products")) || [];

    products.push({
        name: name,
        price: Number(price),
        image: image
    });

    localStorage.setItem("products", JSON.stringify(products));

    alert("Product Added Successfully!");
}


function loadAdminProducts() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let container = document.querySelector(".products");

    products.forEach(product => {
        let div = document.createElement("div");
        div.classList.add("product-box");

        div.innerHTML = `
            <img src="${product.image}">
            <div class="product-info">
                <h2>${product.name}</h2>
                <p>₹${product.price}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            </div>
        `;

        container.appendChild(div);
    });
}
