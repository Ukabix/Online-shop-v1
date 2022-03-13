// get element
const deleteProductButtonElements = document.querySelectorAll('.product-item button');

// function
async function deleteProduct (event) {
  // find by dataset - data-productid in ejs
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productid; // data-productid!
  const csrfToken = buttonElement.dataset.csrf; // data-csrf
  // send req to backend via fetch - add domain later, data-csrf in ejs
  const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
    // configure delete request
    method: 'DELETE',
  });
  // handle bad response
  if (!response.ok) {
    alert('Something went wrong');
    return;
  }
  // remove element from DOM object via DOM traversal: btn->div->div-article->li
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();

}

// event listener
for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);

}