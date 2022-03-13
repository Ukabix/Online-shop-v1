//// add products from product-detail pages

//get elements
const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

// function
async function addToCart() {
  // get data
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;
  // 
  try {
    response = await fetch('/cart/items', {
      method: 'POST',
      // pass json
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken
      }),
      // add json headers
      headers: {
        'Content-Type': 'application/json'
      }
    });
  // no response
  } catch (error) {
    alert('Something went wrong!');
    return;
  }
  // bad response
  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }
  // response ok - pass to json
  const responseData = await response.json();
  // update total items value
  const newTotalQuantity = responseData.newTotalItems;
  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent = newTotalQuantity;
  }

}

// event listeners to fire
addToCartButtonElement.addEventListener('click', addToCart);