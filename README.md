# Recipe Vault

## Overview

Recipe Vault is a recipe management web application where users can browse recipes, add their own recipes, search and filter by ingredient or category, and save favorite recipes. The application was built using React and uses Supabase for authentication and cloud-based data storage.

---

## Features

- Recipe CRUD system allowing users to create, edit, and delete recipes
- Recipe browsing page displaying a list of all recipes
- Individual recipe detail pages showing full ingredients and instructions
- Search functionality allowing users to search recipes by name
- Category filtering to filter recipes by recipe category
- Favorites system allowing users to save recipes and access them later

---

## AI Features

- Generate description feature
- Generate tags feature

These AI features are displayed when adding a recipe and can be viewed on recipe cards while editing and after saving. The AI features use Ollama running locally, so these features won’t work unless Ollama is installed on your local device.

## Tech Stack

- React
- Vite
- React Router
- Supabase (Authentication + Database)
- CSS
- Netlify (Deployment)

---

## Live Application

https://dig4503-rachgottlieb-recipevault.netlify.app/

---

## How It Works

1. Users create an account or log in
2. Authenticated users can add recipes using the Add Recipe form
3. Recipes are saved to the Supabase database
4. Recipes can be viewed, searched, filtered, edited, or deleted
5. Users can mark recipes as favorites

---

## Learning Goals

This project focuses on:

- Building a full React single-page application
- Implementing CRUD functionality
- Integrating a cloud database
- Implementing user authentication
- Using AI tools to assist in development and debugging

---

## Setup Instructions

1. Clone the repository  
2. Run `npm install`  
3. Run `npm run dev`  

---

## Deployment

**Live Application:** (https://dig4503-rachgottlieb-recipevault.netlify.app/)
