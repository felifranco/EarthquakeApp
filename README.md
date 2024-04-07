# Earthquake App

## TABLA DE CONTENIDO

- [Acerca del proyecto](#acerca-del-proyecto)
- [Ambiente de desarrollo](#ambiente-de-desarrollo)
  - [Sistema Operativo](#sistema-operativo)
  - [Instalación de Ruby](#instalación-de-ruby)
  - [Instalación de Rails](#instalación-de-rails)
  - [Instalación de NodeJS](#instalación-de-nodejs)
- [Creación del proyecto](#creación-del-proyecto)
  - [Vite y React](#vite-y-react)
  - [Rails Task]()
- [Ejecución](#ejecución)
  - [Línea de comandos](#línea-de-comandos)
  - [Docker compose](#docker-compose)
- [Referencias](#referencias)

## Acerca del proyecto

### Objetivos:

Desarrollar un aplicación en Ruby o framework basado en Ruby que contemple una Task para obtener y persistir datos y una API que exponga dos endpoints que serán consultados desde un cliente externo.
Desarrollar una página web simple en HTML5 y Javascript que permita consultar los dos endpoints que expondrá la API mencionada anteriormente. Bonus si utiliza alguno de estos framework: EmberJS, React, AngularJS o VueJS.

1.  **Desarrollo Back end**:
    Se espera el desarrollo de una aplicación en Ruby o framework basado en Ruby que obtenga y entregue información relacionada con datos sismológicos en el mundo. A grandes rasgos se espera que contemple una Task para obtener y persistir datos y dos endpoints que serán consultados desde un cliente externo.

    1.  Obtención de datos desde feed y persistencia:
        Desarrollar una Task que permita obtener data sismológica desde el sitio USGS (earthquake.usgs.gov). Este feed entrega data en el formato GeoJSON utilizado para estructuras de datos geográficas, por ejemplo un Feature (un evento sismológico), pero no te preocupes, GeoJSON usa el estándar JSON ;)

        Específicamente se debe obtener desde el feed "Past 30 days" (earthquake.usgs.gov/earthqu... la información de la colección features. Específicamente por cada elemento:

        ```
        `id`,
        `properties.mag`,
        `properties.place`,
        `properties.time`,
        `properties.url`,
        `properties.tsunami`,
        `properties.magType`,
        `properties.title`,
        `geometry.coordinates[0]` (longitude)
        y `geometry.coordinates[1]` (latitude).
        ```

        Es necesario persistir esta data en BD. Considerar:
        Los valores de `title`, `url`, `place`, `magType` y coordinates no pueden ser nulos. En caso contrario no persistir.
        Validar rangos para magnitude [-1.0, 10.0], latitude [-90.0, 90.0] y longitude: [-180.0, 180.0]
        No deben duplicarse registros si se lanza la task más de una vez.

    2.  Disponibilizar datos a través de una API REST:
        Se espera que se desarrollen dos endpoints para exponer la data y modificar data:

        1. **Endpoint 1**: GET lista de features

           Considerar:
           Los resultados deben exponerse siguiendo el siguiente formato:

           ```json
           {
           "data": [
               {
               "id": Integer,
               "type": "feature",
               "attributes": {
                   "external_id": String,
                   "magnitude": Decimal,
                   "place": String,
                   "time": String,
                   "tsunami": Boolean,
                   "mag_type": String,
                   "title": String,
                   "coordinates": {
                   "longitude": Decimal,
                   "latitude": Decimal
                   }
               },
               "links": {
                   "external_url": String
               }
               }
           ],
           "pagination": {
               "current_page": Integer,
               "total": Integer,
               "per_page": Integer
           }
           }

           ```

           La data debe poder ser filtrada por:
           `mag_type`. Using filters[mag_type]. Puede ser más de uno. Valores posibles: md, ml, ms, mw, me, mi, mb, mlg.
           `page`
           `per_page`. Validar per_page <= 1000

        2. **Endpoint 2**: POST crear un comment asociado a un feature

           Este endpoint debe recibir un payload que considere la siguiente información para crear un comentario relacionado con el feature :
           Considerar:
           Un feature puede tener uno o más comments, pero solo se crea uno a la vez (por request).
           El payload debe contener un `feature_id`: Integer que hace referencia al `id` interno de un feature y un `body`: Text con el comentario ingresado.
           Se debe persistir cada comment recibido por este endpoint.
           Se debe validar que existe contenido en el body del nuevo comentario antes de ser persistido.

           ```
           curl -X GET \
           '127.0.0.1:3000/api/features... \
           -H 'Content-Type: application/vnd.api+json' \
           -H 'cache-control: no-cache'
           ```

           ```
           curl -X GET \
           '127.0.0.1:3000/api/features... \
           -H 'Content-Type: application/vnd.api+json' \
           -H 'cache-control: no-cache'
           ```

           ```
           curl --request POST \
           --url 127.0.0.1:3000/api/features... \
           --header 'content-type: application/json' \
           --data '{"body": "This is a comment" }'
           ```

## Ambiente de desarrollo

### Sistema Operativo

[documentación oficial](https://guides.rubyonrails.org/getting_started.html)

### Instalación de Ruby

Se utilizará la paquetería oficial de Fedora (dnf) para instalar Ruby, se ejecuta el siguiente comando:

```shell
sudo dnf install ruby
```

se comprueba la versión instalada

```shell
$ ruby --version
ruby 3.2.2 (2023-03-30 revision e51014f9c0) [x86_64-linux]
```

bundle config set --local path 'vendor/cache'

### Instalación de SQLite

```shell
sudo dnf install sqlite
sudo dnf install libsqlite3-ruby
```

```shell
sudo dnf install sqlite-devel sqlite-tcl
```

### Instalación de Rails

Para Fedora, la instalación de Rails puede ser a través de `RubyGems.org` o de los paquetes oficiales de Fedora. Para este caso se utilizará `RubyGems.org` por ser _el servicio de alojamiento de Gemas de la comunidad de Ruby_. Ejecutamos los siguientes comandos:

```shell
$ sudo dnf group install "C Development Tools and Libraries"
$ sudo dnf install ruby-devel zlib-devel
$ gem install rails
```

comprobamos la versión instalada

```shell
$ rails --version
Rails 7.1.3.2
```

### Instalación de NodeJS

Se utilizará ReactJS, Vite y Redux para desarrollar el frontend, para eso se necesita tener instalado NodeJS y NPM. El siguiente comando instala ambas herramientas:

```shell
sudo dnf install nodejs
```

## Creación del proyecto

### Vite y React

Vite es una herramienta de frontend que permite generar un entregables óptimo y reducidos de un sistema web para producción; no solo es un _empaquetador_, también contiene herramientas de compilación como [SWC](https://github.com/swc-project/swc). Se pueden encontrar más detalles en su [documentación oficial](https://vitejs.dev/guide/why.html). Creamos nuestro proyecto de frontend con el siguiente comando:

```shell
$ npm init vite@latest
Need to install the following packages:
create-vite@5.2.0
Ok to proceed? (y) y
✔ Project name: … earthquake_vite_reactjs
✔ Select a framework: › React
✔ Select a variant: › JavaScript + SWC
```

Ingresamos a la carpeta recién creada e instalamos Redux:

```shell
$ npm install @reduxjs/toolkit react-redux
```

Utilizaremos los estados de la aplicación principalmente en Redux, el hook de react `useState` también se podría utilizar pero por orden y centralización se prefirió Redux. Y se utiliza `@reduxjs/toolkit` por la [simplicidad](https://redux-toolkit.js.org/introduction/getting-started).

### Rails Task

```shell

```

## Ejecución

### Línea de comandos

### Docker compose

[earthquake_vite_reactjs/Dockerfile](earthquake_vite_reactjs/Dockerfile)

```shell

```

```shell

```

# Referencias

- [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html)
- [Ruby installation](https://developer.fedoraproject.org/tech/languages/ruby/ruby-installation.html)
- []()
- [Ruby on Rails installation](https://developer.fedoraproject.org/tech/languages/ruby/ror-installation.html)
- [Using Rails for API-only Applications](https://guides.rubyonrails.org/api_app.html)
- [How to install Ruby on Rails in Fedora | LINUX](https://www.youtube.com/watch?v=4XclLnEBuRI)
- [Installing Ruby on Rails on Fedora 38](https://reintech.io/blog/installing-ruby-on-rails-fedora-38)
- [How To Install Ruby on Rails on Fedora 38](https://idroot.us/install-ruby-on-rails-fedora-38/)
