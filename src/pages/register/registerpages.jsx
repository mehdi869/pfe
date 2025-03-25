import React from "react"
import {Registration} from "../../API/register.js"
import '../register/style.css'
import logo from "./logo.png"
const Register = () => {
    return(
       <div className="element">
          <form onSubmit={Registration}>
                <header>
                  <img src={logo} />
                  <h1>Registration</h1>
                  <p className="header">please enter your information</p>
                </header>
                <div className="info">
                  <input type="text" placeholder="name" name="name"/>
                  <input type="text" placeholder="surname" name="surname"/>
                  <input type="text" placeholder="email" name="email"/>
                  <input type="text" placeholder="username" name="username"/>
                  <input type="text" placeholder="password" name="password"/>
               </div>
               <footer> 
                  <button type="submit" className="button2"> <p className="p">register</p></button>
                  <p className = "p" >do you have an account ? <a href="#" className="a">Login</a></p>
               </footer>

            </form>
       </div>

    )}

export default Register