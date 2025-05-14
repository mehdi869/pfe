import { useState,useEffect } from "react";
import {fetchStatus} from "../../API/api.js"
import { Bar } from 'react-chartjs-2';
import groupe from '../chart/profil.png'
import valide from '../chart/check_1828640.png'
import crois from '../chart/erreur.png'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Enregistrez les composants nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
); 
 
export const StatusChart =  () => {
    const [data,setdata] = useState({ list: [], count: 0 , null: 0, somme: 0})
    
    // const location = useLocation()
    useEffect(() => {
        const fetchData = async () => {
          
         try{
          const response = await fetchStatus()
          if(!response.ok){
            throw new Error('erreur dans le serveur')
          }else if(response.status!==200){
            throw new Error('envoie est fait mais pas le status')
          }else{
            const Dataresponse = await response.json()
            setdata(Dataresponse);
          }
         }catch(error){
           throw new Error('error')
         }
         }
         fetchData();

    },[])
    
    const chart = {
        labels : data.list.map(item => item.status),
        datasets: [
            {
              label: 'Ventes 2023',
              data:data.list.map(item => parseInt(item.total)),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
    }

    return(
        <div style={{display : 'grid', gridTemplateRows: '15% 1fr', width: '100%', height: '90vh'}}>
           <div style={{display :'grid', gridTemplateColumns:'1fr 1fr 1fr'}}>
                <div style={{
                   backgroundColor:'white',
                   margin :'5px',
                   borderRadius: '10px'}}>
                   <div style= {{display: 'flex', flexDirection: 'Row',padding:'25px'}}>
                     <img src={groupe}/>
                     <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start',marginLeft:'20px'}}>
                      <p style={{color:"black" ,margin :'0px', fontSize:'20px', fontWeight:'bold'}}>{data.count}</p>
                      <p style={{margin :'0px',fontSize:'14px',color: '#888'}}>nombre total des reponses</p>
                     </div>
                   </div>

                </div>
                <div style={{
                   backgroundColor:'white',
                   margin :'5px',
                   borderRadius: '10px',
                  }}>
                  <div style ={{display: 'flex', flexDirection: 'row',padding:'25px'}}>
                    <img src ={crois} />
                    <div style={{display: 'flex',flexDirection : 'column', justifyContent: 'center', alignItems: 'start',marginLeft:'20px'}}>
                     <p style={{color:"black",margin :'0px', fontSize:'24px', fontWeight:'bold'}}> {data.null}</p>
                     <p style={{margin :'0px', color:'#888', fontSize:'14px'}}>reponse non validee</p>
                    </div>
                  </div>
                </div>
                <div style={{
                  backgroundColor:'white',
                  margin :'5px', 
                  borderRadius: '10px', 
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'}}>
                  <div> 
                    <img src={valide} />
                    <p style={{color:"black",margin :'0px', fontFamily:"'Poppins', sans-serif"}}>reponse valide</p></div> 
                    <p style={{color:"black",margin :'0px', fontFamily:"'Poppins', sans-serif"}}> {data.somme}</p>
                 </div>
           </div>
            <div style={{width:'50%', marginTop:'100px'}}>
             <Bar data={chart}></Bar>
            </div>

        </div>
    )
}