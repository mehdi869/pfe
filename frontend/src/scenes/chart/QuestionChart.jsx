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
import { exportToExcel } from "../../utils/utils";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";

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

  const barchart = {
    labels: question_types.labels,
    datasets: [
      {
        label: "Response Count",
        data: question_types.counts,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
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
      icon: <FileText className="w-10 h-10 text-blue-600" />,
      value: total_responses,
      label: "Total Responses",
    },
    ...question_types.labels.map((label, index) => ({
      icon: getIcon(label),
      value: question_types.counts[index],
      label: `${label} Responses`,
    })),
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
    // You need to implement this if you want PDF export, for now just show an alert or leave empty
    alert("PDF export not implemented yet.");
  };

  const ExportButton = ({ handleExcelExport, handlePdfExport }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

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
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
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

  return (
    <div className="grid grid-rows-[15%_1fr] h-screen p-4">
      {/* Ligne du haut : 4 premières cards */}
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
        {/* Ligne du haut : Export Data à droite */}
        <div className="flex justify-end mb-6">
          <ExportButton
            handleExcelExport={handleExcelExport}
            handlePdfExport={handlePdfExport}
          />
        </div>
        <div />
      </div>

      {/* Chart + 2 dernières cards à droite */}
      <div className="flex w-full h-[80%]">
        <div className="bg-white rounded shadow flex-1 p-4 flex justify-center items-center">
          <Bar data={barchart} options={options} />
        </div>
        <div className="flex flex-col justify-start gap-4 ml-4">
          {cards.slice(4).map((item, i) => (
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

export default QuestionChart;
