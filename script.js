/* ==========================================
   SARU_CRAFT_WORLD
   COMPLETE E-COMMERCE JAVASCRIPT
   2-STEP CHECKOUT + WHATSAPP ORDER SYSTEM
========================================== */


/* ================= PRODUCTS ================= */

const products = [

    {
        id: 1,
        name: "Yellow Baby Girl Dress",
        price: 1500,
        category: "dress",
        image: "picture/yellow-dress.jpg",
        rating: 5
    },

    {
        id: 2,
        name: "Tulip Headband",
        price: 299,
        category: "accessories",
        image: "picture/headband.jpg",
        rating: 5
    },

    {
        id: 3,
        name: "Crochet Hand Bag",
        price: 800,
        category: "bags",
        image: "picture/hand-bag.jpg",
        rating: 5
    },

    {
        id: 4,
        name: "Crochet Jellyfish",
        price: 100,
        category: "toys",
        image: "picture/jellyfish.jpg",
        rating: 5
    }

];


/* ================= STORAGE ================= */

let cart =
    JSON.parse(localStorage.getItem("saruCart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("saruWishlist")) || [];


/* ================= CHECKOUT CUSTOMER DATA ================= */

let checkoutCustomer = {
    name: "",
    phone: "",
    address: ""
};


/* ================= DOM ELEMENTS ================= */

const productsGrid =
    document.getElementById("productsGrid");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const wishlistCount =
    document.getElementById("wishlistCount");

const overlay =
    document.getElementById("overlay");

const wishlistModal =
    document.getElementById("wishlistModal");

const wishlistItems =
    document.getElementById("wishlistItems");

const checkoutModal =
    document.getElementById("checkoutModal");


/* ================= CHECKOUT ELEMENTS ================= */

const addressStep =
    document.getElementById("addressStep");

const paymentStep =
    document.getElementById("paymentStep");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const customerAddress =
    document.getElementById("customerAddress");

const confirmAddress =
    document.getElementById("confirmAddress");

const backAddress =
    document.getElementById("backAddress");

const placeOrderButton =
    document.getElementById("placeOrder");

const summaryName =
    document.getElementById("summaryName");

const summaryPhone =
    document.getElementById("summaryPhone");

const summaryAddress =
    document.getElementById("summaryAddress");

const summaryTotal =
    document.getElementById("summaryTotal");


/* =================================================
   SAVE DATA
================================================= */

function saveData() {

    localStorage.setItem(
        "saruCart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "saruWishlist",
        JSON.stringify(wishlist)
    );

}


/* =================================================
   DISPLAY PRODUCTS
================================================= */

function displayProducts(list = products) {

    productsGrid.innerHTML = "";


    if (list.length === 0) {

        productsGrid.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 50px;
                font-size: 18px;
            ">
                No products found 😢
            </div>
        `;

        return;
    }


    list.forEach(product => {

        const isLiked =
            wishlist.includes(product.id);


        const card =
            document.createElement("div");


        card.className =
            "product-card";


        card.innerHTML = `

            <button
                class="wishlist-heart ${isLiked ? "active" : ""}"
                onclick="toggleWishlist(${product.id})"
                aria-label="Add to wishlist"
            >
                ${isLiked ? "❤️" : "🤍"}
            </button>


            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
                onerror="
                    this.src='https://via.placeholder.com/400x400?text=Saru+Craft+World'
                "
            >


            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>


                <div class="rating">
                    ${"⭐".repeat(product.rating)}
                </div>


                <div class="product-price">
                    ₹${product.price.toLocaleString("en-IN")}
                </div>


                <button
                    class="add-cart"
                    onclick="addToCart(${product.id})"
                >
                    🛒 Add to Cart
                </button>

            </div>

        `;


        productsGrid.appendChild(card);

    });

}


/* =================================================
   ADD TO CART
================================================= */

function addToCart(id) {

    const product =
        products.find(
            product => product.id === id
        );


    if (!product) {

        alert("Product not found!");

        return;
    }


    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }


    saveData();

    updateCart();

    openCart();

}


/* =================================================
   UPDATE CART
================================================= */

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    let count = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty 🥺
            </p>
        `;

    }


    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );


        if (!product) return;


        const itemTotal =
            product.price * item.quantity;


        total += itemTotal;

        count += item.quantity;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >


                <div class="cart-item-info">

                    <h4>
                        ${product.name}
                    </h4>


                    <div class="cart-price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </div>


                    <div class="quantity">

                        <button
                            onclick="changeQuantity(${product.id}, -1)"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            onclick="changeQuantity(${product.id}, 1)"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="remove-item"
                    onclick="removeFromCart(${product.id})"
                    aria-label="Remove item"
                >
                    🗑️
                </button>

            </div>

        `;

    });


    cartTotal.textContent =
        `₹${total.toLocaleString("en-IN")}`;


    cartCount.textContent =
        count;

}


/* =================================================
   CHANGE QUANTITY
================================================= */

function changeQuantity(id, amount) {

    const item =
        cart.find(
            item => item.id === id
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );

    }


    saveData();

    updateCart();

}


/* =================================================
   REMOVE FROM CART
================================================= */

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    saveData();

    updateCart();

}


/* =================================================
   OPEN CART
================================================= */

function openCart() {

    cartSidebar.classList.add(
        "active"
    );

    overlay.classList.add(
        "active"
    );

}


/* =================================================
   CLOSE CART
================================================= */

function closeCart() {

    cartSidebar.classList.remove(
        "active"
    );

    overlay.classList.remove(
        "active"
    );

}


/* =================================================
   WISHLIST
================================================= */

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(
                item => item !== id
            );

    } else {

        wishlist.push(id);

    }


    saveData();

    updateWishlist();

    displayProducts();

}


/* =================================================
   UPDATE WISHLIST
================================================= */

function updateWishlist() {

    wishlistCount.textContent =
        wishlist.length;


    wishlistItems.innerHTML = "";


    if (wishlist.length === 0) {

        wishlistItems.innerHTML = `
            <p>
                Your wishlist is empty 💜
            </p>
        `;

        return;
    }


    wishlist.forEach(id => {

        const product =
            products.find(
                p => p.id === id
            );


        if (!product) return;


        wishlistItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >


                <div class="cart-item-info">

                    <h4>
                        ${product.name}
                    </h4>


                    <div class="cart-price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </div>


                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})"
                    >
                        🛒 Add to Cart
                    </button>

                </div>

            </div>

        `;

    });

}


/* =================================================
   SEARCH
================================================= */

const searchInput =
    document.getElementById(
        "searchInput"
    );


searchInput.addEventListener(
    "input",
    function () {

        const search =
            this.value
                .toLowerCase()
                .trim();


        const filtered =
            products.filter(
                product =>
                    product.name
                        .toLowerCase()
                        .includes(search)
            );


        displayProducts(filtered);

    }
);


/* =================================================
   CATEGORY
================================================= */

document
    .querySelectorAll(".category-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {


                document
                    .querySelectorAll(
                        ".category-btn"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                this.classList.add(
                    "active"
                );


                const category =
                    this.dataset.category;


                if (category === "all") {

                    displayProducts();

                } else {

                    const filtered =
                        products.filter(
                            product =>
                                product.category ===
                                category
                        );


                    displayProducts(
                        filtered
                    );

                }

            }
        );

    });


/* =================================================
   CHECKOUT BUTTON
================================================= */

document
    .getElementById("checkoutBtn")
    .addEventListener(
        "click",
        function () {


            if (cart.length === 0) {

                alert(
                    "Your cart is empty! 🛒"
                );

                return;
            }


            closeCart();


            /*
                Always start checkout
                from Step 1.
            */

            addressStep.classList.add(
                "active"
            );


            paymentStep.classList.remove(
                "active"
            );


            checkoutModal.classList.add(
                "active"
            );

        }
    );


/* =================================================
   STEP 1
   CONFIRM ADDRESS
================================================= */

confirmAddress.addEventListener(
    "click",
    function () {


        /* ================= NAME ================= */

        const name =
            customerName.value.trim();


        if (!name) {

            alert(
                "Please enter your name."
            );

            customerName.focus();

            return;
        }


        /* ================= PHONE ================= */

        const phone =
            customerPhone.value.trim();


        /*
            Indian 10-digit mobile number.
            Starts with 6, 7, 8 or 9.
        */

        if (!/^[6-9][0-9]{9}$/.test(phone)) {

            alert(
                "Please enter a valid 10-digit phone number."
            );

            customerPhone.focus();

            return;
        }


        /* ================= ADDRESS ================= */

        const address =
            customerAddress.value.trim();


        if (!address) {

            alert(
                "Please enter your delivery address."
            );

            customerAddress.focus();

            return;
        }


        /* ================= SAVE CUSTOMER ================= */

        checkoutCustomer = {

            name: name,

            phone: phone,

            address: address

        };


        /* ================= SHOW SUMMARY ================= */

        summaryName.textContent =
            checkoutCustomer.name;


        summaryPhone.textContent =
            checkoutCustomer.phone;


        summaryAddress.textContent =
            checkoutCustomer.address;


        summaryTotal.textContent =
            `₹${getCartTotal().toLocaleString("en-IN")}`;


        /* ================= GO TO STEP 2 ================= */

        addressStep.classList.remove(
            "active"
        );


        paymentStep.classList.add(
            "active"
        );

    }
);


/* =================================================
   GET CART TOTAL
================================================= */

function getCartTotal() {

    let total = 0;


    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );


        if (!product) return;


        total +=
            product.price *
            item.quantity;

    });


    return total;

}


/* =================================================
   BACK TO ADDRESS
================================================= */

backAddress.addEventListener(
    "click",
    function () {

        paymentStep.classList.remove(
            "active"
        );


        addressStep.classList.add(
            "active"
        );

    }
);


/* =================================================
   PLACE ORDER
   WHATSAPP
================================================= */

placeOrderButton.addEventListener(
    "click",
    function () {


        /* ================= CART CHECK ================= */

        if (cart.length === 0) {

            alert(
                "Your cart is empty! 🛒"
            );

            return;
        }


        /* ================= PAYMENT ================= */

        const selectedPayment =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        if (!selectedPayment) {

            alert(
                "Please select a payment method."
            );

            return;
        }


        const payment =
            selectedPayment.value;


        /* ================= WHATSAPP NUMBER ================= */

        const whatsappNumber =
            "917025337305";


        /*
            91 = India country code
            7025337305 = your WhatsApp number
        */


        /* ================= ORDER ID ================= */

        const orderNumber =
            "SCW" +
            Date.now()
                .toString()
                .slice(-6);


        /* ================= TOTAL ================= */

        let total = 0;


        /* ================= MESSAGE ================= */

        let message =
            "🧶 SARU_CRAFT_WORLD - NEW ORDER ❤️\n\n";


        message +=
            "🆔 Order ID: " +
            orderNumber +
            "\n\n";


        /* ================= CUSTOMER ================= */

        message +=
            "👤 Customer: " +
            checkoutCustomer.name +
            "\n";


        message +=
            "📱 Phone: " +
            checkoutCustomer.phone +
            "\n";


        message +=
            "📍 Address: " +
            checkoutCustomer.address +
            "\n\n";


        /* ================= ORDER DETAILS ================= */

        message +=
            "🛍️ ORDER DETAILS\n";


        message +=
            "--------------------------\n";


        cart.forEach(item => {

            const product =
                products.find(
                    p => p.id === item.id
                );


            if (!product) return;


            const itemTotal =
                product.price *
                item.quantity;


            total +=
                itemTotal;


            message +=
                "• " +
                product.name +
                " × " +
                item.quantity +
                " = ₹" +
                itemTotal.toLocaleString(
                    "en-IN"
                ) +
                "\n";

        });


        /* ================= TOTAL ================= */

        message +=
            "--------------------------\n";


        message +=
            "💰 TOTAL: ₹" +
            total.toLocaleString(
                "en-IN"
            ) +
            "\n";


        /* ================= PAYMENT ================= */

        let paymentText;


        if (payment === "cod") {

            paymentText =
                "Cash on Delivery";

        } else {

            paymentText =
                "UPI";

        }


        message +=
            "💳 Payment: " +
            paymentText +
            "\n\n";


        /* ================= FINAL MESSAGE ================= */

        message +=
            "Thank you for ordering from " +
            "Saru_Craft_World! 💜";


        /* ================= WHATSAPP URL ================= */

        const whatsappURL =
            "https://api.whatsapp.com/send?phone=" +
            whatsappNumber +
            "&text=" +
            encodeURIComponent(
                message
            );


        /* ================= OPEN WHATSAPP ================= */

        window.open(
            whatsappURL,
            "_blank"
        );


        /*
            Cart is intentionally NOT cleared.

            This allows the customer to return
            to the website after WhatsApp opens.
        */

    }
);


/* =================================================
   CART BUTTON
================================================= */

document
    .getElementById("cartBtn")
    .addEventListener(
        "click",
        openCart
    );


/* =================================================
   CLOSE CART
================================================= */

document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        closeCart
    );


/* =================================================
   OVERLAY
================================================= */

overlay.addEventListener(
    "click",
    closeCart
);


/* =================================================
   WISHLIST BUTTON
================================================= */

document
    .getElementById("wishlistBtn")
    .addEventListener(
        "click",
        function () {

            updateWishlist();


            wishlistModal.classList.add(
                "active"
            );

        }
    );


/* =================================================
   CLOSE WISHLIST
================================================= */

document
    .getElementById("closeWishlist")
    .addEventListener(
        "click",
        function () {

            wishlistModal.classList.remove(
                "active"
            );

        }
    );


/* =================================================
   CLOSE CHECKOUT
================================================= */

document
    .getElementById("closeCheckout")
    .addEventListener(
        "click",
        function () {

            checkoutModal.classList.remove(
                "active"
            );

        }
    );


/* =================================================
   MOBILE MENU
================================================= */

document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("navbar")
                .classList.toggle(
                    "active"
                );

        }
    );


/* =================================================
   DARK MODE
================================================= */

const darkModeBtn =
    document.getElementById(
        "darkModeBtn"
    );


darkModeBtn.addEventListener(
    "click",
    function () {


        document
            .body
            .classList
            .toggle("dark");


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            this.textContent =
                "☀️";


            localStorage.setItem(
                "saruDarkMode",
                "true"
            );

        } else {

            this.textContent =
                "🌙";


            localStorage.setItem(
                "saruDarkMode",
                "false"
            );

        }

    }
);


/* =================================================
   LOAD DARK MODE
================================================= */

const savedDarkMode =
    localStorage.getItem(
        "saruDarkMode"
    );


if (savedDarkMode === "true") {

    document
        .body
        .classList
        .add("dark");


    darkModeBtn.textContent =
        "☀️";

}


/* =================================================
   INITIAL LOAD
================================================= */

displayProducts();

updateCart();

updateWishlist();
