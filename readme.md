Practica 3 DAI - Raúl Ramírez Abril

En esta práctica se ha seguido con la aplicación web desarrollada en la página 2.
Las mejoras implementadas se dividirán en dos secciones: Práctica 3.1 y Práctica 3.2

referencias:
    https://medium.com/@diego.coder/autenticaci%C3%B3n-en-node-js-con-json-web-tokens-y-express-ed9d90c5b579
    https://mongoosejs.com/docs/validation.html
    

Práctica 3.1:

    Se ha añadido la opción de autenticarse en el menú con los datos almacenados en la bd. Esta lógica se ha implementado en un nuevo router de express js (router_usuarios.js). 
    Se ha creado un formulario de login el cual interactua con este router con una petición get y hace el logueo mediante una petición post.

    Se ha hecho uso de la biblioteca JWT para poder crear un web token a la hora de autenticar, para así hacer uso de la capacidad de esta creando una cookie que se intercambiará entre el cliente y el servidor. Se ha seguido todas las instrucciones del guión -> establecer la cookie, usar el middleware para poder interceptar la cookie  de forma que se pueda leer y manejar etc.

    Se ha hecho una función que verifica si el usuario y la pass son correctos haciendo uso de la función findOne de mongodb y devolviendo true o false en función de si se matchea un campo en la bd con justo ese usuario y password.

    A destacar del router nuevo router: 

    Endpoint de login con get: renderiza el html de login además de que sabe gestionar los errores para poder mostrarlos (si la contraseña es incorrecta por ejemplo)

    Endpoint login con post: Hace la logica de logueo -> si la funcion verificarUsuario es correcta -> firma el token con la clave secreta y establece la cookie access_token. Si es incorrecta, se devuelve un error con codigo 401 (unauthorized) que será capaz de llevar al html mediante nunjucks una alerta de error en la que avisa que usuario o contraseña son incorrectos.

    Endpoint logout con get -> destruye la cookie y todas las sesiones, de forma que aparte de perder el usuario logueado en la sesion tambien elimina el carrito para que otro usuario no tenga ese carrito.

    No se han hasheado las contraseñas. 

    En funcion a si estoy logueado o no, se muestra el boton de login o logout, esto se gestiona comprobando si la sesion de usuario existe o no (se crea al loguearse y se destruye al loguearse)

Práctica 3.2: 

    En esta sección se trata ya con la interacción con la bd.
    Gracias a la flexibilidad de las bases de datos no relacionales, en algunos usuarios se ha añadido el campo admin y se ha puesto en true (en los otros no se ha puesto nada ya que en el esquema de mongo he puesto false por defecto). Además, he puesto como restricción en el esquema que el inicio del titulo sea mayusculo: -> return /^[A-Z]/.test(value); -> ^ es inicio y [A-Z] mira si el ascii coincide con los de las mayusculas y hace el test al valor que tengas.
    

    A la hora de firmar el token he añadido tambien el campo de admin para asi tenerlo disponible en todos las rutas de la web, de forma que a la hora de poner botón de editar en producto.html este solo se muestra si el usuario es admin (hecho con nunjucks) -> Este boton redirigeal formulario de edición.

    Formulario de edición: 
        Formulario simple que edita el titulo y precio. con javacript en el lado del cliente valido si empieza por mayusculas el titulo de forma que cojo el id del boton y si no es mayuscula el input lo pongo en disabled -> asi me aseguro nunca insertar titulo minusculo (aunque daría error)

        Destacar estos 2 endpoints nuevos en router_tienda:
            router.get("/producto/:id/editar"...
            Endpoint que te redirige al formulario de edición, además de que es capaz de gestionar los tipos de error y no solo eso sino que comprueba si tienes permisos para entrar o no( si no eres admin te dara error y no podras acceder a la ruta)

            router.post("/producto/:id/editar"... -> este endpoint se encarga de editar el producto gracias a la funcion de mongo de findByIdAndUpdate y una vez editado te redirige de vuelta a la vista del producto

Se ha añadido a la raiz del proyecto un video de demostración de la web. 
