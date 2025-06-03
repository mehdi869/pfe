import React, { useState, useEffect, useContext } from "react";
import { fetchQuestionTypeStats } from "../../API/api";
import { AuthContext } from "../../context/AuthContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../styles/theme";
import { exportToExcel, exportChartDataToPdf } from "../../utils/utils";
import CommentIcon from "@mui/icons-material/Comment";
import BallotIcon from "@mui/icons-material/Ballot";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RuleIcon from "@mui/icons-material/Rule";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ScaleIcon from "@mui/icons-material/Scale";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const iconByType = (label, color) => {
  switch (label.toLowerCase()) {
    case "comment":
      return <CommentIcon sx={{ fontSize: 40, color }} />;
    case "multiple choice":
      return <BallotIcon sx={{ fontSize: 40, color }} />;
    case "checkbox":
      return <AccessTimeIcon sx={{ fontSize: 40, color }} />;
    case "yes_no":
      return <RuleIcon sx={{ fontSize: 40, color }} />;
    case "text":
      return <ChatBubbleOutlineIcon sx={{ fontSize: 40, color }} />;
    case "rating":
      return <ScaleIcon sx={{ fontSize: 40, color }} />;
    default:
      return <HelpOutlineIcon sx={{ fontSize: 40, color }} />;
  }
};

export const ExportButton = ({ handleExcelExport, handlePdfExport }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<DownloadOutlinedIcon />}
        onClick={handleClick}
        sx={{
          backgroundColor: "#e53935", // rouge
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          "&:hover": { backgroundColor: "#ab2020" }, // rouge foncé au hover
        }}
      >
        Export Data
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleExcelExport();
            handleClose();
          }}
        >
          Excel
        </MenuItem>
        <MenuItem
          onClick={() => {
            handlePdfExport();
            handleClose();
          }}
        >
          PDF
        </MenuItem>
      </Menu>
    </>
  );
};

export const QuestionChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authContext = useContext(AuthContext);

  const [data, setData] = useState(() => {
    const cached = localStorage.getItem("questionTypeData");
    return cached ? JSON.parse(cached) : null;
  });

  // Toggle state: "responses" or "nps"
  const [chartType, setChartType] = useState("responses");

  const handleChartType = (_, newType) => {
    if (newType) setChartType(newType);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuestionTypeStats(authContext);
        setData(response);
        localStorage.setItem("questionTypeData", JSON.stringify(response));
      } catch (error) {
        console.error("Error fetching question type data:", error.message);
      }
    };
    fetchData();
  }, [authContext]);

  if (!data) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const { question_types, totals } = data;
  const total_responses = totals?.responses ?? 0;
  const global_nps = totals?.nps ?? 0;

  const typeColors = [
    "#e53935", // CommentIcon (red)
    "#2563eb", // BallotIcon (blue)
    "#f59e42", // AccessTimeIcon (orange)
    "#16a34a", // RuleIcon (green)
    "#9333ea", // ChatBubbleOutlineIcon (purple)
    "#f59e42", // ScaleIcon (orange)
  ];

  const cards = question_types.labels.map((label, i) => ({
    icon: iconByType(label, typeColors[i % typeColors.length]),
    value: question_types.counts[i],
    label: label,
    nps: question_types.nps_scores[i],
  }));

  // Chart data for responses
  const responsesChart = {
    labels: question_types.labels,
    datasets: [
      {
        label: "Responses",
        data: question_types.counts,
        backgroundColor: "rgba(229,57,53,0.8)",
        borderColor: "#e53935",
        borderWidth: 1,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
      },
    ],
  };

  // Chart data for NPS
  const npsChart = {
    labels: question_types.labels,
    datasets: [
      {
        label: "NPS Score",
        data: question_types.nps_scores,
        backgroundColor: "rgba(37,99,235,0.8)",
        borderColor: "#2563eb",
        borderWidth: 1,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
      },
    ],
  };

  // Chart options for responses
  const responsesOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Responses" },
      },
      x: {
        grid: { display: false },
        title: { display: true, text: "Question Types" },
      },
    },
  };

  // Chart options for NPS
  const npsOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: -40, // <-- modifié ici
        max: 40, // <-- modifié ici
        stepSize: 5,
        title: { display: true, text: "NPS Score" },
        ticks: {
          stepSize: 5,
          callback: (value) => value,
        },
      },
      x: {
        grid: { display: false },
        title: { display: true, text: "Question Types" },
      },
    },
  };

  // Export handlers
  const handleExcelExport = () => {
    const rows = question_types.labels.map((label, i) => ({
      "Question Type": label,
      "Number of Responses": question_types.counts[i],
      "NPS Score": question_types.nps_scores[i],
    }));
    exportToExcel({
      rows,
      sheetName: "QuestionChart",
      fileName: "question_chart_data.xlsx",
    });
  };

  const handlePdfExport = () => {
    const rows = question_types.labels.map((label, i) => ({
      "Question Type": label,
      "Number of Responses": question_types.counts[i],
      "NPS Score": question_types.nps_scores[i],
    }));
    exportChartDataToPdf({
      rows,
      title: "Question Chart Data",
      fileName: "question_chart_data.pdf",
    });
  };

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
          <Typography variant="h2">QUESTION TYPE ANALYSIS</Typography>
          <ExportButton
            handleExcelExport={handleExcelExport}
            handlePdfExport={handlePdfExport}
          />
        </Box>
      </Paper>

      <div className="h-screen p-4 flex flex-col">
        {/* Global stats cards */}
        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center">
            <Typography variant="h6" color="textSecondary">
              Total Responses
            </Typography>
            <Typography
              variant="h4"
              color="primary"
              fontWeight="bold"
              className="text-4xl"
            >
              {total_responses}
            </Typography>
          </div>
          <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center">
            <Typography variant="h6" color="textSecondary">
              Global NPS
            </Typography>
            <Typography
              variant="h4"
              color="primary"
              fontWeight="bold"
              className="text-4xl"
            >
              {global_nps}
            </Typography>
          </div>
        </div>

        {/* Toggle button group */}
        <div className="flex justify-end mb-4"></div>

        {/* Chart & type cards side by side */}
        <div className="flex w-full gap-4">
          {/* Chart à gauche, moitié, hauteur augmentée */}
          <div
            className="w-1/2 bg-white rounded shadow p-4 flex flex-col"
            style={{ height: "500px" }}
          >
            <div className="flex justify-end mb-2">
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartType}
                aria-label="chart type"
                size="small"
              >
                <ToggleButton value="responses" aria-label="responses">
                  Nombre
                </ToggleButton>
                <ToggleButton value="nps" aria-label="nps">
                  NPS
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Bar
                data={chartType === "responses" ? responsesChart : npsChart}
                options={
                  chartType === "responses" ? responsesOptions : npsOptions
                }
              />
            </div>
          </div>
          {/* Cards à droite, une card par ligne */}
          <div className="w-1/2 flex flex-wrap gap-x-4 gap-y-0 items-start">
            {cards.map((item, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl py-2 px-4 flex flex-col items-center"
                style={{ flex: "1 1 45%", maxWidth: "48%" }}
              >
                {/* Affiche le NPS score au-dessus */}
                <div className="text-xs font-bold text-blue-700 text-center">
                  NPS: {item.nps}
                </div>
                <div className="flex items-center">
                  {item.icon && <div>{item.icon}</div>}
                  <div className="ml-4 text-center">
                    <p className="text-xl font-semibold text-gray-900 text-center mb-0">
                      {item.value}
                    </p>
                    <p className="text-sm text-gray-500 text-center mb-0">
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Box>
  );
};
