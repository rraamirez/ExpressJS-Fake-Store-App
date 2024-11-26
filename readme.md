Raúl Ramírez Abril

Práctica 5 desarrollo aplicaciones de internet

Archivos implementados nuevos -> ratings.js 
Archivos modificados -> producto.html (para añadir la nueva funcionalidad)

En esta práctica se ha implementado un  pequeño front-end que consuma la API implementada en la práctica 4 (rating_rest_api.js). 
Esta nueva lógica está en ./public/js/ratings.js

(IMPORTANTE): Se ha hecho uso de la api rest al 100%, es decir pidiendo y actualizando datos con formatos json y siendo el front end el que los consume independientemente. Todas las llamadas a la api son asíncronas y se ha hecho uso de fetch para llamarla.

Breve explicación de la implementación:
    En este caso el objetivo de la práctica era añadir un sitema de ratings a los productos de la BD.
    En mi caso, este front-end lo implementé en la pestaña que muestra un producto completo con todos sus detalles, producto.html.

    Se ha usado la implementación de  How TO - Star Rating proporcionada en el guión.
    
    Lo que se ha hecho es que con javascript (ratings.js), se ha añadido como se pedía en el guión un event listener para cuando el contenido se renderizase en el DOM, se matchearan todos los elementos de la clase "star" (lo añadido de rating de base) de forma que para cada uno se realizase una consulta al endpoint del rating, y se escupieran en el html las estrellas correspondientes (entre 1 y 5). 
    Para lograr esto, he creado una función generarHTMLConEstrellas(rating, ide) que coge el html y lo sustituye por el numero de estrellas correspondientes. Ha sido esencial pasarle el rating de parametro para saber la rate y actualizarla, además de su id (esto me servirá para luego poder votar.)

    Con el funcionamiento básico de mostrar el rating, tocaba ser capaz de poder simular una "votación". Siguiendo el guión, añadí a cada elemento un event listener que llamase a la función vota, la cual realiza una llamada a la api con PUT y sustituye el rating por el votado y al contador le suma 1. Después recarga la página para mostrar el valor actualizado. Esto último no es lo más óptimo, pero al no tener muchos datos y javascript no contar con una forma nativa de hacer esto sin repetir todo el código del event listener del domContentLoaded, sacrifiqué rendimiento por simplicidad.

Consideraciones adicionales: 
    Aunque quizá en este caso no era necesario, en mi caso todas las funciones que hacían llamadas a la api las hice asíncronas (con async), ya que en un escenario real sería esencial para evitar errores. También se podrían usar promesas directamente, pero es una forma mas tediosa de gestionar la asincronía de javascript que usar async y await (haciendo lo mismo a final de cuentas).

Problemas enfrentados: 
    Una consideración de javascript puro es que al ser un lenguaje no fuertemente tipado se debe ser cuidadoso a la hora de hacer llamadas a apis. En mi caso, destrocé la base de datos (sobreescribí mal datos) ya que pasaba las rate al votar como una cadena en vez de un numero. Para solucionar esto usé parseInt en los datos antes de llamar a la API.