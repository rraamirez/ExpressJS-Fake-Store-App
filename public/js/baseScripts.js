//this was for searching products with and then use get request to get the products
function searchProducts() {
    const input = document.getElementById('seacherInput').value.toLowerCase();
    window.location.href = `/productos?search=${encodeURIComponent(input)}`;
}

//function that redirects to the selected category with get!
function redirectToCategory() {
    const selectedCategory = document.getElementById('categorias').value;
    if (selectedCategory) {
      window.location.href = `/categorias/${selectedCategory}`;
    }
}

//just redirects to the cart page
function redirectToMyCart() {
  window.location.href = '/carrito';
}

function ordersButtonDisabled(productos) {
  document.getElementById('orders').disabled = productos.length === 0; 
}

async function checkCarrito() {
  try {
    const response = await fetch('/api/carrito');
    if (!response.ok) throw new Error('Error fetching carrito');
    const productos = await response.json();
    ordersButtonDisabled(productos);
  } catch (error) {
    console.error(error);
  }
}

window.onload = function() {
  if (document.getElementById('orders')) {
    checkCarrito();
  }
}

