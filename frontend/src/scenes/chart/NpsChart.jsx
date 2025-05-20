import React, { useState, useEffect } from "react";
import { fetchNpsScore } from "../../API/api.js";
import { Bar } from 'react-chartjs-2';
import { Boxes, Frown, Meh, Smile, HelpCircle } from 'lucide-react';
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
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem("npsData");
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNpsScore();
        if (!response.ok || response.status !== 200) {
          throw new Error('Erreur dans la réponse du serveur');
        }
        const dataResponse = await response.json();
        setData(dataResponse);
        localStorage.setItem("npsData", JSON.stringify(dataResponse));
      } catch (error) {
        console.error('Erreur de connexion front-back:', error.message);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div className="p-4 text-center">Chargement en cours...</div>;
  }

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
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}`,
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  // Fonction pour récupérer une valeur d'entrée en toute sécurité
  const safeGet = (index) => entries[index]?.[1] ?? "N/A";

  const cards = [
    {
      icon: <Boxes className="w-10 h-10 text-blue-600" />,
      value: safeGet(0),
      label: "Nombre total des réponses avec un score NPS",
    },
    {
      icon: <HelpCircle className="w-10 h-10 text-blue-600" />,
      value: safeGet(5),
      label: "Total réponses avec score 0",
    },
    {
      icon: <Frown className="w-10 h-10 text-red-600" />,
      value: safeGet(6),
      label: "Total réponses entre 1 et 6",
    },
    {
      icon: <Meh className="w-10 h-10 text-yellow-500" />,
      value: safeGet(7),
      label: "Total réponses entre 7 et 8",
    },
    {
      icon: <Smile className="w-10 h-10 text-green-600" />,
      value: safeGet(8),
      label: "Total réponses entre 9 et 10",
    },
  ];

  return (
    <div className="grid grid-rows-[15%_1fr] h-screen p-4">
      <div className="grid grid-cols-5 gap-4 w-full mb-6">
        {cards.map((item, i) => (
          <div key={i} className="bg-white shadow-md rounded-xl p-4 flex items-center">
            {item.icon && <div>{item.icon}</div>}
            <div className="ml-4">
              <p className="text-xl font-semibold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white w-full h-[80%] p-4 rounded shadow flex justify-center">
        <Bar data={barchart} options={options} />
      </div>
    </div>
  );
};
