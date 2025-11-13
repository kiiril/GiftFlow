# GiftFlow

A full-stack web platform for discovering, sharing, and organising gift ideas. 

## Overview

GiftFlow is a full-stack web app for discovering and organising gift ideas. Users can browse a curated feed with filters, create posts with images, save favourites, leave comments, and track upcoming birthdays through a simple calendar with notes. The platform is built with **React**, **Node.js** (Express), and **MySQL**.

## Features
- **User auth:** email + password, session-based
- **Feed:** scrollable list of gift ideas with filters
- **Posts:** create/edit posts, image upload
- **Favourites:** save ideas for later
- **Comments:** basic discussion under posts
- **Calendar:** birthday reminders + notes

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js (Express)
- **DB:** MySQL
- **Other:** multer, dnd-kit, express-session, bcrypt

## Demo
https://github.com/user-attachments/assets/e8516366-2346-4cc1-bc97-76365d5492c5

## Setup & Installation
### 1. Clone the repo
```bash
git clone https://github.com/kiiril/GiftFlow.git
cd GiftFlow
```
### 2. Database setup
Create MySQL database and run querires in ```db_structure.sql``` to create all tables. 
### 3. Backend setup
```bash
cd backend
npm install
cp .env-original .env # fill in DB credentials
npm start
```
### 4. Frontend setup
```bash
cd frontend
npm install
npm start
```
