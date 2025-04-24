import DOMPurify from 'dompurify';

const sanitizeInput = (value) => DOMPurify.sanitize(value);

const handleChange = (e) => {
  const sanitizedValue = sanitizeInput(e.target.value);
  setFormData({ ...formData, [e.target.name]: sanitizedValue });
};

const validateInputs = (name, surname, email, username, password) => {
    if (!name || !surname || !email || !username || !password) {
        throw new Error("All fields are required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameSurnameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameSurnameRegex.test(name) || !nameSurnameRegex.test(surname)) {
        throw new Error("Names should only contain letters, spaces, hyphens, and apostrophes.");
    }
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
    }
};

export const Registration = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const surname = e.target.surname.value;
    const email = e.target.email.value;
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
        // Validate inputs before making the API call
        validateInputs(name, surname, email, username, password);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, surname, email, username, password }),
        });

        // Check if the response is OK (status 200-299)
        if (response.ok) {
            return await response.json(); // Return the parsed JSON for success
        } else {
            // Parse the error response and throw it for the caller to handle
            const errorData = await response.json();
            throw new Error(errorData.error || "An unknown error occurred.");
        }
    } catch (error) {
        console.error("Error during registration:", error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};