# Final project

## Pasos para arrancar el servidor

1. Renombrar él .env.example y colocar los datos personales.
2. Instalar dependencias.
```sh
npm install
```
3. Luego ejecutar el servidor.
 ```sh
npm run dev
```

## Pasos para arrancar el servidor con docker

1. Tener Docker instalado junto con docker compose.
2. Ir a la carpeta del proyecto.
3. Quitar extension .example del Dockerfile y del docker-compose.yml (Problemas con raiways al hacer el deploy).
4. Renombrar él .env.example y colocar los datos personales.
5. Configurar el docker compose con los datos personales
6. Ejecutar el comando para levantar el servidor en segundo plano.

```sh
    docker compose up --build -d
```


## Funciones

- Paginación
- Perfil
- Comentarios
- Búsqueda de Post
- Avatar
- Agregar imágenes al post
- Error 404
- Avatar
- Categorías