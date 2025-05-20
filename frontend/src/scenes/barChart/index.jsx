import React from "react";
import { useState,useEffect, useContext } from "react";
import {fetchStatus} from "../../API/api.js"
import { Bar } from 'react-chartjs-2';
import groupe from '../chart/profil.png'
import { Doughnut } from 'react-chartjs-2';
import { XCircle, Lightbulb, CheckCircle} from 'lucide-react';

import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';


// Enregistrez les composants nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, 
  ArcElement
); 
 
export const StatusChart =  () => {
    const [data,setdata] = useState({ list: [],
       count: 0 ,
        null: 0,
         somme: 0,
          list_status:[]
        })
    
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
    
    const colors_background = data.list.map((_, index) => index % 2 === 0 ? '#FF6666' : '#E60000');
    const colors_border = data.list.map((_, index) => index % 2 === 1 ? '#FF6666' : '#E60000');

    const chart = {
        labels : data.list.map(item => item.status),
        datasets: [
            {
              label: 'status de 2021 vers 2023',
              data:data.list.map(item=> parseInt(item.total)),
              backgroundColor: colors_background ,
              borderColor: colors_border ,
              borderWidth: 2,
            },
          ],
         }

    const chart_cercle = {
  labels: data.list_status.map(item => item.status),
  datasets: [{
    data: data.list_status.map(item => item.total),
    backgroundColor: [
      '#E60000',
      '#FF6666',
      '#E60000',
      '#FF6666',
      '#E60000',
      '#FF6666'
    ]
  }],

};

const cerclechartOptions = {
  plugins: {
    legend: {
      position: 'top',       
      align: 'center',    
      labels: {
        boxWidth: 20,
        padding: 10
      }
    },
    
  }
};


    
    return(
        <div style={{
          display : 'grid',
          gridTemplateRows: '15% 1fr',
          width: '100%',
          height: '90%'
          }}>
           <div style={{
            display :'grid',
            gridTemplateColumns:'1fr 1fr 1fr 1fr'
            }}>
                <div style={{
                   backgroundColor:'white',
                   margin :'5px',
                   borderRadius: '10px'
                   }}>
                   <div style= {{
                    display: 'flex',
                    flexDirection: 'Row',
                    padding:'25px'
                    }}>
                     <img src={groupe}/>
                     <div style={{display: 'flex',
                       flexDirection: 'column',
                        justifyContent: 'center',
                         alignItems: 'start',
                         marginLeft:'20px'
                         }}>
                       <p style={{
                        color:"black" ,
                        margin :'0px', 
                        fontSize:'24px', 
                        fontWeight:'bold'
                        }}>{data.count}</p>
                       
                       <p style={{
                        margin :'0px',
                        fontSize:'14px',
                        color: '#888'
                        }}>nombre total des reponses</p>
                     </div>
                   </div>

                </div>
                <div style={{
                   backgroundColor:'white',
                   margin :'5px',
                   borderRadius: '10px',
                  }}>
                  <div style ={{
                    display: 'flex', 
                    flexDirection: 'row',
                    padding:'25px'
                    }}>

                    <XCircle style={{color:"red", width:"50px", height:"50px"}}/>
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
                  }}>
                    <div style={{display: 'flex', flexDirection: 'row',padding:'25px'}}> 
                     <CheckCircle style={{color:"green", width:'50px',height:'50px'}} />
                     <div style={{display: 'flex',flexDirection : 'column', justifyContent: 'center', alignItems: 'start',marginLeft:'20px'}}>
                       <p style={{color:"black",margin :'0px',fontSize:'24px', fontWeight:'bold'}}> {data.somme}</p>
                       <p style={{color:"#888",margin :'0px',fontSize:'14px'}}>reponse valide</p>
                     </div>
                    </div> 
                 </div>
                 <div style={{
                  backgroundColor:'white',
                   margin :'5px',
                   borderRadius: '10px',
                   display:'flex',
                   flexDirection: 'row',
                   padding:'25px'
                  }}>
                   <Lightbulb style={{color:'black', width:'50px', height:'50px'}}/>
                   <div style={{paddingLeft :'5%'}}>
                    <p style={{color:"black",margin :'0px', fontFamily:"'Poppins', sans-serif" ,fontSize:'24px', fontWeight:'bold'}}> {data.somme}</p>
                    <p style={{color:"#888",margin :'0px', fontFamily:"'Poppins', sans-serif",fontSize:'14px'}}>nombre de status possible</p>
                   </div>
                 </div>
           </div>
            <div style={{display:'grid', gridTemplateColumns: '60% 40%' ,gridTemplateRows:'95%' }}>
             <div style={{backgroundColor:'white', margin :'5px',borderRadius:'10px',diplay:'flex', justifyContent:'center', alignItems:'center'}}>
              <h1 style = {{color:"#888", paddingLeft:"25px"}}>Histogramme des status</h1>
              <Bar data={chart} options={chart.options}></Bar>
             </div>
             <div style={{margin :'5px', borderRadius:'10px', display:'grid', gridTemplateRows:'50% 50%'}}>
               
               <div style={{backgroundColor:'white', borderRadius:'10px',marginBottom : '5px'}}>
                  <h1 style={{color : '#888', paddingLeft:"25px"}}>tableau des status</h1>
                  <div style={{width:'100%', height:'100%'}}>
                    <table style={{width:'100%',height: '75%',borderCollapse: 'collapse'}}>
                      <thead>
                       <tr style={{backgroundColor:'#E60000'}}>
                         <th><div style={{color:'white', fontWeight:'bold',fontSize:'20px' ,display : 'flex',justifyContent:'start',paddingLeft:'30%'}}>#</div></th>
                         <th><div style={{color:'white', fontWeight:'bold',fontSize:'15px' ,display : 'flex',justifyContent:'start',paddingLeft:'30%'}}>Status</div></th>
                         <th><div style={{color:'white', fontWeight:'bold',fontSize:'15px' ,display : 'flex',justifyContent:'start',paddingLeft:'30%'}}>Total</div></th>
                   </tr>
                     </thead>
                     <tbody>
                       {data.list_status.map((item, index) => (
                         <tr key={index} style={{ backgroundColor: index % 2 === 1 ? '#FF6666' : '#ffffff' }}>
                           <td><div style={{display:'flex',justifyContent:'start',alignItems:'center', paddingLeft:'30%',color:"black",color: index % 2 === 1 ? '#ffffff' : 'black',fontWeight:"bold"}}>0{index + 1}</div></td>
                           <td><div style={{display:'flex',justifyContent:'start',alignItems:'center', paddingLeft:'30%',color:"black",color: index % 2 === 1 ? '#ffffff' : 'black',fontWeight:"bold"}}>{item.status}</div></td>
                           <td><div style={{display:'flex',justifyContent:'start',alignItems:'center', paddingLeft:'30%',color:"black",color: index % 2 === 1 ? '#ffffff' : 'black',fontWeight:"bold"}}>{item.total}</div></td>
                         </tr>
                       ))}
                     </tbody>
                    </table>
                  </div>
               </div>
               
               <div style = {{backgroundColor:'white',borderRadius:'10px',marginTop : '5px',display:'flex',flexDirection:'column',  justifyContent:'center',alignItems:'center'}}>
                  <h1 style={{color:"#888",marginTop:'5%'}}>Status Analysis (Doughnut Visualization)</h1>
                  <div style={{width:'80%',height:'80%',display:'flex', justifyContent:'center',alignItems:'center', marginBottom:'5%'}}>
                    <Doughnut data={chart_cercle} options={cerclechartOptions}> 
                    </Doughnut>
                  </div>
               </div>
               </div>
             </div>
            </div>

    )
}