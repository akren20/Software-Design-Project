# Software Design Project

This repository contains a full-stack application with a React frontend using Tailwind CSS and a Node.js backend.

## Description

This project is the Software Design Project for Singh's 4353 course.

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/akren20/Software-Design-Project.git
cd Software-Design-Project
```

### 2. Install the necessary dependencies for the front end

```bash
cd client
npm i
```

### 3. Run the website

```bash
npm start
```

Once the server is running, open (http://localhost:3000) in your browser to see the application.

### 4. Open another terminal and then move into the server folder

```bash
cd server
npm i
```

### 4. Run the Backend

```bash
node server.mjs
```
Both the backend and frontend should be running now.
You can quit and shut down the server by hitting control + c

### 5. Tests
If currently running the server, please shut it down before you try and run backend tests
```bash
npm run test
```
After running this command, you should be able to see all the passing and failing tests in this repository (tests: mocha).
If you want to end the tests hit control + c
