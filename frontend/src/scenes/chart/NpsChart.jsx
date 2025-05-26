import React, { useState, useEffect, useContext } from "react";
import { fetchNpsScore } from "../../API/api.js";
import { Bar } from "react-chartjs-2";
import { Boxes, Frown, Meh, Smile, HelpCircle } from "lucide-react";
import { AuthContext } from "../../context/AuthContext.jsx"; // Assuming this is the correct path
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";
import { ExportButton } from "./QuestionChart";
import { exportToExcel, exportChartDataToPdf } from "../../utils/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const NpsChart = () => {
  const authContext = useContext(AuthContext); // Get authContext
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem("npsData");
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!authContext) {
        console.error("AuthContext is not available yet.");
        return;
      }
      try {
        const dataResponse = await fetchNpsScore(authContext); // This returns parsed JSON, not Response object
        console.log("Debug: Data from fetchNpsScore:", dataResponse);
        setData(dataResponse);
        localStorage.setItem("npsData", JSON.stringify(dataResponse));
      } catch (error) {
        console.error("Erreur de connexion front-back:", error.message, error.stack);
      }
    };

    fetchData();
  }, [authContext]); // Add authContext to dependency array

  if (!data) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const entries = Object.entries(data);

  const barchart = {
    labels: entries.slice(1, 5).map(([key]) => key),
    datasets: [
      {
        label: "NPS Score",
        data: entries.slice(1, 5).map(([_, value]) => value),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
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
      icon: <Smile className="w-10 h-10 text-green-800" />,
      value: safeGet(8),
      label: "Total réponses entre 9 et 10",
    },
  ];

  const handleExport = () => {
    // Adapte les colonnes selon ce que tu veux exporter
    const rows = [
      {
        "Total réponses NPS": safeGet(0),
        "Score 0": safeGet(5),
        "Score 1-6": safeGet(6),
        "Score 7-8": safeGet(7),
        "Score 9-10": safeGet(8),
      },
    ];
    exportToExcel({
      rows,
      sheetName: "NPSChart",
      fileName: "nps_chart_data.xlsx",
    });
  };
  const handleExcelExport = () => handleExport();
  const handlePdfExport = () => {
    const rows = [
      {
        "Total réponses NPS": safeGet(0),
        "Score 0": safeGet(5),
        "Score 1-6": safeGet(6),
        "Score 7-8": safeGet(7),
        "Score 9-10": safeGet(8),
      },
    ];
    exportChartDataToPdf({
      rows,
      title: "NPS Chart Data",
      fileName: "nps_chart_data.pdf",
    });
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "16px",
          backgroundColor:
            theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h2">NPS SCORE ANALYSIS</Typography>
          <ExportButton
            handleExcelExport={handleExcelExport}
            handlePdfExport={handlePdfExport}
          />
        </Box>
      </Paper>

      <div className="h-screen p-4 flex flex-col">
        <div className="grid grid-cols-5 gap-4 w-full mb-6">
          {cards.map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-xl p-4 flex items-center transform transition duration-300 hover:-translate-y-2"
            >
              {item.icon && <div>{item.icon}</div>}
              <div className="ml-4">
                <p className="text-xl font-semibold text-gray-900">
                  {item.value}
                </p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white w-full h-[80%] p-4 rounded shadow flex justify-center">
          <Bar data={barchart} options={options} />
        </div>
      </div>
    </Box>
  );
};
