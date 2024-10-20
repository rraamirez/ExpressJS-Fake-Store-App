Practica 2 DAI -Raúl Ramírez Abril

Se ha creado una estructura de directorios acorde a lo pedido en los guiones 2.1 y 2.2 y se ha seguido al pie de la letra las instrucciones de realización.

Se destaca el archivo baseScripts.js y router_tienda.js  que contiene el código fuente de la api encargado de hacer las peticiones get y post y ordenar el renderizado de las páginas.

Páginas: Se ha hecho uso de la herencia que nos porporciona el motor de plantillas nunjucks, de forma que contamos con un archivo base.html que proporciona las cosas comines como los headers y footers.

Componentes principales de base.html:

Tenemos el header, el cual contiene el botón de logout, orders, el select de categorias y el buscador de procutos.

El buscador de productos es un formulario con el que mediante post se hace una consulta en la bd: Su funcionamiento es este: Se coge el valor de la petición mediante el uso del request body, y mediante una llamada asíncrona se hace una búsqueda usando como regex el valor de este, además se usa la opcion i para que sea insensible a mayusculas/minusculas. Una vez obtienen los productos coincidentes se renderiza la pagina productos la cual mostrará lod resultados:

En cuanto al select de categorías, este está hecho con ayuda de javascript. Funcionamiento, se pasan mediante un set en el base todas las categorías y usando onchange de html para los select, se llama a la función redirectToCategory del archivo baseScripts.js el cual redirige a la ruta categoriás con el parámetro de la categororía (funcion que hace esto implementada en router_tienda.js mediante uso de get)

Orders: Al principio se mostrará deshabilitado hasta que haya un procuto. Funciona de esta forma. Con una llamada a la api que devuelve los productos añadidos a la sesión en forma de json (en router_tienda.js) se introducen en un array y cogiendo el elemento por su id lo deshabilito en el window.onload en funcion de si el lenght de los productos en la sesión es 0 o no. 
Redirecciona a la pagina carrito la cual muestra los procutos añadidos, funciona con get y se trae todo lo que tengas guardado en la sesión


Páginas principales:

Portada: Esta está en la ruta "/" y proporciona un contenedor con todas las categorías obtenidas de la bd, con un botón por cada una el cual nos redirige mediante get a la página categoría, la cual es la encargada de mostrar los productos de una categoría concreta. 

Productos: Una vez redirigidos por la el boton de la pagina principal, se renderiza un contenedor con los productos que hay en cada categoría, esto se hace mediante la llamada get de : router.get("/categorias/:categoria"... Y se usan como parámetro la categoría seleccionada para traerse de la bd sólo los productos de la categoría seleccionada.

Si se observa tanto una página de productos, como un filtro del select asi como una búsqueda en el buscador, los productos se muestran uno por uno con dos botones: view details y add to cart:

View details: Renderiza una página con el producto concreto seleccionado, muestra todos los detalles ademas de que tiene otro boton para añadir al carrito (mostrado mas adelante). Se hace mediante get y usando el id de este para buscarlo en la bd.

Add to cart: Este boton es el encargado de añadir productos al carrito. Usa post de esta forma -> con el body coge el id y lo añade a la sesión carrito, si esta no existe, la crea. Además, redirige al carrito para mostrar ese y los otros productos añadidos.

Puntos a destacar:

Archivo baseScripts.js -> todo lo relacionado con javascript en frontend
router_tienda.js -> el "backend" y el encargado de renderizar y dirigir páginas. Destacar el uso de llamadas asíncronas al interactuar con la bd debido a la naturaleza de javscript.

Uso de bootstrap para css.