import React from 'react'
import { fetchAgeChart } from "../../API/api";
import { useState, useEffect } from "react";
import { Bar, Doughnut} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,

} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend,  ArcElement);


export const AgeChart = () => {
    const [data,setdata] = useState([])
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetchAgeChart();
            if (!response.ok || response.status !== 200) {
              throw new Error('Erreur dans la réponse du serveur');
            }
            const dataResponse = await response.json();
            setdata(dataResponse);
            localStorage.setItem("npsData", JSON.stringify(dataResponse)); // Mise à jour du cache
          } catch (error) {
            console.error('Erreur de connexion front-back:', error.message);
          }
        };
    
        fetchData();
      }, []);
      const entries = Object.entries(data);
      const barchart = {
        labels: entries.slice(1,6).map(([key]) => key),
        datasets: [
            {
            label: "age groupe de 2021 à 2023",
            data : entries.slice(1,6).map(([_, value]) => value),
            backgroundColor: ['#FF6666'],
            borderColor: ['#E60000'],
            borderWidth: 1,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            borderRadius: 5

            }
        ]
    }

    const cercleChart ={
        labels: entries.slice(1,6).map(([key]) => key),
        datasets: [
      {
        data: entries.slice(1,6).map(( [_ ,values]) => values),
        backgroundColor: ["#E60000", "#FF6666", "#E60000", "#FF6666", "#E60000", "#FF6666"],
      },
     ],
    }
    
    return(
        <div className="h-[100%] w-[100%] grid grid-rows-[60%_40%]">
          <div className="grid grid-cols-2">
               <div className='border bg-white rounded-xl m-4'>
                   <div className='flex items-center m-8'>
                     <Bar data={barchart}/>
                   </div>
               </div>
               <div className='border bg-white rounded-xl m-4 flex justify-center items-center'>
                  <div className='h-[250px] w-[250px]'>
                    <Doughnut data={cercleChart}></Doughnut>
                    </div>
               </div>
           </div> 
          <div className=""></div>

        </div>
    )
}