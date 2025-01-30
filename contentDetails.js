console.clear()

let id = location.search.split('?')[1]
console.log(id)

if (document.cookie.indexOf(',counter=') >= 0) {
    let counter = document.cookie.split(',')[1].split('=')[1]
    document.getElementById("badge").innerHTML = counter
}

function pushToDataLayer(product) {
    window.dataLayer = window.dataLayer || [];

    // Push product information into the dataLayer
    window.dataLayer.push({
        'event': 'productDetailView', // Custom event for GTM
        'ecommerce': {
            'currencyCode': 'INR', // Adjust the currency code if necessary
            'detail': {
                'products': [{
                    'id': product.id,
                    'name': product.name,
                    'price': product.price,
                    'brand': product.brand,
                    'category': product.category || '', // Optional: Add category if available
                    'variant': product.variant || '', // Optional: Add variant if available
                    'dimension1': product.dimension1 || '', // Optional: Taglines or custom dimension if available
                    'description': product.description,
                    'url': window.location.href, // Landing page URL
                    'image_url': product.preview, // Image URL
                    'sale_price': product.sale_price || product.price // Optional: Sale price, if available
                }]
            }
        }
    });
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

    imageSectionDiv.appendChild(imgTag);

    let productDetailsDiv = document.createElement('div');
    productDetailsDiv.id = 'productDetails';

    let h1 = document.createElement('h1');
    let h1Text = document.createTextNode(ob.name);
    h1.appendChild(h1Text);

    let h4 = document.createElement('h4');
    let h4Text = document.createTextNode(ob.brand);
    h4.appendChild(h4Text);

    let detailsDiv = document.createElement('div');
    detailsDiv.id = 'details';

    let h3DetailsDiv = document.createElement('h3');
    let h3DetailsText = document.createTextNode('Rs ' + ob.price);
    h3DetailsDiv.appendChild(h3DetailsText);

    let h3 = document.createElement('h3');
    let h3Text = document.createTextNode('Description');
    h3.appendChild(h3Text);

    let para = document.createElement('p');
    let paraText = document.createTextNode(ob.description);
    para.appendChild(paraText);

    let productPreviewDiv = document.createElement('div');
    productPreviewDiv.id = 'productPreview';

    let h3ProductPreviewDiv = document.createElement('h3');
    let h3ProductPreviewText = document.createTextNode('Product Preview');
    h3ProductPreviewDiv.appendChild(h3ProductPreviewText);
    productPreviewDiv.appendChild(h3ProductPreviewDiv);

    let i;
    for (i = 0; i < ob.photos.length; i++) {
        let imgTagProductPreviewDiv = document.createElement('img');
        imgTagProductPreviewDiv.id = 'previewImg';
        imgTagProductPreviewDiv.src = ob.photos[i];
        imgTagProductPreviewDiv.onclick = function (event) {
            console.log("clicked" + this.src);
            imgTag.src = ob.photos[i];
            document.getElementById("imgDetails").src = this.src;
        };
        productPreviewDiv.appendChild(imgTagProductPreviewDiv);
    }

    let buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';

    let buttonTag = document.createElement('button');
    buttonDiv.appendChild(buttonTag);

    buttonText = document.createTextNode('Add to Cart');
    buttonTag.onclick = function () {
        let order = id + " ";
        let counter = 1;
        if (document.cookie.indexOf(',counter=') >= 0) {
            order = id + " " + document.cookie.split(',')[0].split('=')[1];
            counter = Number(document.cookie.split(',')[1].split('=')[1]) + 1;
        }
        document.cookie = "orderId=" + order + ",counter=" + counter;
        document.getElementById("badge").innerHTML = counter;
        console.log(document.cookie);
    };
    buttonTag.appendChild(buttonText);

    // Call the function to push data to GTM when product details are loaded
    pushToDataLayer(ob);

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

    return mainContainer;
}

// BACKEND CALLING
let httpRequest = new XMLHttpRequest();
{
    httpRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status == 200) {
            console.log('connected!!');
            let contentDetails = JSON.parse(this.responseText)
            {
                console.log(contentDetails);
                dynamicContentDetails(contentDetails)
            }
        }
        else {
            console.log('not connected!');
        }
    }
}

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product/' + id, true)
httpRequest.send()
