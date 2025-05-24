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
        labels: entries.slice(1,7).map(([key]) => key),
        datasets: [
            {
            label: "age groupe de 2021 à 2023",
            data : entries.slice(1,7).map(([_, value]) => value),
            backgroundColor: ['#FF6666'],
            borderColor: ['#E60000'],
            borderWidth: 1,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            borderRadius: 5

            }
        ]
      }

    const CercleChart = {
    labels: entries.slice(1,7).map(([key,_])=>key),
    datasets: [
      {
        data: entries.slice(1,7).map(([_,values]) => values ),
        backgroundColor: ["#E60000", "#FF6666", "#E60000", "#FF6666", "#E60000", "#FF6666"],
      },
    ],
  }
    
  const cerclechartOptions = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxHeight: 20,
          padding: 20, 
        },
      },
    }
}
    return(
        <div className="h-[100%] w-[100%] grid grid-rows-[60%_40%]">
          <div className="grid grid-cols-2">
                <div className='border bg-white rounded-xl m-8 mr-4 shadow-xl transform transition duration-300 hover:-translate-y-0.5'>
                    <h2 className="text-xl font-semibold text-gray-600 m-8">Bar Chart collé des groupe age</h2>
                    <div className='flex items-center m-8'>
                     <Bar data={barchart}/>
                    </div>
                </div>
                <div className='border bg-white rounded-xl m-8 ml-4 shadow-xl transform transition duration-300 hover:-translate-y-0.5'>
                   <h2 className="text-xl font-semibold text-gray-600 m-8 ">Statut Circulaire</h2>
                   <div className='flex justify-center items-center w-[100%] h-[70%]'>
                      <div className='h-[400px] w-[400px]'>
                         <Doughnut data={CercleChart} options={cerclechartOptions}/>
                      </div>
                   </div>
            
                </div>
           </div> 
         <div className=" bg-white rounded-xl mt-14 m-8 shadow-xl transform transition duration-300 hover:-translate-y-0.5">
             <h2 className="text-xl font-semibold text-gray-600 ml-8 mt-3 ">tableau des groupe d'age</h2>
             <table className="w-[95%] h-[70%] rounded-xl ml-8 mt-3">
                 <thead >
                   <tr style={{backgroundColor: "#E60000"}}>
                     <th className=" font-extrabold text-left text-white pl-[3%] py-1 text-base rounded-bl-md rounded-tl-md">#</th>
                     <th className="font-extrabold text-left text-white pl-[20%] py-1 text-base">Age Groupe</th>
                     <th className="font-extrabold text-left text-white pl-[5%] py-1 text-base rounded-tr-md rounded-br-md">Total</th>
                   </tr>
                 </thead>
                 <tbody>
                   {entries.slice(7, 14).map((item, index) => (
                     <tr key={index}>
                       <td className="text-black pl-[3%] font-medium text-base ">0{index + 1}</td>
                       <td className="text-black pl-[20%] font-medium text-base ">{item[0]}</td>
                       <td className="text-black pl-[5%] font-medium text-base ">{item[1]}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
           </div>
        </div>
    )
}