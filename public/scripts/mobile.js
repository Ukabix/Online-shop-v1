//// browser side
// access elements to manipulate
const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');
// function to toggle menu
function toggleMobileMenu() {
  mobileMenuElement.classList.toggle('open');
}
// set eventlistener
mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);