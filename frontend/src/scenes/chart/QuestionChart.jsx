import React, { useState, useEffect, useContext } from "react";
import { fetchQuestionTypeStats } from "../../API/api.js";
import { AuthContext } from "../../context/AuthContext";
import { Bar } from "react-chartjs-2";
import {
  FileText,
  List,
  CheckSquare,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { exportToExcel, exportChartDataToPdf } from "../../utils/utils";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";
import CommentIcon from "@mui/icons-material/Comment";
import BallotIcon from "@mui/icons-material/Ballot";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RuleIcon from "@mui/icons-material/Rule";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ScaleIcon from "@mui/icons-material/Scale";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QuestionChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authContext = useContext(AuthContext); // <-- add this line
  const [showExportOptions, setShowExportOptions] = useState(false);

  const [data, setData] = useState(() => {
    const cached = localStorage.getItem("questionTypeData");
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuestionTypeStats(authContext); // <-- pass authContext here
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

  const { question_types, total_responses } = data;

  // Définis une palette de couleurs cohérente pour chaque type de question
  const typeColors = [
    "#e53935", // CommentIcon (red)
    "#2563eb", // BallotIcon (blue)
    "#f59e42", // AccessTimeIcon (orange)
    "#16a34a", // RuleIcon (green)
    "#9333ea", // ChatBubbleOutlineIcon (purple)
    "#f59e42", // ScaleIcon (orange)
  ];

  const barchart = {
    labels: question_types.labels,
    datasets: [
      {
        label: "Response Count",
        data: question_types.counts,
        backgroundColor: typeColors.slice(0, question_types.labels.length),
        borderColor: typeColors.slice(0, question_types.labels.length),
        borderWidth: 1,
        barPercentage: 0.8,
        categoryPercentage: 0.9,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            const percentage = ((value / total_responses) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Responses",
        },
      },
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: "Question Types",
        },
      },
    },
  };

  // Get icon based on question type
  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case "text":
        return <FileText className="w-8 h-8 text-blue-600" />;
      case "multiple choice":
        return <List className="w-8 h-8 text-purple-600" />;
      case "checkbox":
        return <CheckSquare className="w-8 h-8 text-green-600" />;
      case "rating":
        return <MessageSquare className="w-8 h-8 text-yellow-600" />;
      default:
        return <HelpCircle className="w-8 h-8 text-gray-600" />;
    }
  };

  // Include ALL cards, including "EXPIRATION Responses"
  const cards = [
    {
      icon: <FileText className="w-10 h-10 text-blue-600" />, // Total Responses: blue
      value: total_responses,
      label: "Total Responses",
    },
    {
      icon: <CommentIcon sx={{ fontSize: 40, color: typeColors[0] }} />,
      value: question_types.counts[0],
      label: `${question_types.labels[0]} Responses`,
    },
    {
      icon: <BallotIcon sx={{ fontSize: 40, color: typeColors[1] }} />,
      value: question_types.counts[1],
      label: `${question_types.labels[1]} Responses`,
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: typeColors[2] }} />,
      value: question_types.counts[2],
      label: `${question_types.labels[2]} Responses`,
    },
    {
      icon: <RuleIcon sx={{ fontSize: 40, color: typeColors[3] }} />,
      value: question_types.counts[3],
      label: `${question_types.labels[3]} Responses`,
    },
    {
      icon: (
        <ChatBubbleOutlineIcon
          sx={{ fontSize: 40, color: typeColors[4] }}
          className="text-gray-600"
        />
      ),
      value: question_types.counts[4],
      label: `${question_types.labels[4]} Responses`,
    },
    {
      icon: <ScaleIcon sx={{ fontSize: 40, color: typeColors[5] }} />,
      value: question_types.counts[5],
      label: `${question_types.labels[5]} Responses`,
    },
    // Add more if you have more question_types
  ];

  const handleExport = () => {
    const rows = question_types.labels.map((label, i) => ({
      "Question Type": label,
      "Number of Responses": question_types.counts[i],
    }));

    exportToExcel({
      rows,
      sheetName: "QuestionChart",
      fileName: "question_chart_data.xlsx",
    });
  };

  const handleExcelExport = () => {
    handleExport();
  };

  const handlePdfExport = () => {
    const rows = question_types.labels.map((label, i) => ({
      "Question Type": label,
      "Number of Responses": question_types.counts[i],
    }));

    exportChartDataToPdf({
      rows,
      title: "Question Chart Data",
      fileName: "question_chart_data.pdf",
    });
  };

  return (
    <div className="h-screen p-4 flex flex-col">
      {/* Export Data button align right */}
      <div className="flex justify-end mb-4">
        <ExportButton
          handleExcelExport={handleExcelExport}
          handlePdfExport={handlePdfExport}
        />
      </div>

      {/* Ligne du haut : 4 premières cards + "yes_no responses" à la place de l'ancien bouton */}
      <div className="grid grid-cols-5 gap-4 w-full mb-6">
        {cards.slice(0, 4).map((item, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl p-4 flex items-center"
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
        {/* Remplace la card vide par la card "yes_no responses" */}
        {(() => {
          const yesNoIndex = question_types.labels.findIndex(
            (label) => label.toLowerCase() === "yes_no"
          );
          if (yesNoIndex !== -1) {
            return (
              <div className="bg-white shadow-md rounded-xl p-4 flex items-center">
                <RuleIcon sx={{ fontSize: 40, color: "#16a34a" }} />
                <div className="ml-4">
                  <p className="text-xl font-semibold text-gray-900">
                    {question_types.counts[yesNoIndex]}
                  </p>
                  <p className="text-sm text-gray-500">yes_no responses</p>
                </div>
              </div>
            );
          }
          // Si pas de "yes_no", affiche une card vide
          return (
            <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-center" />
          );
        })()}
      </div>

      {/* Chart + 2 dernières cards à droite */}
      <div className="flex w-full h-[80%]">
        <div className="bg-white rounded shadow flex-1 p-4 flex justify-center items-center">
          <Bar data={barchart} options={options} />
        </div>
        <div className="flex flex-col justify-start gap-4 ml-4">
          {cards.slice(5).map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-xl p-4 flex items-center"
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
      </div>
    </div>
  );
};

export const ExportButton = ({ handleExcelExport, handlePdfExport }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <Button
        aria-controls="export-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        sx={{
          backgroundColor: "#e53935",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          "&:hover": { backgroundColor: "#b71c1c" },
        }}
        startIcon={<DownloadOutlinedIcon />}
      >
        Export Data
      </Button>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        keepMounted
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
    </div>
  );
};

export default QuestionChart;
