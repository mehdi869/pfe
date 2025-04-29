export const Log = async (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;

  try {
    const response = await fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    // Parse and return JSON if successful
    if (response.ok) {
      return await response.json();
    } else {
      // Try to parse error details
      let errorData = { detail: `HTTP error! status: ${response.status}` };
      try {
        errorData = await response.json();
      } catch {}
      const error = new Error(errorData.detail || `Login failed with status ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
  } catch (error) {
    console.log("probléme de connexion front-back");
    throw error;
  }
};

export const fetchQuestionTypeStats = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:8000/barchart/', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.question_types) {
      throw new Error('Format de réponse invalide');
    }

    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error; // Important pour que le composant puisse catcher l'erreur
  }
};

export const Logout = async (setIsAuthenticated) => {
  try {
    const response = await fetch("http://localhost:8000/logout/", {
      method: "POST",
      credentials: "include",
    });
    
    if (response.status === 200) {
      setIsAuthenticated(false);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};