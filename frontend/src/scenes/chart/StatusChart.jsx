import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchStatus } from "../../API/api.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { XCircle, Lightbulb, CheckCircle, Users } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { ExportButton } from "./QuestionChart";
import { exportToExcel, exportChartDataToPdf } from "../../utils/utils";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const StatusChart = () => {
  const authContext = useContext(AuthContext);
  const [data, setData] = useState({
    list: [],
    count: 0,
    null: 0,
    somme: 0,
    list_status: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetchStatus returns the already‐parsed JSON payload
        const payload = await fetchStatus(authContext);
        setData({
          list: payload.list || [],
          count: payload.count || 0,
          null: payload.null || 0,
          somme: payload.somme || 0,
          list_status: payload.list_status || [],
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, [authContext]);

  // Filtrer les statuts pour enlever "-1" et "5"
  const filteredList = (data.list || []).filter(
    (item) => item.status !== "-1" && item.status !== "5"
  );
  const filteredListStatus = (data.list_status || []).filter(
    (item) => item.status !== "-1" && item.status !== "5"
  );

  // Palette de couleurs unique et cohérente pour chaque statut
  const statusColors = [
    "#2563eb", // bleu
    "#eab308", // jaune
    "#16a34a", // vert
    "#e53935", // rouge
    "#9333ea", // violet
    "#f59e42", // orange
    "#00bcd4", // cyan
    "#ff1493", // rose
    "#607d8b", // gris
    "#ff9800", // orange foncé
  ];

  // Bar Chart
  const chart = {
    labels: filteredList.map((item) => item.status),
    datasets: [
      {
        label: "Status de 2021 à 2023",
        data: filteredList.map((item) => Number(item.total)),
        backgroundColor: filteredList.map(
          (_, i) => statusColors[i % statusColors.length]
        ),
        borderColor: filteredList.map(
          (_, i) => statusColors[i % statusColors.length]
        ),
        borderWidth: 3,
        borderRadius: 5,
      },
    ],
  };

  // Doughnut Chart
  const chart_cercle = {
    labels: filteredListStatus.map((item) => item.status),
    datasets: [
      {
        data: filteredListStatus.map((item) => item.total),
        backgroundColor: filteredListStatus.map(
          (_, i) => statusColors[i % statusColors.length]
        ),
      },
    ],
  };

  const cerclechartOptions = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 20,
          padding: 10,
        },
      },
    },
  };

  const handleExport = () => {
    const rows = data.list_status.map((item, i) => ({
      "#": i + 1,
      Status: item.status,
      Total: item.total,
    }));
    exportToExcel({
      rows,
      sheetName: "StatusChart",
      fileName: "status_chart_data.xlsx",
    });
  };

  const handleExcelExport = () => handleExport();
  const handlePdfExport = () => {
    const rows = data.list_status.map((item, i) => ({
      "#": i + 1,
      Status: item.status,
      Total: item.total,
    }));
    exportChartDataToPdf({
      rows,
      title: "Status Chart Data",
      fileName: "status_chart_data.pdf",
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
          <Typography variant="h2">STATUS ANALYSIS</Typography>
          <ExportButton
            handleExcelExport={handleExcelExport}
            handlePdfExport={handlePdfExport}
          />
        </Box>
      </Paper>

      <div className="flex flex-col h-full mr-8 ml-8">
        <div className="grid grid-cols-4 gap-4 w-[99%] mb-4">
          {[
            {
              icon: <Users className="w-10 h-10 text-blue-600" />,
              value: data.count,
              label: "Nombre total des réponses",
            },
            {
              icon: <XCircle className="w-10 h-10 text-red-600" />,
              value: data.null,
              label: "Réponses non validées",
            },
            {
              icon: <CheckCircle className="w-10 h-10 text-green-600" />,
              value: data.somme,
              label: "Réponses validées",
            },
            {
              icon: <Lightbulb className="w-10 h-10 text-yellow-500" />,
              value: data.list_status.length,
              label: "Nombre de statuts possibles",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-xl p-4 flex items-center"
            >
              {item.icon}
              <div className="ml-4">
                <p className="text-xl font-semibold text-gray-900">
                  {item.value}
                </p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Table */}
        <div className="grid grid-cols-[70%_30%] gap-4 h-[80%] w-[98%]">
          {/* Bar Chart */}
          <div className="bg-white shadow-md rounded-xl p-6 ">
            <h2 className="text-xl font-semibold text-gray-600 mb-6">
              Histogramme des statuts
            </h2>
            <Bar data={chart} />
          </div>

          {/* Table + Doughnut */}
          <div className="flex flex-col gap-4">
            {/* Status Table */}
            <div className="bg-white shadow-md rounded-xl p-4 overflow-auto">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">
                Tableau des statuts
              </h2>
              <table className="w-full">
                <thead>
                  <tr
                    className="text-left "
                    style={{ backgroundColor: "#E60000" }}
                  >
                    <th className="pl-[3%] text-white font-extrabold text-[18px] rounded-tl-md rounded-bl-md">
                      #
                    </th>
                    <th className="text-white pl-[10%] font-extrabold text-[15px]">
                      Status
                    </th>
                    <th className="text-white pl-[3%] font-extrabold text-[15px] rounded-tr-md rounded-br-md">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListStatus.map((item, index) => (
                    <tr key={index}>
                      <td className="text-black pl-[3%] font-medium text-[15px] border-b-1">
                        0{index + 1}
                      </td>
                      <td className="text-black pl-[10%] font-medium text-[15px] border-b-1">
                        {item.status}
                      </td>
                      <td className="text-black pl-[3%] font-medium text-[15px] border-b-1">
                        {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Doughnut Chart */}
            <div className="bg-white shadow-md rounded-xl p-2 flex flex-col h-fit">
              <h2 className="text-base font-semibold text-gray-600 mb-2">
                Analyse des statuts
              </h2>
              <div className="flex justify-center items-center">
                <div className="h-[250px] w-[250px]"> {/* Adjusted size */}
                  <Doughnut data={chart_cercle} options={cerclechartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};
