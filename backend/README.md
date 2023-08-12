# SendaAlquiler - Backend

## Tabla de Contenidos

- [Introducción](#introducción)
- [Acerca de GraphQL](#acerca-de-graphql)
- [Requisitos Previos](#requisitos-previos)
- [Instrucciones de Instalación](#instrucciones-de-instalación)
- [Uso de la Aplicación](#uso-de-la-aplicación)
- [Recursos Educativos](#recursos-educativos)

## Introducción

SendaAlquiler es una aplicación web desarrollada con el framework Django, basado en el lenguaje de programación Python. Para la gestión y consulta de datos, se ha implementado **GraphQL** en lugar del convencional REST.

## Acerca de GraphQL

[GraphQL](https://graphql.org/learn/) es un lenguaje de consulta para APIs, que se ejecuta en el servidor. A diferencia de REST, GraphQL permite interactuar con un único endpoint, permitiendo al cliente especificar los datos que desea recibir. Esto resulta en consultas más eficientes y flexibles.

Para la implementación de GraphQL en el contexto de Django, se ha optado por el uso de [**Graphene-Django**](https://docs.graphene-python.org/projects/django/en/latest/), que facilita la creación de esquemas GraphQL utilizando modelos de Django.

## Requisitos Previos

- **Python:** Lenguaje de programación en el que se basa Django.  
  [Descargar Python](https://www.python.org/downloads/)  
  Al instalar Python, se instalará automáticamente `pip`, el gestor de paquetes de Python.

- **virtualenv:** Herramienta para crear entornos virtuales en Python.  
  Para instalarlo:
  ```bash
  pip install virtualenv
  ```

## Instrucciones de Instalación

### 1. Configuración del Entorno Virtual

#### Windows:

```bash
python -m venv venv
.\venv\Scripts\activate
```

El prefijo `(venv)` en la terminal indica que el entorno virtual ha sido activado.

### 2. Instalación de Dependencias

Con el entorno virtual activo:

```bash
pip install -r requirements.txt
```

### 3. Configura las variables entorno

Para el funcionamiento de la aplicación debes crear un archivo llamado ".env" en este mismo directorio.
Puedes basarte en el archivo de ejemplo [**.env.example**](./.env.example).

### 4. Aplicación de Migraciones

Django utiliza un sistema de migraciones para gestionar cambios en la base de datos. Antes de correr el proyecto, necesitas aplicar estas migraciones:

```bash
python manage.py migrate
```

### 5. Inicio del Servidor

```bash
python manage.py runserver
```

El servidor se iniciará en `http://127.0.0.1:8000/`.

## Uso de la Aplicación

Con el servidor en ejecución, se puede acceder a la interfaz de GraphQL a través de `http://127.0.0.1:8000/graphql`.

## Recursos Educativos

A continuación, se presentan varios recursos que pueden ser de utilidad para comprender mejor las tecnologías implementadas:

### Django

1. **Documentación Oficial de Django**
   [Consultar Documentación](https://docs.djangoproject.com/en/3.2/intro/tutorial01/)

### GraphQL

1. **Comparativa entre GraphQL y REST**
   [Leer Artículo](https://www.howtographql.com/basics/1-graphql-is-the-better-rest/)

2. **Herramienta Interactiva de GraphQL**
   [Acceder a la Herramienta](https://lucasconstantino.github.io/graphiql-online/)

### Graphene-Django

1. **Documentación Oficial de Graphene-Django**
   [Consultar Documentación](https://docs.graphene-python.org/projects/django/en/latest/)
