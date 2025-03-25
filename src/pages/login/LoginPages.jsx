import React from "react"
import '../login/login.css'
import {Log} from '../../API/api'
import {useState} from "react"
import {useNavigate} from "react-router-dom" 

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
                navigate('/dashboard')
                
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
                <input type="text" className="input" placeholder="username" name = "username" required/>
            </div>
            <div className="input2">
                <input type="password" placeholder="password" name = "password" required/>
            </div>
            <div className="diverror">
                {error && <p className="error">{error}</p>}
            </div>
            <div className="input3">
                <button type="submit"><p className="buttonlogin">Login</p></button>
            </div>
            <div className="input4">
                <p id="account">you don't have an account ? <a href="#">Register</a></p>
            </div>
        </form>
     </div>
    )
}
export default Login