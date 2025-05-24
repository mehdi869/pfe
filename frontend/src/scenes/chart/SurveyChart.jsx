import React, { useState, useEffect } from "react";
import {
  fetchSurveyType, fetchSurvey1Type, fetchSurvey2Type, fetchSurvey3Type,
  fetchSurvey4Type, fetchSurvey5Type, fetchSurvey6Type, fetchSurvey8Type
} from "../../API/api";
import { Bar } from "react-chartjs-2";

// Config : ces fetchers sont utilisés pour les tableaux et chartData
const surveyFetchers = [
  { fetcher: fetchSurvey1Type, label: "I Join", color: "#E60000" },
  { fetcher: fetchSurvey2Type, label: "Contact Center", color: "#007bff" },
  { fetcher: fetchSurvey3Type, label: "I use: Product", color: "#00cc66" },
  { fetcher: fetchSurvey4Type, label: "Djezzy App", color: "#ff9900" },
  { fetcher: fetchSurvey5Type, label: "Retail", color: "#9933ff" },
  { fetcher: fetchSurvey6Type, label: "Network", color: "#00cccc" },
  { fetcher: fetchSurvey8Type, label: "B2B", color: "#999999" },
];

// Composant tableau
const SurveyTable = ({ title, data }) => {
  if (!data) return null;
  const entries = Object.entries(data).slice(0, 3);
  return (
    <div className="bg-white rounded-xl m-2 p-4 shadow">
      <h2 className="text-base font-semibold text-gray-600 mb-2">{title}</h2>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase" style={{ backgroundColor: "#E60000" }}>
          <tr>
            <th className="px-4 py-2 text-white rounded-bl-md rounded-tl-md">Clé</th>
            <th className="px-4 py-2 text-white rounded-tr-md rounded-br-md">Valeur</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key}>
              <td className="px-4 py-2 font-medium text-base text-black">{key}</td>
              <td className="px-4 py-2 font-medium text-base">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const SurveyChart = () => {
  const [chartData, setChartData] = useState(null);
  const [surveyData, setSurveyData] = useState({});
  const [chartSurveyData, setChartSurveyData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch principal pour le 1er graphique
        const mainSurveyRes = await fetchSurveyType();
        const mainSurveyJson = await mainSurveyRes.json();
        setChartSurveyData(mainSurveyJson);

        // 2. Fetchs des 7 autres surveys
        const responses = await Promise.all(surveyFetchers.map(f => f.fetcher()));
        const datas = await Promise.all(responses.map(r => r.json()));

        const labels = [];
        const values = [];
        const backgroundColors = [];
        const allSurveyData = {};

        datas.forEach((data, index) => {
          const { label, color } = surveyFetchers[index];
          allSurveyData[label] = data;

          const entries = Object.entries(data).slice(3, 8); // valeurs 4 à 8
          entries.forEach(([key, value]) => {
            labels.push(`${label} - ${key}`);
            values.push(value);
            backgroundColors.push(color);
          });

          localStorage.setItem(`${label}Data`, JSON.stringify(data));
        });

        setSurveyData(allSurveyData);
        setChartData({
          labels,
          datasets: [
            {
              label: "Valeurs des Surveys",
              data: values,
              backgroundColor: backgroundColors,
            },
          ],
        });
      } catch (error) {
        console.error("Erreur de chargement des données:", error.message);
      }
    };

    fetchData();
  }, []);

  // 🔍 Construire le premier graphique avec seulement les clés voulues
  const keysToInclude = [
    "I Join",
    "Contact Center",
    "I use: Product",
    "Djezzy App",
    "Retail",
    "Network",
    "B2B"
  ];

  const filteredEntries = Object.entries(chartSurveyData).filter(([key]) =>
    keysToInclude.includes(key)
  );

  const chartSurvey = {
    labels: filteredEntries.map(([key]) => key),
    datasets: [
      {
        label: "Répartition des canaux (Survey)",
        data: filteredEntries.map(([, value]) => value),
        backgroundColor: "#FF6666",
        borderColor: "#E60000",
      },
    ],
  };

  const option = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Scores NPS des Surveys (éléments 4 à 8)",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 45,
        },
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  if (!chartData) return <div>Chargement en cours...</div>;

  return (
    <div className="h-full w-full p-4 space-y-6">
      {/* 7 tableaux */}
      <div className="grid grid-cols-4 gap-2">
        {surveyFetchers.slice(0, 4).map(({ label }) => (
          <SurveyTable key={label} title={`Informations de "${label}"`} data={surveyData[label]} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {surveyFetchers.slice(4).map(({ label }) => (
          <SurveyTable key={label} title={`Informations de "${label}"`} data={surveyData[label]} />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-[45%_55%]">
        <div className="border bg-white p-2 m-2 rounded-xl">
          <Bar data={chartSurvey} />
        </div>
        <div className="border bg-white p-2 m-2 rounded-xl">
          <Bar data={chartData} options={option} />
        </div>
      </div>
    </div>
  );
};
