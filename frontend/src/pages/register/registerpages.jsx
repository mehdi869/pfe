import React from "react"
import {Registration} from "../../API/register.js"
import '../register/style.css'
import logo from "./logo.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
const Register = () => {
   
   const [error, seterror] =useState(null)
   const [formData, setFormData] = useState({});
   const navigate = useNavigate()
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async (e) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
        const response = await Registration(e);
        console.log("Registration successful:", response);
        navigate("/Dashboard");
    } catch (error) {
        seterror(error.message); // Display the error message to the user
        setTimeout(() => {
            seterror("");
        }, 5000);
    } finally {
        setIsSubmitting(false);
    }
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    seterror("Invalid email format");
  } else {
    seterror(null);
  }
  setFormData({ ...formData, [name]: value });
};

    return(
       <div className="element">
          <form onSubmit={handleSubmit} className="FORM">
               <header>
                  <img src={logo} />
                  <h1>Registration</h1>
                  <p className="header">please enter your information</p>
               </header>
               <div className="info">
                  
                  <div className = "name">
                     <label>name</label>
                   <input type="text" placeholder="enter your name..." name="name" maxLength={20} required onChange={handleInputChange}/>
                  </div>

                  <div className="surname">
                   <label>surname</label>
                   <input type="text" placeholder="enter your surname" name="surname" maxLength={20} required onChange={handleInputChange}/>
                  </div>

                  <div className="email">
                   <label>email</label>
                   <input type="email" placeholder="enter your email..." name="email" required onChange={handleInputChange}/> 
                  </div>

                  <div className="username">
                   <label>username</label>
                   <input type="text" placeholder="enter your username..." name="username" maxLength={15} required onChange={handleInputChange}/>
                  </div>

                  <div className="password">
                     <label>password</label>
                   <input type="password" placeholder="enter your password..." name="password" minLength={4} required onChange={handleInputChange}/>
                  </div>

               </div>

               <div className="dicerreur">
                  {error && <p className="erreur">{error}</p>}
               </div>
               <footer> 
                  <button type="submit" className="button2" disabled={isSubmitting}> <p className="p">register</p></button>
                  <p className="paragraph">do you have an account ? <Link to="/login" className="link">Login</Link></p>
               </footer>

            </form>
       </div>

    )}

export default Register