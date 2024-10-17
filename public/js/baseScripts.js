function filterByCategory() {

}

function searchProducts() {
    const input = document.getElementById('seacherInput').value.toLowerCase();
    window.location.href = `/productos?search=${encodeURIComponent(input)}`;
}


function redirectToCategory() {
    const selectedCategory = document.getElementById('categorias').value;
    if (selectedCategory) {
      window.location.href = `/categorias/${selectedCategory}`;
    }
}

function redirectToMyCart() {
  window.location.href = '/carrito';
}


