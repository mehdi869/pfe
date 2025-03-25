export const Registration = async(e) => {
 
    e.preventDefault()

    const name = e.target.name.value
    const surname = e.target.surname.value
    const email = e.target.email.value
    const username = e.target.username.value
    const password = e.target.password.value


    try{
        const response = await fetch("http://localhost:8000/register/",{
            method : "POST",
            headers :{
                "Content-Type": "application/json",
            },
            body : JSON.stringify({name,surname,email,username,password})
        })
   
    }catch(error){
      console.log("error") 
    }
        
}