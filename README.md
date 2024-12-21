Raúl Ramírez Abril

Práctica 7 DAI -> despliegue en producción (local)

En esta práctica se ha realizado una dockerización completa de la app en un contenedor para así poder realizar un despliegue.

Siguiendo las indicaciones, se ha usado caddy como proxy inverso para redirigir las peticiones dentro del contenedor. Se ha hecho todo local y deshabilitando todo lo relacionado a tls y peticiones https (sólo http).

Archivos a revisar:
    docker-compose-prod.yml (toda la dockerización)
    db.js (configurar url)
    .env (variables de entorno)
    Cddyfile (configuración básica de despliegue)
    dockerfile (configuración básica para el contenedor)