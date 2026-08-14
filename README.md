# AstroJS eCommerce Project

This project is a minimal eCommerce boilerplate built using AstroJS, with a custom backend powered by Prisma and Supabase.

> **Note:** This project was originally based on the Crystallize product storytelling boilerplate, but has since been migrated to use a custom backend.

![dounut-astro-local](https://github.com/CrystallizeAPI/boilerplates/assets/26195876/dfe351b9-69dc-4e9e-947b-e89ff07151a7)




## What this guide covers:

- Setting up your project
- Instructions for running the project
- Accessing the development site
- Folder structure of the boilerplate
- Editing the components and the theme
- Deploying the project

## Getting Started

To get started, head over to GitHub and clone [the repository](https://github.com/CrystallizeAPI/dounut-astro). Make sure to install all the required packages by running the following command for both the folders:

```bash
npm install

```

## Running the Project

Running the project in development is straightforward. To start the development server, run the following command:

```bash
npm run dev

```

## Accessing the Development Site

Once the development server is running, you will be able to browse to http://localhost:4321/.

<img width="1437" alt="dounut-astro-dev-server" src="https://github.com/CrystallizeAPI/boilerplates/assets/26195876/d615da75-54dc-4866-a8fd-5054fca3a23e">


## Folder Structure

This section provides you with a better understanding of the folder structure.

**src/components**

Contains all the Astro/React components used throughout the application.

**src/lib**

Includes server-side and client-side helpers, such as the Supabase client initializers.

**src/pages**

Has all the individual pages and API routes the website contains.

## Editing the theme

All the theme-related information can be edited in the **tailwind.config.mjs** file. This includes the colors, spacing, and typography used throughout the application.

## Editing the components

Components can be edited by heading over to the **components** folder in **src.**

### Frontpage

The frontpage contains a grid of products fetched from the `/pages/api/products.ts` endpoint. The data is managed via a Prisma schema.

### Product

Individual product pages are using two components - one is the **product** component that contains the hero section, and the ‘Add to cart’ button and then the **product-body** component that can be edited to change the layout of the marketing information displayed on the page.

### Cart, Checkout, and Confirmation

The basket, checkout, and the confirmation pages can be edited in their respective files located in the pages folder.
