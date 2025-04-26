export const Log = async (e) => {
 
  e.preventDefault()

  const username = e.target.username.value;
  const password = e.target.password.value;

  try{
        const response = await fetch("http://localhost:8000/login/",{
     
         method : "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body :  JSON.stringify({username,password})
         })
         return response
     }catch(error){
       console.log("probléme de connexion front-back")
     }
}

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