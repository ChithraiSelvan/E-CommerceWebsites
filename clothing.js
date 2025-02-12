document.addEventListener("DOMContentLoaded", function () {
    fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/product')
        .then(response => response.json())
        .then(products => {
            let accessoriesContainer = document.getElementById("Product-container");

            let accessories = products.filter(product => product.isAccessory); // Filtering accessories

            accessories.forEach(product => {
                let productCard = document.createElement("div");
                productCard.classList.add("product-card");

                productCard.innerHTML = `
                    <img src="${product.preview}" alt="${product.name}" class="product-image">
                    <h3>${product.name}</h3>
                    <p>${product.brand}</p>
                    <p>Rs. ${product.price}</p>
                    <button class="add-to-cart" onclick="addToCart('${product.id}')">Add to Cart</button>
                `;

                accessoriesContainer.appendChild(productCard);
            });
        })
        .catch(error => console.error("Error fetching accessories:", error));
});

function addToCart(productId) {
    alert("Product " + productId + " added to cart!");
}
