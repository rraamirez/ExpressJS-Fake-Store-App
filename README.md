Raúl Ramírez Abril

Práctica 7 DAI -> despliegue en producción (local)

En esta práctica se ha realizado una dockerización completa de la app en un contenedor docker para así poder simluar (realizar) un despliegue.

Siguiendo las indicaciones, se ha usado caddy como proxy inverso para redirigir las peticiones dentro del contenedor. Se ha hecho todo local y deshabilitando todo lo relacionado a tls y peticiones https (sólo http).

Archivos a revisar:
    docker-compose-prod.yml (toda la dockerización)
    db.js (configurar url)
    .env (variables de entorno)
    Caddyfile (configuración básica de despliegue del proxy inverso)
    dockerfile (configuración básica para el contenedor)