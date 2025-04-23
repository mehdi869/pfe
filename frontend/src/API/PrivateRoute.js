import {useState} from 'react'
import {Log} from './api.js'

export const PrivateRoute = async (e) =>{
    const [auth,setauth] = useState("false")
    
    const response = await Log(e);
    if(response.status == 200){
        setauth("true")
    }
    
}