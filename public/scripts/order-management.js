// get form elements
const updateOrderFormElements = document.querySelectorAll(
  '.order-actions form'
);

// function
async function updateOrder(event) {
  // handle request manually
  event.preventDefault();
  // get form
  const form = event.target;

  // get form data
  const formData = new FormData(form);
  const newStatus = formData.get('status');
  const orderId = formData.get('orderid');
  const csrfToken = formData.get('_csrf');

  let response;
  // pass json
  try {
    response = await fetch(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        newStatus: newStatus,
        _csrf: csrfToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    alert('Something went wrong - could not update order status.');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong - could not update order status.');
    return;
  }
  // get response data
  const responseData = await response.json();

  // update form data element (status)
  form.parentElement.parentElement.querySelector('.badge').textContent =
    responseData.newStatus.toUpperCase();
}

// event listener to fire
for (const updateOrderFormElement of updateOrderFormElements) {
  updateOrderFormElement.addEventListener('submit', updateOrder);
}