function searchProducts() {
    const input = document.getElementById('seacherInput').value.toLowerCase();
    const productos = document.querySelectorAll('.producto');

    productos.forEach(producto => {
        const title = producto.querySelector('h2').innerText.toLowerCase();
        if (title.includes(input)) {
            producto.style.display = '';
        } else {
            producto.style.display = 'none';
        }
    });
}

function filterByCategory() {
    const selectedCategory = document.getElementById('categorias').value;
    const productos = document.querySelectorAll('.producto');

    productos.forEach(producto => {
        const category = producto.querySelector('h3').innerText; 
        if (category.includes(selectedCategory) || selectedCategory === "") {
            producto.style.display = ''; 
        } else {
            producto.style.display = 'none'; 
        }
    });
}

window.onload = () => {
};