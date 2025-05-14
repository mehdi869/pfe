import React from "react";
import {fetchNpsScore} from "../../API/api.js"
import { useState,useEffect } from "react";
import { Bar } from 'react-chartjs-2';
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


export const NpsChart = () => {

    let [data,setdata] = useState([])
    useEffect(() => {
        const fetchdata = async () => {
            try{
                const response = await fetchNpsScore()
                if(!response.ok){
                    throw new Error('erreur dans le démarage du serveur')
                }else if (response.status !== 200){
                    throw new Error('envoie est fait mais probleme dans le serveur')
                }else{
                    const dataresponse = await response.json()
                    setdata(dataresponse)
                }
            }catch(error){
              console.log('probléme de connextion front-back')   
            }
        }
        fetchdata()
    },[])

    data = Object.entries(data)
    const barchart = {
        labels: data.map(([key]) => key),
        datasets: [
          {
            label: 'Ventes 2023',
            data: data.map(([key, valeur]) => Number(valeur)),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };

    return (

        <div style={{width:'100%',height:'100vh',display: 'grid',gridTemplateRows:'1fr 1fr',gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
            <div><Bar data={barchart}></Bar></div>
            <div style={{backgroundColor:"red"}}>zidan</div>
            <div>wwww</div>
            <div>efvd</div>
            <div>dv</div>
            <div>dv</div>
            
        </div>

    )

}