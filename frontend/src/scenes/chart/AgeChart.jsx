import React, { useState, useEffect } from "react";
import { fetchAgeChart } from "../../API/api";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { ExportButton } from "./QuestionChart";
import { exportToExcel, exportChartDataToPdf } from "../../utils/utils";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export const AgeChart = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchAgeChart();
        if (!res.ok || res.status !== 200) throw new Error("Server error");
        const json = await res.json();
        setData(json);
        localStorage.setItem("npsData", JSON.stringify(json));
      } catch (err) {
        console.error("Front-back error:", err.message);
      }
    };
    fetchData();
  }, []);

  // Palette cohérente pour chaque groupe d'âge
  const ageColors = [
    "#2563eb", // bleu pour 18-25
    "#eab308", // jaune pour 26-35
    "#16a34a", // vert pour 36-45
    "#e53935", // rouge pour 46-55
    "#9333ea", // violet pour 56-65
  ];

  const valueKeys = [
    "age entre 18 et 25",
    "age entre 26 et 35",
    "age entre 36 et 45",
    "age entre 46 et 55",
    "age entre 56 et 65",
  ];
  const percentKeys = ["18-25", "26-35", "36-45", "46-55", "56-65"];

  const labels = valueKeys;
  const values = valueKeys.map((k) => data[k]);

  const barchart = {
    labels,
    datasets: [
      {
        label: "Nombre de clients par groupe d'âge",
        data: values,
        backgroundColor: ageColors,
        borderColor: ageColors,
        borderWidth: 2,
        barPercentage: 1,
        categoryPercentage: 1,
        borderRadius: 5,
      },
    ],
  };

  const doughnutLabels = valueKeys;
  const doughnutValues = valueKeys.map((k) => data[k]);

  const cercleChart = {
    labels: doughnutLabels,
    datasets: [
      {
        data: doughnutValues,
        backgroundColor: ageColors,
      },
    ],
  };
  const cerclechartOptions = {
    plugins: {
      legend: {
        position: "right",
        labels: { boxHeight: 20, padding: 20 },
      },
    },
  };

  // prepare rows for export & table
  const rows = valueKeys.map((k) => ({
    "Age Group": k,
    Count: data[k],
  }));
  const handleExcelExport = () =>
    exportToExcel({
      rows,
      sheetName: "AgeChart",
      fileName: "age_chart_data.xlsx",
    });
  const handlePdfExport = () =>
    exportChartDataToPdf({
      rows,
      title: "Age Chart Data",
      fileName: "age_chart_data.pdf",
    });

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
          <Typography variant="h2">AGE GROUP ANALYSIS</Typography>
          <ExportButton
            handleExcelExport={handleExcelExport}
            handlePdfExport={handlePdfExport}
          />
        </Box>
      </Paper>

      <div className="h-screen p-4 flex flex-col">
        {/* Charts */}
        <div className="grid grid-rows-[70%_30%] flex-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border bg-white rounded-xl p-4 shadow flex flex-col">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">
                Bar Chart des groupes d’âge
              </h2>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full h-[350px]">
                  <Bar data={barchart} />
                </div>
              </div>
            </div>
            <div className="border bg-white rounded-xl p-4 shadow">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">
                Statut Circulaire
              </h2>
              <div className="flex justify-center items-center w-[100%] h-[70%]">
                <div className="h-[400px] w-[400px]">
                  <Doughnut data={cercleChart} options={cerclechartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div
            className="bg-white rounded-xl p-4 shadow"
            style={{ minHeight: "10rem" }}
          >
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
              Tableau des groupes d’âge
            </h2>
            <table className="w-full">
              <thead style={{ backgroundColor: "#E60000" }}>
                <tr>
                  <th className="text-white pl-4 py-2">#</th>
                  <th className="text-white py-2">Age Groupe</th>
                  <th className="text-white py-2">Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                {percentKeys.map((key, i) => (
                  <tr key={i}>
                    <td className="pl-4 py-1">0{i + 1}</td>
                    <td className="py-1">{key}</td>
                    <td className="py-1">{data[key]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Box>
  );
};
