console.clear();

let id = location.search.split('?')[1];
console.log(id);

if (document.cookie.indexOf(',counter=') >= 0) {
    let counter = document.cookie.split(',')[1].split('=')[1];
    document.getElementById("badge").innerHTML = counter;
}

function dynamicContentDetails(ob) {
    let mainContainer = document.createElement('div');
    mainContainer.id = 'containerD';
    document.getElementById('containerProduct').appendChild(mainContainer);

    let imageSectionDiv = document.createElement('div');
    imageSectionDiv.id = 'imageSection';

    let imgTag = document.createElement('img');
    imgTag.id = 'imgDetails';
    imgTag.src = ob.preview;
    imgTag.style.width = "400px";
    imgTag.style.height = "400px";
    imgTag.style.objectFit = "cover";
    imgTag.style.borderRadius = "10px";
    imgTag.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
    imageSectionDiv.appendChild(imgTag);

    let productDetailsDiv = document.createElement('div');
    productDetailsDiv.id = 'productDetails';

    let h1 = document.createElement('h1');
    h1.textContent = ob.name;

    let h4 = document.createElement('h4');
    h4.textContent = ob.brand;

    let detailsDiv = document.createElement('div');
    detailsDiv.id = 'details';

    let h3DetailsDiv = document.createElement('h3');
    h3DetailsDiv.textContent = 'Rs ' + ob.price;

    let h3 = document.createElement('h3');
    h3.textContent = 'Description';

    let para = document.createElement('p');
    para.textContent = ob.description;

    let productPreviewDiv = document.createElement('div');
    productPreviewDiv.id = 'productPreview';

    let h3ProductPreviewDiv = document.createElement('h3');
    h3ProductPreviewDiv.textContent = 'Product Preview';
    productPreviewDiv.appendChild(h3ProductPreviewDiv);

    for (let i = 0; i < ob.photos.length; i++) {
        let imgTagProductPreviewDiv = document.createElement('img');
        imgTagProductPreviewDiv.classList.add('preview-img');
        imgTagProductPreviewDiv.src = ob.photos[i];
        imgTagProductPreviewDiv.onclick = function(event) {
            imgTag.src = ob.photos[i];
            document.getElementById("imgDetails").src = this.src;
        };
        productPreviewDiv.appendChild(imgTagProductPreviewDiv);
    }

    let buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';

    let buttonTag = document.createElement('button');
    buttonTag.textContent = 'Cart';
    buttonTag.onclick = function () {
        showPopup(ob);
    };
    buttonDiv.appendChild(buttonTag);

    mainContainer.appendChild(imageSectionDiv);
    mainContainer.appendChild(productDetailsDiv);
    productDetailsDiv.appendChild(h1);
    productDetailsDiv.appendChild(h4);
    productDetailsDiv.appendChild(detailsDiv);
    detailsDiv.appendChild(h3DetailsDiv);
    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(para);
    productDetailsDiv.appendChild(productPreviewDiv);
    productDetailsDiv.appendChild(buttonDiv);
    
    pushToDataLayer(ob);
}

function showPopup(ob) {
    let modalDiv = document.createElement('div');
    modalDiv.classList.add('modal');

    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    let closeButton = document.createElement('span');
    closeButton.classList.add('close-btn');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function () {
        modalDiv.remove();
    };

    let modalImg = document.createElement('img');
    modalImg.src = ob.preview;
    modalImg.classList.add('modal-img');

    let modalText = document.createElement('div');
    modalText.classList.add('modal-text');
    modalText.innerHTML = `<p><strong>Price:</strong> Rs ${ob.price}</p>`;

    let buyNowButton = document.createElement('button');
    buyNowButton.classList.add('modal-btn', 'buy-btn');
    buyNowButton.textContent = 'Buy Now';
    buyNowButton.onclick = function () {
        window.location.href = 'orderPlaced.html';
    };

    let cancelButton = document.createElement('button');
    cancelButton.classList.add('modal-btn', 'cancel-btn');
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = function () {
        modalDiv.remove();
    };

    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-buttons');
    buttonContainer.appendChild(buyNowButton);
    buttonContainer.appendChild(cancelButton);

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalImg);
    modalContent.appendChild(modalText);
    modalContent.appendChild(buttonContainer);
    modalDiv.appendChild(modalContent);

    document.body.appendChild(modalDiv);
}

function pushToDataLayer(ob) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'productDetailView',
        'ecommerce': {
            'currencyCode': 'INR',
            'detail': {
                'products': [{
                    'id': ob.id,
                    'name': ob.name,
                    'price': ob.price,
                    'brand': ob.brand,
                    'category': ob.category || '',
                    'variant': ob.variant || '',
                    'dimension1': ob.dimension1 || '',
                    'description': ob.description,
                    'url': window.location.href,
                    'image_url': ob.preview,
                    'sale_price': ob.sale_price || ob.price
                }]
            }
        }
    });
}

let productId = id;
fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/product/' + productId)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        dynamicContentDetails(data);
    })
    .catch((error) => {
        console.error('Error fetching product data:', error);
    });
