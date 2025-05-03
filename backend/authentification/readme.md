# 🔐 Authentication System Documentation 🔐

## 📋 Table of Contents
1. [Backend Implementation](#backend-implementation)
2. [Frontend Implementation](#frontend-implementation)
3. [Endpoint Security Verification](#endpoint-security-verification)
4. [Improvement Recommendations](#improvement-recommendations)
5. [Security Checklist](#security-checklist)
6. [Extending Features with Authentication](#extending-features)

## 🖥️ Backend Implementation <a id="backend-implementation"></a>

### 🛠️ Core Components

*   **Framework:** Django with Django REST Framework and `rest_framework_simplejwt` for JWT handling.
*   **User Model:** `authentification.User` extending Django's `AbstractUser`.

### ⚙️ Configuration Settings

*   **Settings (`backend/core/settings.py`):**
    *   ✅ `DEFAULT_AUTHENTICATION_CLASSES` is set to `JWTAuthentication`.
    *   🔒 `DEFAULT_PERMISSION_CLASSES` is set to `IsAuthenticated`, securing most endpoints by default.
    *   ⏱️ `SIMPLE_JWT` settings configure token lifetimes (Access: 30min, Refresh: 1day) and enable `BLACKLIST_AFTER_ROTATION`.
    *   👤 `AUTH_USER_MODEL` correctly points to `authentification.User`.
    *   🌐 `corsheaders` middleware is present and configured (`CORS_ALLOW_ALL_ORIGINS = True`, `CORS_ALLOW_CREDENTIALS = True`). Consider restricting origins in production.
    *   🚨 `CsrfViewMiddleware` is commented out, which is typical for stateless JWT APIs but needs review if HttpOnly cookies are used.

### 🔌 API Endpoints

*   **Endpoints (`backend/authentification/urls.py`, `backend/authentification/views.py`):**
    *   🔑 `/login/`: Uses standard `TokenObtainPairView` to issue tokens. (Permissions: `AllowAny` implicitly by view).
    *   📝 `/register/`: Uses custom `RegisterView` (`generics.CreateAPIView`). Uses `api.serializers.UserSerializer` (ensure this handles password hashing). Returns user data and new tokens upon success (auto-login). (Permissions: `AllowAny`).
    *   🚪 `/logout/`: Custom function view `logout_view`. Attempts to blacklist the provided refresh token. (Permissions: `AllowAny`). **⚠️ Requires Verification:** Check if `rest_framework_simplejwt.token_blacklist` is in `INSTALLED_APPS` and migrations are run for blacklisting to work.
    *   🔄 `/refresh/`: Uses standard `TokenRefreshView`. (Permissions: `AllowAny` implicitly by view).
    *   ✓ `/token/verify/`: Uses standard `TokenVerifyView`. (Permissions: `AllowAny` implicitly by view).
    *   🛡️ `/protected/`: Example view `protected_view` requiring authentication (`IsAuthenticated`).

*   **Other Endpoints:** Any endpoints in `api/` or `data/` apps will require authentication due to the default permission class, unless explicitly overridden with `permission_classes`.

## 🌐 Frontend Implementation <a id="frontend-implementation"></a>

### 🧠 State Management

*   **State Management (`frontend/src/context/AuthContext.jsx`):**
    *   🧩 `AuthContext` manages `isAuthenticated`, `isLoading`, and `accessToken`.
    *   💾 `accessToken` is stored in component state (memory).
    *   📦 `refreshToken` is stored in `localStorage`.
    *   🔄 `checkAuthStatus` effect attempts to refresh the access token using the stored refresh token on initial load.
    *   🔑 `login` function updates state and stores the refresh token.
    *   🚪 `logout` function calls the backend `/logout/` endpoint and clears local state/storage.

### 🧭 Routing & Navigation

*   **Routing (`frontend/src/App.jsx`):**
    *   🛣️ Uses `react-router-dom`.
    *   🔓 `PublicRoute` redirects authenticated users away from login/register.
    *   🔒 `ProtectedRoute` redirects unauthenticated users away from the main app to login. (Assumes standard implementation checking `isAuthenticated` from context).

### 📝 Authentication Forms

*   **Login/Register:**
    *   🔑 `Login`: Calls API `Log` (`frontend/src/API/api.js`), uses `AuthContext.login` on success.
    *   📝 `Register`: Calls API `Registration` (`frontend/src/API/register.js`). **⚠️ Needs Improvement:** Uses `setIsAuthenticated(true)` directly instead of `AuthContext.login` with the tokens returned by the backend.

### 📡 API Communication

*   **API Calls (`frontend/src/API/api.js`):**
    *   🔑 `Log`: Handles login API call.
    *   🚪 `Logout`: Handles logout API call.
    *   📊 `fetchQuestionTypeStats`: Example authenticated API call. **⚠️ Needs Improvement:** Reads `accessToken` from `localStorage` instead of `AuthContext` state. Other authenticated calls likely need similar correction.

## 🔍 Endpoint Security Verification <a id="endpoint-security-verification"></a>

*   **Public Endpoints:**
    *   ✅ Login (`/login/`), Register (`/register/`), Logout (`/logout/`), Refresh (`/refresh/`), Verify (`/token/verify/`): Correctly allow anonymous access.
  
*   **Protected Endpoints:**
    *   ✅ Protected Example (`/protected/`): Correctly requires authentication.
    *   ⚠️ `/barchart/` (from `fetchQuestionTypeStats`): Needs verification. Assuming it's defined in views.py without specific `permission_classes`, it **should** require authentication due to the default setting in settings.py. Verify this view's definition.
    *   🔍 All other API/Data endpoints: Verify they don't accidentally override `permission_classes` to `AllowAny` if they handle sensitive data or actions.

## 🚀 Improvement Recommendations <a id="improvement-recommendations"></a>

The authentication system is functional but requires improvements for security and robustness:

1.  **🔄 Backend Token Blacklisting:** Ensure `rest_framework_simplejwt.token_blacklist` is in `INSTALLED_APPS` in settings.py and run migrations. Otherwise, logout doesn't invalidate refresh tokens on the backend.

2.  **🔒 Secure Token Storage:** Storing refresh tokens in `localStorage` (`frontend/src/context/AuthContext.jsx`) is vulnerable.
    *   **Recommendation:** Use HttpOnly cookies for refresh tokens (requires backend changes to set cookies and frontend changes for `credentials: 'include'`).

3.  **🛡️ CSRF Protection:** If using HttpOnly cookies (Improvement #2), enable and configure CSRF protection on the backend (`backend/core/settings.py`) and ensure the frontend sends the CSRF token.

4.  **📝 Frontend Registration Logic:** Update `Register` to use `AuthContext.login(access, refresh)` with the tokens returned from the successful backend registration response, instead of just `setIsAuthenticated(true)`.

5.  **🔑 Frontend API Access Token Usage:** Modify authenticated API calls (like `fetchQuestionTypeStats`) to retrieve the `accessToken` from `AuthContext` state, not `localStorage`. Consider a centralized API client or interceptor.

6.  **⏱️ Session Expiration Handling:** Implement automatic access token refresh using the refresh token when API calls return a 401 Unauthorized error. This typically involves an API interceptor on the frontend.

7.  **🔍 Endpoint Verification:** Double-check the permission classes for all backend views, especially `/barchart/` and others in the `api` and `data` apps, to ensure they are correctly protected.

## ✅ Security Checklist <a id="security-checklist"></a>

- [ ] Token blacklisting configuration verified
- [ ] Refresh tokens stored securely (HttpOnly cookies)
- [ ] CSRF protection enabled for cookie-based authentication
- [ ] Registration flow properly integrates with auth context
- [ ] API calls use tokens from AuthContext (not localStorage)
- [ ] Automatic token refresh implemented for expired sessions
- [ ] All endpoints verified for correct permission settings
- [ ] CORS settings restricted for production environment

## ✨ Extending Features with Authentication <a id="extending-features"></a>

Adding new features that require user authentication follows a standard pattern:

### 1. Backend: Create the View

Define your view in the relevant Django app's `views.py` (e.g., [`backend/api/views.py`](../api/views.py)). Ensure you include the necessary permission class:

*   **Class-Based View (CBV):**
    ```python
    # filepath: backend/api/views.py
    from rest_framework import generics
    from rest_framework.permissions import IsAuthenticated
    from .models import YourModel # Import your model
    from .serializers import YourSerializer # Import your serializer

    class MyNewProtectedListView(generics.ListAPIView):
        queryset = YourModel.objects.all()
        serializer_class = YourSerializer
        permission_classes = [IsAuthenticated] # <-- Requires authentication

        # Optional: Filter queryset based on the authenticated user
        # def get_queryset(self):
        #     user = self.request.user
        #     return YourModel.objects.filter(owner=user)
    ```

*   **Function-Based View (FBV):**
    ```python
    # filepath: backend/api/views.py
    from rest_framework.decorators import api_view, permission_classes
    from rest_framework.permissions import IsAuthenticated
    from rest_framework.response import Response
    from rest_framework import status

    @api_view(['GET'])
    @permission_classes([IsAuthenticated]) # <-- Requires authentication
    def my_new_protected_function_view(request):
        # Access the authenticated user via request.user
        user = request.user
        # ... your logic here ...
        data = {"message": f"Hello {user.username}, this is protected data!"}
        return Response(data, status=status.HTTP_200_OK)
    ```

### 2. Backend: Add URL Pattern

Register the view in the corresponding `urls.py` (e.g., `backend/api/urls.py`):

```python
# filepath: backend/api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # ... other urls
    path('my-new-feature/', views.MyNewProtectedListView.as_view(), name='my-new-feature-list'),
    path('my-other-feature/', views.my_new_protected_function_view, name='my-other-feature'),
]
```

### 3. Frontend: Create API Call Function

Add a function in your frontend API service (e.g., [`api.js`](/../../frontend/src/API/api.js)) to call the new endpoint. Crucially, you must include the `Authorization` header with the access token from the `AuthContext`.

```javascript
// filepath: frontend/src/API/api.js
import axios from 'axios'; // Or your preferred HTTP client

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000'; // Use env variable

// Function to get the access token (ideally from AuthContext)
// This is a simplified example; integrate properly with your AuthContext
const getAuthHeaders = (accessToken) => {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
};

// Example API call function
export const fetchMyNewFeatureData = async (accessToken) => {
  if (!accessToken) {
    console.error("Access token is missing for authenticated request");
    // Handle missing token (e.g., redirect to login or throw error)
    throw new Error("Authentication required");
  }
  try {
    const response = await axios.get(`${API_URL}/api/my-new-feature/`, { // Ensure correct full URL
      headers: getAuthHeaders(accessToken),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my new feature data:", error.response || error.message);
    // Handle errors, e.g., check for 401 Unauthorized for token refresh logic
    if (error.response && error.response.status === 401) {
      // Trigger token refresh logic here if implemented
      console.log("Token might be expired, attempt refresh?");
    }
    throw error; // Re-throw error for the component to handle
  }
};

// ... other API functions ...
```

### 4. Frontend: Use in Component

In your React component, use the `AuthContext` to get the `accessToken` and call the API function.

```jsx
// Example Component
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Adjust path
import { fetchMyNewFeatureData } from '../API/api';