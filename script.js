// =====================
// ADD TO CART
// =====================
function addToCart(name, price) {
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Please login first to add items to cart!");
        window.location.href = "login.html";
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: Number(price), quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
}


// =====================
// LOAD CART
// =====================
function loadCart() {
    if (!checkLogin()) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let container = document.getElementById("cart-items");
    container.innerHTML = "";

    // Show dispatch notifications for this user
    let user = JSON.parse(localStorage.getItem("user"));
    let notifications = JSON.parse(localStorage.getItem("userNotifications")) || [];
    notifications.filter(n => n.email === user.email && !n.seen).forEach(notif => {
        let banner = document.createElement("div");
        banner.className = "dispatch-banner";
        banner.innerHTML = `<div style="display:flex;align-items:flex-start;gap:15px;">
            <span style="font-size:34px;">🚚</span>
            <div style="flex:1;">
                <strong style="font-size:16px;display:block;margin-bottom:4px;">Your order has been dispatched!</strong>
                <p style="font-size:13px;margin-bottom:3px;">${notif.orderDetails}</p>
                <small style="font-size:12px;opacity:0.8;">Total: ₹${notif.total} &nbsp;|&nbsp; ${notif.dispatchedAt}</small>
            </div>
            <button onclick="dismissNotif(${notif.id},this)" style="background:rgba(255,255,255,0.25);border:none;color:white;border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:14px;flex-shrink:0;">✕</button>
        </div>`;
        container.appendChild(banner);
    });

    if (cart.length === 0) {
        container.innerHTML = "<h2 class='empty-cart'>Your cart is empty 🛒</h2>";
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
                <p>₹${price} × ${quantity} = ₹${price * quantity}</p>
            </div>
            <div class="cart-right">
                <button onclick="removeItem(${index})">Remove</button>
            </div>`;
        container.appendChild(div);
    });

    let totalBox = document.createElement("div");
    totalBox.classList.add("total-box");
    totalBox.innerHTML = `<h2>Total: ₹${total}</h2>`;
    container.appendChild(totalBox);

    let orderBtn = document.createElement("button");
    orderBtn.innerText = "Place Order";
    orderBtn.classList.add("order-btn");
    orderBtn.onclick = function () {
        placeOrder(cart, total);
    };
    container.appendChild(orderBtn);
}


// =====================
// PLACE ORDER & SAVE TO ADMIN
// =====================
function placeOrder(cart, total) {
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    let orders = JSON.parse(localStorage.getItem("allOrders")) || [];

    let orderDetails = cart.map(item => `${item.name} x${item.quantity}`).join(", ");

    let newOrder = {
        id: Date.now(),
        customer: user.name,
        mobile: user.mobile,
        email: user.email,
        address: user.address,
        orderDetails: orderDetails,
        total: total,
        date: new Date().toLocaleString(),
        status: "Pending"
    };

    orders.push(newOrder);
    localStorage.setItem("allOrders", JSON.stringify(orders));
    localStorage.removeItem("cart");

    showOrderSuccess();
}


// =====================
// REMOVE ITEM
// =====================
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}


// =====================
// REGISTER USER
// =====================
function registerUser() {
    let name = document.getElementById("reg-name").value.trim();
    let mobile = document.getElementById("reg-mobile").value.trim();
    let email = document.getElementById("reg-email").value.trim();
    let address = document.getElementById("reg-address").value.trim();
    let password = document.getElementById("reg-password").value.trim();

    if (!name || !mobile || !email || !address || !password) {
        alert("Please fill all fields");
        return;
    }
    if (mobile.length !== 10 || isNaN(mobile)) {
        alert("Mobile number must be exactly 10 digits");
        return;
    }
    if (!email.includes("@")) {
        alert("Enter a valid email address");
        return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    let exists = users.find(u => u.email === email);
    if (exists) {
        alert("This email is already registered. Please login.");
        return;
    }

    let newUser = { name, mobile, email, address, password };
    users.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    alert("Registration Successful! Please login now.");
    showLoginForm();
}


// =====================
// LOGIN USER
// =====================
function loginUser() {
    let email = document.getElementById("login-email").value.trim();
    let password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Invalid email or password. Please register first.");
        return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    alert("Login Successful! Welcome, " + user.name + "!");
    window.location.href = "products.html";
}


// =====================
// LOGOUT USER
// =====================
function logoutUser() {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    window.location.href = "login.html";
}


// =====================
// SHOW LOGIN / REGISTER FORM TOGGLE
// =====================
function showLoginForm() {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("register-section").style.display = "none";
}

function showRegisterForm() {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("register-section").style.display = "block";
}


// =====================
// CHECK LOGIN
// =====================
function checkLogin() {
    let user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        let container = document.getElementById("cart-items");
        if (container) {
            container.innerHTML = `
                <div style="text-align:center; margin-top:50px;">
                    <h2>Please login first</h2>
                    <button onclick="goToLogin()" style="padding:10px 20px; margin-top:20px; cursor:pointer;">
                        Go to Login
                    </button>
                </div>`;
        }
        return false;
    }
    return true;
}


// =====================
// SHOW USER NAME IN NAVBAR
// =====================
function showUserName() {
    let user = JSON.parse(localStorage.getItem("user"));
    let nameBox = document.getElementById("user-name");

    if (user && nameBox) {
        nameBox.innerHTML = `Hello, ${user.name} &nbsp; <a href="#" onclick="logoutUser()" style="font-size:14px; color:red;">Logout</a>`;
    }
}


// =====================
// GO TO LOGIN
// =====================
function goToLogin() {
    window.location.href = "login.html";
}


// =====================
// ORDER SUCCESS POPUP
// =====================
function showOrderSuccess() {
    let msg = document.createElement("div");
    msg.classList.add("order-message");
    msg.innerText = "🎉 Order Placed Successfully!";
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
        loadCart();
    }, 2500);
}


// =====================
// ADMIN LOGIN
// =====================
function loginAdmin() {
    let id = document.getElementById("adminId").value.trim();
    let pass = document.getElementById("adminPass").value.trim();

    if (id === "admin" && pass === "admin123") {
        document.getElementById("admin-login-box").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
        loadAdminOrders();
    } else {
        alert("Invalid Admin ID or Password!\nHint: ID = admin | Password = admin123");
    }
}


// =====================
// LOAD ADMIN ORDERS
// =====================
function loadAdminOrders() {
    let orders = JSON.parse(localStorage.getItem("allOrders")) || [];
    let tbody = document.getElementById("admin-orders-list");
    let totalRevenue = document.getElementById("total-revenue");
    tbody.innerHTML = "";

    if (orders.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align:center; padding:20px;'>No orders yet.</td></tr>";
        if (totalRevenue) totalRevenue.innerText = "Total Revenue: ₹0";
        return;
    }

    let revenue = 0;
    orders.forEach((order, index) => {
        revenue += order.total;
        let isDispatched = order.status === "Dispatched";
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${order.customer}</td>
            <td>${order.mobile}<br><small>${order.email}</small><br><small>${order.address}</small></td>
            <td>${order.orderDetails}</td>
            <td>₹${order.total}</td>
            <td><small>${order.date}</small></td>
            <td>${isDispatched
                ? `<span class="dispatched-badge">✅ Dispatched</span>`
                : `<button class="dispatch-btn" onclick="dispatchOrder(${order.id})">🚚 Dispatch</button>`
            }</td>`;
        tbody.appendChild(tr);
    });

    if (totalRevenue) totalRevenue.innerText = "Total Revenue: ₹" + revenue;
}


// =====================
// DISPATCH ORDER
// =====================
function dispatchOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem("allOrders")) || [];
    let order = orders.find(o => o.id === orderId);
    if (!order || order.status === "Dispatched") return;

    if (!confirm(`Dispatch order for ${order.customer}?\nItems: ${order.orderDetails}\nTotal: ₹${order.total}`)) return;

    order.status = "Dispatched";
    order.dispatchedAt = new Date().toLocaleString();
    localStorage.setItem("allOrders", JSON.stringify(orders));

    let notifications = JSON.parse(localStorage.getItem("userNotifications")) || [];
    notifications.push({
        id: orderId,
        email: order.email,
        customer: order.customer,
        orderDetails: order.orderDetails,
        total: order.total,
        dispatchedAt: order.dispatchedAt,
        seen: false
    });
    localStorage.setItem("userNotifications", JSON.stringify(notifications));

    let msg = document.createElement("div");
    msg.classList.add("order-message");
    msg.style.background = "#1a6fc4";
    msg.innerHTML = `🚚 Dispatched!<br><small style="font-size:14px;">Notification sent to ${order.customer}</small>`;
    document.body.appendChild(msg);
    setTimeout(() => { msg.remove(); loadAdminOrders(); }, 2500);
}


// =====================
// CLEAR ALL ORDERS (Admin)
// =====================
function clearAllOrders() {
    if (confirm("Are you sure you want to clear ALL orders?")) {
        localStorage.removeItem("allOrders");
        loadAdminOrders();
    }
}


// =====================
// DISMISS DISPATCH NOTIFICATION
// =====================
function dismissNotif(id, btn) {
    let notifications = JSON.parse(localStorage.getItem("userNotifications")) || [];
    let n = notifications.find(n => n.id === id);
    if (n) n.seen = true;
    localStorage.setItem("userNotifications", JSON.stringify(notifications));
    btn.closest(".dispatch-banner").remove();
}
function logoutAdmin() {
    document.getElementById("admin-dashboard").style.display = "none";
    document.getElementById("admin-login-box").style.display = "flex";
    document.getElementById("adminId").value = "";
    document.getElementById("adminPass").value = "";
}
