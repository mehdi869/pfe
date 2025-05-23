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

export const fetchStatus = async (accessToken) => {
  
  const response =await fetch("http://localhost:8000/data/",{
    method: 'GET',
    headers: {
    'Content-Type' : 'application/json' // Corrected: 'content-Type' to 'Content-Type'
   }
  });
  
  return response
}

export const fetchNpsScore = async (accessToken) => { // Added accessToken parameter
  const response = await fetch("http://localhost:8000/nps/",{ // Added trailing slash for consistency
    method : 'GET',
    headers: { // Corrected: geaders to headers
      'Content-Type' : 'application/json', // Corrected: 'content-type', 'appliaction/json'
    }
  })

  return response
}

// export const fetchQuestionTypeStats = async (accessToken) => { // Added accessToken parameter
//   try {
//     // const accessToken = localStorage.getItem('accessToken'); // Removed: Get token from argument
//     if (!accessToken) {
//       throw new Error("Access token is not available for fetching question type stats.");
//     }
//     const response = await fetch('http://localhost:8000/barchart/', {
//       method: 'GET',
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${accessToken}`, // Use the passed accessToken
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Erreur HTTP: ${response.status}`);
//     }

//     const data = await response.json();

//     if (!data || !data.question_types) {
//       throw new Error('Format de réponse invalide');
//     }

//     return data;
//   } catch (error) {
//     console.error('Erreur API:', error);
//     throw error; // Important pour que le composant puisse catcher l'erreur
//   }
// };

export const Logout = async (logoutFromContext) => { // Changed parameter to reflect context usage
  try {
    const response = await fetch("http://localhost:8000/logout/", {
      method: "POST",
      headers: { // Added headers for consistency, and if backend expects refresh token in body
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: localStorage.getItem('refreshToken') }), // Assuming backend expects refresh token
      credentials: "include", // Keep if backend relies on cookies for session invalidation alongside token
    });
    
    if (response.ok) { // Check for response.ok instead of status === 200 for broader success cases
      logoutFromContext(); // Call the logout function from AuthContext
      return true;
    }
    // Attempt to parse error if not ok
    let errorData = { detail: `Logout failed with status ${response.status}` };
    try {
      errorData = await response.json();
    } catch {}
    console.error("Logout API error:", errorData.detail);
    return false;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};

export const fetchAgeChart = async ()=> {
  const response = await fetch("http://localhost:8000/age/",{ // Added trailing slash for consistency
    method : 'GET',
    headers: { // Corrected: geaders to headers
      'Content-Type' : 'application/json', // Corrected: 'content-type', 'appliaction/json'
    }
  })

  return response
}

export const fetchSurveyType = async () => {
  const response = await fetch("http://localhost:8000/survey/",{ // Added trailing slash for consistency
    method : 'GET',
    headers: { // Corrected: geaders to headers
      'Content-Type' : 'application/json', // Corrected: 'content-type', 'appliaction/json'
    }
  })
  return response
} 

export const fetchSurvey1Type = async () => {
  const response = await fetch("http://localhost:8000/survey_1/",{ // Added trailing slash for consistency
    method : 'GET',
    headers: { // Corrected: geaders to headers
      'Content-Type' : 'application/json', // Corrected: 'content-type', 'appliaction/json'
    }
  })

  return response
} 

export const fetchSurvey2Type = async () => {
  const response = await fetch("http://localhost:8000/survey_2/",{ // Added trailing slash for consistency
    method : 'GET',
    headers: { // Corrected: geaders to headers
      'Content-Type' : 'application/json', // Corrected: 'content-type', 'appliaction/json'
    }
  })

  return response
}


export const fetchSurvey3Type = async () => {
  const response = await fetch("http://localhost:8000/survey_3/",{ // Added trailing slash for consistency
    method : 'GET',
    headers: { // Corrected: geaders to headers
      'Content-Type' : 'application/json', // Corrected: 'content-type', 'appliaction/json'
    }
  })

  return response
}


export const fetchSurvey4Type = async () => {
  const response = await fetch("http://localhost:8000/survey_4/",{ // Added trailing slash for consistency
    method : 'GET',
    headers: { // Corrected: geaders to headers
      'Content-Type' : 'application/json', // Corrected: 'content-type', 'appliaction/json'
    }
  })

  return response
}

export const fetchSurvey5Type = async () => {
  const response = await fetch("http://localhost:8000/survey_5/",{ // Added trailing slash for consistency
    method : 'GET',
    headers: { // Corrected: geaders to headers
      'Content-Type' : 'application/json', // Corrected: 'content-type', 'appliaction/json'
    }
  })

  return response
}

export const fetchSurvey6Type = async () => {
  const response = await fetch("http://localhost:8000/survey_6/",{ // Added trailing slash for consistency
    method : 'GET',
    headers: { // Corrected: geaders to headers
      'Content-Type' : 'application/json', // Corrected: 'content-type', 'appliaction/json'
    }
  })

  return response
}

export const fetchSurvey8Type = async () => {
  const response = await fetch("http://localhost:8000/survey_8/",{ // Added trailing slash for consistency
    method : 'GET',
    headers: { // Corrected: geaders to headers
      'Content-Type' : 'application/json', // Corrected: 'content-type', 'appliaction/json'
    }
  })

  return response
}