import React from "react"
import {Registration} from "../../API/register.js"
import '../register/style.css'
import logo from "./logo.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
const Register = () => {
   
   const [error, seterror] =useState(null)
   const navigate = useNavigate()

   const handleSubmet = async (e) =>{
     const response = await Registration(e)
     if(!response){
      seterror("probléme de connexion")
     }else{
      if(response.status == 200){
         console.log("Utilisateur connecté :", response);
         navigate('/Login')
      }else{
         seterror("email or username already exists")}
         setTimeout(() =>{
            seterror("")
         },5000)
     }
      
   }

    return(
       <div className="element">
          <form onSubmit={handleSubmet} className="FORM">
               <header>
                  <img src={logo} />
                  <h1>Registration</h1>
                  <p className="header">please enter your information</p>
               </header>
               <div className="info">
                  
                  <div className = "name">
                     <label>name</label>
                   <input type="text" placeholder="enter your name..." name="name" />
                  </div>

                  <div className="surname">
                   <label>surname</label>
                   <input type="text" placeholder="enter your surname" name="surname" />
                  </div>

                  <div className="email">
                   <label>email</label>
                   <input type="text" placeholder="enter your email..." name="email" /> 
                  </div>

                  <div className="username">
                   <label>username</label>
                   <input type="text" placeholder="enter your username..." name="username"/>
                  </div>

                  <div className="password">
                     <label>password</label>
                   <input type="password" placeholder="enter your password..." name="password" />
                  </div>

               </div>

               <div className="dicerreur">
                  {error && <p className="erreur">{error}</p>}
               </div>
               <footer> 
                  <button type="submit" className="button2"> <p className="p">register</p></button>
                  <p className="paragraph">do you have an account ? <Link to="/login" className="link">Login</Link></p>
               </footer>

            </form>
       </div>

    )}

export default Register