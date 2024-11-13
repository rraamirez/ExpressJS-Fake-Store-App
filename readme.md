##Práctica 4 DAI:   API RESTful
## Raúl Ramírez Abril

En esta práctica se ha hecho una implementación simple de una api rest y se ha implementado un archivo de testeo de los endpoints.

La idea de hacer una api restfull es la de abstraer el backend del frontend, proporcionando un modelo en el que el frontend que se usase sería indiferente, simplemente se limitaría a pedir datos al backend y mostrarlos, de forma que se evitaría por completo hacer lógica de negocio en el front (esto es muy mala práctica en la programación web actual orientada a microservicios). Gracias a esto, en futuras prácticas podremos implementar una single page app de frontend.

Puntos a destacar:

    configuración: app.use(express.json()) -> Esto es crucial ya que la idea de las api rest y los microservicios es dar respuestas en forma de jsons para que el frontend lo lea.

    Endpoints implementados en archivo ratings_rest_api.js:
        GET /api/ratings           // lista con los ratings de todos los productos

        GET /api/ratings/:id       // rating del producto con id

        PUT /api/ratings/:id      // modifificar rating del producto con id

        Control de errores: Es esencial el control de errores en una api rest, por lo que se ha hecho una lógica con try catch para poder capturarlos.

    Testeo -> se ha creado un archivo test-api.http para probar las peticiones mediante el uso de 
                una extensión de vscode.

    Info adicional de testeo: Si no usas vscode, siempre puedes usar la herramienta postman para probar los endpoint. En caso de usar una api mas compleja, recomiendo leer este tutorial de uso de swagger que aportaría muchos beneficios:  https://medium.com/@italo.ravina/a%C3%B1adir-documentaci%C3%B3n-con-swagger-a-un-api-creada-en-express-5c4c5c3cb19e

    Logs: Se ha creado un logger con winston siguiendo el tutorial sugerido en el guión, esto es muy importante ya que en un futuro se podría tener en la bd una columna logs donde estos se almacenasen (o guardarlos en un archivo) además de que no es buena práctica el uso de logs en el cliente, lo ideal es el el backend tener los logs de forma que solo el desarrollador pueda acceder a ellos.
