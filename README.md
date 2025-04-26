# NPS Web App : corrected and clean version

## Getting Started :
### 1. Download the Backend requirements :
    ```bash
    cd ./backend
    pip install -r requirements.txt
    ```

### 2. Download the Frontend modules :
    ```bash
    cd ./frontend
    npm install
    ```
### 3. Create the .env files :
#### Backend:
- in backend folder create new file ``.env``
- copy and add these infos : 
    ```dotenv
    DB_NAME=your_db
    DB_USER=your_user
    DB_PASSWORD=your_password
    DB_HOST=localhost
    DB_PORT=5432
    ```
#### Frontend:
- go now to forntend create new file ``.env``
- copy and add these infos :
    ```REACT_APP_API_URL=http://localhost:8000```

#### 4. Run the app:
- open the Terminal and Start the backend server:
```bash
        cd ./backend
        python manage.py runserver
```
- open **another** Terminal and Start the frontend development server:
```bash
        cd ./frontend
        npm start
```
---

### Progress
23-04-2025:
I'm currently facing challenges with registration and authentication. Specifically:
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

### Features to Implement:
- Prevelege and Authirization Levels (Admin,Agent) -Aymen-
- Data Cashing featues -Aymen-
- Remeber me Func -Aymen-
- Session Management
- Enhance security and performance.
- Enahance Logging and Error handling

> **Important🚨** : Contact the team before editing the code or create a new branch or just code, YOU ARE FREE.
> **Note**: Do **not** commit the `.env` file. Add it to `.gitignore`.
