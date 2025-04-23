import React from "react"
import '../login/login.css'
import {Log} from '../../API/api'
import {useState} from "react"
import { useNavigate} from "react-router-dom" 
import { Link } from "react-router-dom"
import Register from "../register/registerpages"
const Login = () => {
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        const response = await Log(e);
        if (!response) {
            setError("Connexion échouée");
        }else{
            if(response.status == 200){
                console.log("Utilisateur connecté :", response);
                navigate('/Dashboard')
                
            }else{
                setError("please verify your informations ")
                
                setTimeout(() =>{
                    setError("")
                },5000)
            }
        }
    };
    
    return(
     <div className="body1">
        <form onSubmit={handleSubmit} className="form1">
            <div className="login1">
             <p className="text">Welcome Back</p>
             <p className="text2">Please enter your infomation to Login</p>
            </div>
            

            <div className="input1">
                <div className="labels1">
                    <label>username</label>
                    <input type="text" placeholder="please enter your username...." name="username" />
                </div>
                
                <div className="labelpassword">
                 <label>password</label>
                 <input type="password" placeholder="please enter your password...." name="password" />
                </div>
            </div>
            <div className="diverror">
                {error && <p className="error">{error}</p>}
            </div>
            <div className="input3">
                <button type="submit" className="but"><p className="buttonlogin">Login</p></button>
                <p id="account">you don't have an account ? <Link to="/register">register</Link></p>
            </div>
            
        </form>
     </div>
    )
}
export default Login