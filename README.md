# Earthquake App

## TABLA DE CONTENIDO

- [Acerca del proyecto](#acerca-del-proyecto)
  - [Objetivos](#objetivos)
- [Ambiente de desarrollo](#ambiente-de-desarrollo)
  - [Sistema Operativo](#sistema-operativo)
  - [Instalación de Ruby](#instalación-de-ruby)
  - [Instalación de Rails](#instalación-de-rails)
  - [Instalación de NodeJS](#instalación-de-nodejs)
- [Creación del proyecto](#creación-del-proyecto)
  - [Vite y React](#vite-y-react)
  - [Ruby on Rails](#ruby-on-rails)
    - [API](#api)
    - [Task](#task)
- [EJECUCIÓN](#ejecución)
  - [Línea de comandos](#línea-de-comandos)
    - [Backend](#backend)
      - [Ejecutar Task](#ejecutar-task)
      - [Ejecutar API](#ejecutar-api)
    - [Frontend](#frontend)
  - [Docker compose](#docker-compose)
- [Referencias](#referencias)

## Acerca del proyecto

Este es un proyecto sencillo que cuenta con un frontend con **ReactJS y Vite**, carpeta `earthquake_vite_reactjs` y un backend hecho con **Ruby On Rails**, carpeta `earthquake_back`. El proyecto en ejecución muestra en el frontend una tabla con los valores obtenidos a través de una `Task` y procesados con el backend.

![frontend](./assets/Frontend.png)

### Objetivos:

Desarrollar un aplicación en Ruby o framework basado en Ruby que contemple una Task para obtener y persistir datos y una API que exponga dos endpoints que serán consultados desde un cliente externo.
Desarrollar una página web simple en HTML5 y Javascript que permita consultar los dos endpoints que expondrá la API mencionada anteriormente. Bonus si utiliza alguno de estos framework: EmberJS, React, AngularJS o VueJS.

1.  **Desarrollo Back end**:
    Se espera el desarrollo de una aplicación en Ruby o framework basado en Ruby que obtenga y entregue información relacionada con datos sismológicos en el mundo. A grandes rasgos se espera que contemple una Task para obtener y persistir datos y dos endpoints que serán consultados desde un cliente externo.

    1.  Obtención de datos desde feed y persistencia:
        Desarrollar una Task que permita obtener data sismológica desde el sitio USGS (earthquake.usgs.gov). Este feed entrega data en el formato GeoJSON utilizado para estructuras de datos geográficas, por ejemplo un Feature (un evento sismológico), pero no te preocupes, GeoJSON usa el estándar JSON ;)

        Específicamente se debe obtener desde el feed "Past 30 days" (https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson) la información de la colección features. Específicamente por cada elemento:

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

El desarrollo se hizo en un equipo local con Fedora Linux 39 (Workstation Edition), versión de kernel Linux 6.6.13-200.fc39.x86_64, por lo que desde la documentación oficial buscaremos la instalación para Fedora siguiendo la [documentación oficial](https://guides.rubyonrails.org/getting_started.html).

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

Ingresamos a la carpeta recién creada e instalamos Redux y Material UI:

```shell
$ npm install @reduxjs/toolkit react-redux @mui/material
```

Utilizaremos los estados de la aplicación principalmente en Redux, el hook de react `useState` también se podría utilizar pero por orden y centralización se prefirió Redux. Y se utiliza `@reduxjs/toolkit` por la [simplicidad](https://redux-toolkit.js.org/introduction/getting-started). También se utilizarán los componentes de [Material UI](https://mui.com/material-ui/).

### Ruby on Rails

#### API

Creamos un nuevo proyecto Rails con los parámetros de nombre, `--api` y `--skip-active-record` porque se utilizará la gema `mongoid` en su lugar.

```shell
rails new earthquake_back --api --skip-active-record
```

Ingresar a la nueva carpeta del backend

```shell
cd earthquake_back
```

Agregar al [Gemfile](earthquake_back/Gemfile) las siguientes referencias. `mongoid`:

```yaml
gem 'mongoid'
```

Para la paginación se utilizará `will_paginate_mongoid`

```shell
gem "will_paginate_mongoid"
```

Y para el manejo de CORS se usará `rack-cors`

```shell
gem "rack-cors"
```

Instalar dependencias

```shell
bundle install
```

Generar el archivo de configuración predeterminado con la configuración de Mongoid:

```shell
bin/rails g mongoid:config
```

Esto creó el archivo [mongoid.yml](earthquake_back/config/mongoid.yml).

Crear el recurso para el procesamiento de las features

```shell
bin/rails generate scaffold features features
```

Modificar el controlador que se encuentra en [earthquake_back/app/controllers/features_controller.rb](earthquake_back/app/controllers/features_controller.rb) para devolver la información en el formato que se solicita.

#### Task

Por último creamos una _Task_ que obtendrá los datos del API pública

```shell
bin/rails generate task api fetchData
```

Modificar el contenido de la _Task_ para que cumpla su proposito, el archivo se encuentra en [earthquake_back/lib/tasks/api.rake](earthquake_back/lib/tasks/api.rake).

## EJECUCIÓN

### Línea de comandos

#### Backend

**IMPORTANTE:** Antes de iniciar es necesario tener una base de datos MongoDB instalada y corriendo, configurar los datos en el archivo [earthquake_back/config/mongoid.yml](earthquake_back/config/mongoid.yml).

Ingresamos a la carpeta del backend

```shell
cd earthquake_back
```

##### Ejecutar Task

Ejecutamos la tarea `fetchData` para obtener la información de la API pública y almacenarlos en nuestra base de datos.

```shell
$ rake api:fetchData
Fetching data................................................................................................ Insertados: 9364.
```

##### Ejecutar API

Iniciamos nuestra API con el siguiente comando:

```shell
bin/rails server
```

De forma predeterminada el proyecto se ejecuta en `http://localhost:3000`.

#### Frontend

Creamos nuestro archivo `.env`

```dotenv
VITE_APP_PORT=5000
VITE_FEATURES_BACKEND=http://localhost:3000
```

Instalamos las dependencias

```shell
npm install
```

Ejecutamos el proyecto con:

```shell
npm run dev
```

### Docker compose

[earthquake_vite_reactjs/Dockerfile](earthquake_vite_reactjs/Dockerfile)

# Referencias

- [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html)
- [Ruby installation](https://developer.fedoraproject.org/tech/languages/ruby/ruby-installation.html)
- [Ruby on Rails installation](https://developer.fedoraproject.org/tech/languages/ruby/ror-installation.html)
- [Using Rails for API-only Applications](https://guides.rubyonrails.org/api_app.html)
- [How to install Ruby on Rails in Fedora | LINUX](https://www.youtube.com/watch?v=4XclLnEBuRI)
- [Installing Ruby on Rails on Fedora 38](https://reintech.io/blog/installing-ruby-on-rails-fedora-38)
- [How To Install Ruby on Rails on Fedora 38](https://idroot.us/install-ruby-on-rails-fedora-38/)
- [Getting started rails 7](https://www.mongodb.com/docs/mongoid/current/tutorials/getting-started-rails7/)
