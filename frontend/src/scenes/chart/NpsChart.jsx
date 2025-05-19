import React, { useState, useEffect } from "react";
import { fetchNpsScore } from "../../API/api.js";
import { Bar } from 'react-chartjs-2';
import { Boxes, Frown, Meh, Smile, HelpCircle} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const NpsChart = () => {
  const [data, setData] = useState(null); // null = en chargement
  
  if (!data) {
  return <div className="p-4 text-center">Chargement en cours...</div>;
}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNpsScore();
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur dans la réponse du serveur');
        }
        const dataResponse = await response.json();
        setData(dataResponse);
      } catch (error) {
        console.error('Erreur de connexion front-back:', error.message);
      }
    };

    fetchData();
  }, []);


  const entries = Object.entries(data);
  const barchart = {
    labels: entries.slice(1, 5).map(([key]) => key),
    datasets: [
      {
        label: 'NPS Score',
        data: entries.slice(1, 5).map(([_, value]) => value),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-rows-[15%_1fr] h-screen p-4">
      <div className="grid grid-cols-5 gap-4 w-full mb-6">
        {[
          {
            icon: <Boxes className="w-10 h-10 text-blue-600" />,
            value: entries[0][1],
            label: "Nombre total des réponse avec un score nps",
          },
          {
            icon:<HelpCircle className="w-10 h-10 text-blue-600"/>,
            value: entries[5][1],
            label: "total réponse avec score 0",
          },
          {
            icon:<Frown className="w-10 h-10 text-red-600"/>,
            value: entries[6][1],
            label: "total réponse ente 1 et 6",
          },
          {
            icon:<Meh className="w-10 h-10 text-yellow-500"/>,
            value: entries[7][1],
            label: "total réponse ente 7 et 8",
          },
          {
            icon:<Smile className="w-10 h-10 text-green-600"/>,
            value: entries[8][1],
            label: "total réponse ente 9 et 10",
          },
        ].map((item, i) => (
          <div key={i} className="bg-white shadow-md rounded-xl p-4 flex items-center">
            {item.icon && <div>{item.icon}</div>}
            <div className="ml-4">
              <p className="text-xl font-semibold text-gray-900">{item.value ?? "N/A"}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white w-full h-[80%] p-4 rounded shadow flex justify-center">
        <Bar data={barchart} />
      </div>
    </div>
  );
};
