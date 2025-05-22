# NPS Web App : Corrected and clean version
This is an internal web application for data analysis dashboard and statistics showcase of NPS data for a large telecommunications enterprise.
---
## Index
1. [Introduction](#nps-web-app--corrected-and-clean-version)
2. [Getting Started](#getting-started)
    - [Backend Setup](#1-download-the-backend-requirements)
    - [Frontend Setup](#2-download-the-frontend-modules)
    - [Environment Configuration](#3-create-the-env-files)
    - [Running the Application](#4-run-the-app)
3. [Development Progress](#progress)
    - [April 23, 2025](#23-04-2025)
    - [April 24, 2025](#24-04-2025)
    - [April 25-26, 2025](#25-26-042025)
4. [Future Features](#features-to-implement)
---
## Getting Started:
### 1. Download the Backend Requirements:
    cd ./backend
    pip install -r requirements.txt

### 2. Download the Frontend Modules:
   
    cd ./frontend
    npm install
    
### 3. Create the .env Files:
#### Backend:
- In the backend folder, create a new file `.env`
- Copy and add this information: 
    ```dotenv
    DB_NAME=your_db
    DB_USER=your_user
    DB_PASSWORD=your_password
    DB_HOST=localhost
    DB_PORT=5432
    ```
#### Frontend:
- Go to frontend folder, create a new file\ `.env`
- Copy and add this information:
    ```REACT_APP_API_URL=http://localhost:8000```
### 4. DB Configuration:
- Insure that the DB tables are with correct names and types and also have data.
- Cloud connection option is soon available.
### 5. Run the App
- Open the Terminal and start the backend server:
```bash
        cd ./backend
        python manage.py runserver
```
- Open **another** Terminal and start the frontend development server:
```bash
        cd ./frontend
        npm start
```
---

### Progress
23-04-2025:
Currently
- Struggling to use Postman effectively for testing.
- Issues with user login and system authentication.
- Need to streamline the registration process, including proper redirection.
- Error handling and resolving internal server errors (500s) require optimization.

Potential root cause:
- User storage after registration might be problematic due to the use of two databases:
    - **SQLite3**: For read-write operations (user login, registration, and authentication).
    - **PostgreSQL**: For read-only operations (data retrieval for dashboard showcase).
---
24-04-2025:
- Problems : 
    - enable login with username or email
    - routing : if user is already authentified why he has to be routed to login page again (bad management of cookies, session , jwt) if user is authentified it automaticlly routed to the main page 
    - if user authentified or authenticated it redirects him to main page
    - enable the logout
    - enhance the UI : highlight the input box with red

25-26/04/2025:
- We have been through a lot in these two days but mainly it's about the frontend improuving :
    - Enhanicng the UI/UX : Login and Registre Page (there's lot to say about this line)
    - Implementing an Auth context
    - Implementing a proper Routing and Session Managment
    - Cleaning and orgnizing The project structure
    - Documenting

## Features to Implement:
### 1. NPS Overview Page
- [x] Create the frontend components
- [x] Create the frontend data visualization (needs customization)
- [ ] Create the DB view for the NPS overview page
- [ ] Create the backend endpoints (views, urls, serializers)
- [ ] Create the frontend endpoints

### 2. NPS Map Page
- [ ] Create the DB view for the NPS Map page
- [ ] Create the backend endpoints (views, urls, serializers)
- [ ] Create the frontend components
- [ ] Create the frontend endpoints
- [ ] Create the frontend data visualization

### Map Features
- [ ] Interactive choropleth
- [ ] Filtering and search functionality
- [ ] Toggle controls between city and region
- [ ] Hover functionality to show:
  - Region name
  - Average NPS
  - Response count
- [ ] Legend with color scale for NPS

### 3. NPS Trends (Bar Chart Page)
- [ ] Title: "NPS Score Over Time"
- [ ] Controls:
  - Date range selector
  - Granularity toggle (day/week/month)
- [ ] Bar chart of NPS value per period

### 4. Demographics Section

#### 4.1 By Age Group
- [ ] Title: "NPS by Age Group"
- [ ] Chart: Bar chart (age groups on X, avg NPS on Y)
- [ ] Table: Counts and NPS per group

#### 4.2 By Survey Type
- [ ] Title: "Survey Type Performance"
- [ ] Chart: Grouped bar showing count vs NPS per type
- [ ] Filters: Select survey types to compare

#### 4.3 By Question Type
- [ ] Title: "Responses by Question Number"
- [ ] Chart: Bar chart of counts or avg score per question

Annotations: Highlight significant drops or peaks
- Real Data Integration From DB
- Advanced Data Filtering and Search
- Prevelege and Authorization Levels (Admin,Agent) -Aymen-
- Data Cashing featues -Aymen-
- Remeber me Func -Aymen-
- Session Management
- Testing : Unit Testing
- Enhance security and performance.
- Enahance Logging and Error handling
- Data Visualization Customization
- App appearence parameteres and UI Customization
- Report Generation and Export -Aymen-
- User Profile Management -Aymen-
- CSRF Protection
- PWA and offline support
- CSRF Protection

> **Important🚨** : Contact the team before editing the code, or create a new branch. or just code, YOU ARE FREE.

> **Note📝**: Do **not** commit the `.env` file. Add it to `.gitignore`.
