const productos = [];
async function fetchProducts() {
    try {
        const response = await fetch('/api/productos');
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }
        const data = await response.json();
        productos.push(...data);
        renderProducts(productos); 
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderProducts(products) {
    const productosContainer = document.querySelector('.row'); 
    productosContainer.innerHTML = ''; 

    products.forEach(producto => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="producto card h-100">
                    <img src="${producto.image}" alt="${producto.nombre}" class="card-img-top" />
                    <div class="card-body">
                        <h2 class="card-title">${producto.title}</h2>
                        <h3 class="card-subtitle mb-2 text-muted">${producto.category}</h3>
                        <p class="card-text">${producto.description}</p>
                        <p class="precio font-weight-bold text-success">Precio: ${producto.price} €</p>
                    </div>
                </div>
            </div>
        `;
        productosContainer.insertAdjacentHTML('beforeend', productCard); 
    });
}

function searchProducts() {
    const input = document.getElementById('seacherInput').value.toLowerCase();
    const filteredProducts = productos.filter(producto =>
        producto.title.toLowerCase().includes(input)
    );
    renderProducts(filteredProducts); 
}

function filterByCategory() {
    const categoria = document.getElementById('categorias').value;
    if (categoria) {
        window.location.href = `/portada/${categoria}`; 
    } else {
        window.location.href = '/portada'; 
    }
}

window.onload = () => {
    //todo look at code on the master branch
    //document.querySelector('.btn-success').addEventListener('click', searchProducts);
    document.getElementById('categorias').addEventListener('change', filterByCategory);
};
