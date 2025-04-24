# Frontend Web Standards Documentation

## Beginner Level

### 1. Exposed API / Hardcoded API : ``✅ Done``
Avoid hardcoding API URLs. Use environment variables for dynamic configuration and to separate development, staging, and production environments.

### 2. Input Validation : ``✅ Done``
Ensure all input fields are validated both client-side and server-side. Use a combination of HTML5 attributes and custom logic to enforce robust validation:

#### Key Validation Rules:``✅ Done``
- **Input Length**: Restrict the number of characters using the `maxlength` attribute or JavaScript validation.
- **Required Fields**: Use the `required` attribute to ensure mandatory fields are not left empty.
- **Input Type Restrictions**:
  - **Names**: Allow only alphabetic characters. Use regular expressions to validate.
    ```javascript
    const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name);
    ```
  - **Email Format**: Validate email addresses to ensure they follow standard formats.
    ```javascript
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    ```
  - **Username Blacklist**: Prevent the use of restricted usernames like `admin`, `root`, etc.
    ```javascript
    const isBlacklisted = (username) => ['admin', 'root'].includes(username.toLowerCase());
    ```

#### Best Practices:
- **Client-Side Validation**: Provide instant feedback to users for a better experience.
- **Server-Side Validation**: Always validate inputs on the server to prevent bypassing client-side checks.
- **Error Messaging**: Display clear and specific error messages for invalid inputs.
- **Reusable Validation Logic**: Centralize validation functions to maintain consistency across the application.
- **Accessibility**: Ensure error messages are accessible to screen readers and visually distinguishable.

#### Example Implementation:
```javascript
const validateForm = (formData) => {
  const errors = {};
  if (!formData.name || !isValidName(formData.name)) {
    errors.name = 'Name must contain only letters and spaces.';
  }
  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (isBlacklisted(formData.username)) {
    errors.username = 'This username is not allowed.';
  }
  return errors;
};
```

### 3. Input Length Restrictions : ``✅ Done``
Limit input character length using the `maxlength` attribute or JS validation to prevent buffer overflows and malicious input.

### 4. Lack of Character Filtering :``✅ Done``
Sanitize inputs to prevent XSS or injection attacks.
```javascript
const handleChange = (e) => {
  const value = e.target.value.replace(/[<>{}]/g, '');
  setFormData({ ...formData, comment: value });
};
```
Consider libraries like DOMPurify for sanitizing inputs before rendering.

### 5. No Client-Side Validation for Required Fields : ``✅ Done``
Use HTML5 `required` attribute or JS validation.
```html
<input type="text" name="name" required />
```

### 6. Real-Time Input Validation ``✅ Done``
Provide instant feedback to users using `onChange` or `onInput` handlers with visual cues (e.g., red borders, icons).

### 7. Missing Form Submission Feedback ``✅ Done``
Add a loading state to indicate progress.
```javascript
<button type="submit" disabled={isLoading}>
  {isLoading ? 'Submitting...' : 'Submit'}
</button>
```

### 8. Clear Form After Submission ``✅ Done``
Reset form state after successful submission.
```javascript
setFormData({ name: '' });
```

### 9. Improper Handling of Form Re-Submission ``✅ Done``
Prevent accidental resubmissions using disabled buttons or unique request IDs.
```javascript
e.target.querySelector('button').disabled = true;
```

### 10. No Protection Against CSRF in Forms ``🌀 Pending ``
Include and validate CSRF tokens in form submissions.
```html
<input type="hidden" name="_csrf" value="token" />
```
Ensure your backend framework supports CSRF validation.

## Intermediate Level

### 11. Loading Indicators ``✅ Done : but didn't tested`` 
Show loading spinners, progress bars, or skeleton screens while content is loading.

### 12. Errors Handling
Use `try/catch` blocks, global error boundaries, and alert components to inform users.

### 13. Centralized API Service
Create a module to handle requests (e.g., using Axios) to manage base URLs, headers, interceptors, and error handling.

### 14. Secure API Fetching
Avoid raw `fetch` without checks.
```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data', { credentials: 'include' });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

### 15. State Management
Use tools like React Context, Redux, Recoil, or Zustand to manage state across components effectively.

### 16. Error Boundary
Use React Error Boundaries to gracefully handle render-time crashes and show fallback UIs.

### 17. Responsive Design
Use CSS Grid, Flexbox, and media queries to adapt layouts to all screen sizes and devices.

### 18. Debouncing/Throttling for Input Events
Improve performance in high-frequency input handlers (like search).
```javascript
import { debounce } from 'lodash';
const handleSearch = debounce((value) => {
  fetch(`/api/search?q=${encodeURIComponent(value)}`);
}, 300);
```

### 19. Poor Error Handling for Form Submissions ``✅ Done : but haven't been tested`` 
Provide user feedback on API failure using messages, toasts, or modals.
```javascript
if (!response.ok) throw new Error('Submission failed');
```

## Advanced Level

### 20. Unit Testing
Write tests with Jest, React Testing Library, Vitest, or Cypress for components, logic, and integration.

### 21. Session Expiration Handling
Use Axios interceptors or fetch wrappers to detect 401 errors and refresh tokens silently or redirect to login.

### 22. Secure Storage for Tokens
Store sensitive tokens in HttpOnly cookies. Avoid using localStorage for storing access tokens.

### 23. Inefficient Rendering
Use memoization techniques (React.memo, useMemo, useCallback) to avoid unnecessary re-renders.
```javascript
const handleClick = useCallback(() => console.log(data), [data]);
```

### 24. Code Splitting
Use dynamic `import()` and React.lazy to load components only when needed.

### 25. Accessibility Features
Use semantic HTML, ARIA attributes, and ensure keyboard and screen reader support for all UI elements.

## Optional Features

### 26. PWA and Offline Support
Enable service workers, caching strategies (e.g., Workbox), and manifest files to make the app installable and offline-capable.
