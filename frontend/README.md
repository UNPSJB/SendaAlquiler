# SendaAlquiler - Frontend

## Tabla de Contenidos

-   [Introducción](#introducción)
-   [Tecnologías Utilizadas](#tecnologías-utilizadas)
-   [Requisitos Previos](#requisitos-previos)
-   [Instrucciones de Instalación](#instrucciones-de-instalación)
-   [Configuración y Uso de GraphQL Codegen](#configuración-y-uso-de-graphql-codegen)
-   [Diseño UI/UX](#diseño-uiux)
-   [Recursos Educativos](#recursos-educativos)

## Introducción

SendaAlquiler - Frontend es la cara visible de nuestra aplicación de alquileres, construida con un conjunto moderno de tecnologías para proporcionar una experiencia fluida y dinámica al usuario. Este frontend se comunica con nuestro backend basado en Django a través de GraphQL.

## Tecnologías Utilizadas

-   **Next.js:** Framework web basado en React para aplicaciones de una sola página.
-   **TypeScript:** Superset de JavaScript que añade tipado estático.
-   **React Query:** Librería para manejar estado de Backend. React Query puede manejar las peticiones a una API, y puede gestionar cuándo debes actualizar los datos, incluso de forma automática.
-   **Tailwind CSS:** Un framework CSS de bajo nivel para la construcción de diseños personalizados.
-   **GraphQL Codegen:** Herramienta que genera automáticamente el tipado de TypeScript a partir de esquemas GraphQL.

## Requisitos Previos

-   **Yarn:** Gestor de paquetes utilizado para manejar y distribuir paquetes de software.  
    [Descargar Yarn](https://classic.yarnpkg.com/en/docs/install/)

## Instrucciones de Instalación

### 1. Instalación de Dependencias

```bash
yarn install
```

### 2. Inicio del Servidor

```bash
yarn dev
```

Esto iniciará el servidor en modo desarrollo. Normalmente, podrás acceder a la aplicación a través de `http://localhost:3000`.

## Configuración y Uso de GraphQL Codegen

GraphQL Codegen es una herramienta poderosa que facilita la integración de GraphQL con TypeScript. Para ejecturalo solo debes asegurarte de que tu endpoint de GraphQL (la aplicación backend de Django) esté accesible y ejecuta:

```bash
yarn gen
```

Esto generará automáticamente los tipos y hooks para tus consultas y mutaciones.

## Diseño UI/UX

El diseño de la interfaz de usuario fue creado con Figma, proporcionando una visión clara y estructurada de la experiencia del usuario final. Es una herramienta valiosa para comprender visualmente la estructura y la interacción del proyecto.

[Ver Diseño en Figma](https://www.figma.com/file/HoYo9swmWbeEHsJCdiExu1/Universidad?type=design&node-id=114%3A2&mode=design&t=lMzrc6hgys1Uirba-1)

## Recursos Educativos

Aquí se incluyen recursos adicionales para comprender mejor las tecnologías empleadas:

-   [Documentación oficial de Next.js](https://nextjs.org/docs)
-   [TypeScript en 5 minutos](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
-   [Guía de React Query](https://react-query.tanstack.com/overview)
-   [Documentación oficial de Tailwind CSS](https://tailwindcss.com/docs)
