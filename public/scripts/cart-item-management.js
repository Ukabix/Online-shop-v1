//// managing products from cart view

// get elements - multiple elements
const cartItemUpdateFormElements =
  document.querySelectorAll(
    '.cart-item-management'
  );
// elements to update in updateCartItem
const cartTotalPriceElement =
  document.getElementById('cart-total-price'); // get by id
const cartBadgeElements = document.querySelectorAll(
  '.nav-items .badge'
); // query selector

/// functions to fire
// update cart item - turn off form submission
async function updateCartItem(event) {
  event.preventDefault();
  // get form, csrf product id and quantity
  const form = event.target;
  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value; // dom traversal - target input value

  // send ajax req
  let response;
  try {
    response = await fetch('/cart/items', {
      // set method
      method: 'PATCH',
      // parse body - needs to match controller data
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    alert('Something went wrong');
    return;
  }
  if (!response.ok) {
    alert('Something went wrong');
    return;
  }
  // no errors, get response
  const responseData = await response.json();
  console.log(responseData);
  // remove card if quantity = price = 0
  if (
    responseData.updatedCartData
      .updatedItemPrice === 0
  ) {
    form.parentElement.parentElement.remove(); // taget li
  } else {
    // access price element to update - specific selector
    const cartItemTotalPriceElement =
      form.parentElement.querySelector(
        '.cart-item-price'
      ); // dom traversal
    // update price
    cartItemTotalPriceElement.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(
        2
      );
    // update total price - general selector
    cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);
    for (const cartBadgeElement of cartBadgeElements) {
      // update badge - general selector
      cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
    }

  }
}

// event listeners
// loop through form elements to add event listeners
for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener(
    'submit',
    updateCartItem
  );
}
