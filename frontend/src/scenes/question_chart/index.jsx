import React, { useState, useEffect } from "react";
import { fetchQuestionTypeStats } from "../../API/api.js";
import { Bar } from 'react-chartjs-2';
import { FileText, List, CheckSquare, MessageSquare, HelpCircle } from 'lucide-react';
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

const Question_Chart = () => {
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem("questionTypeData");
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuestionTypeStats();
        setData(response);
        localStorage.setItem("questionTypeData", JSON.stringify(response));
      } catch (error) {
        console.error('Error fetching question type data:', error.message);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const { question_types, total_responses } = data;

  const barchart = {
    labels: question_types.labels,
    datasets: [
      {
        label: 'Response Count',
        data: question_types.counts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
            const label = context.dataset.label || '';
            const value = context.raw;
            const percentage = ((value / total_responses) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Responses'
        }
      },
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: 'Question Types'
        }
      },
    },
  };

  // Get icon based on question type
  const getIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'text':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case 'multiple choice':
        return <List className="w-8 h-8 text-purple-600" />;
      case 'checkbox':
        return <CheckSquare className="w-8 h-8 text-green-600" />;
      case 'rating':
        return <MessageSquare className="w-8 h-8 text-yellow-600" />;
      default:
        return <HelpCircle className="w-8 h-8 text-gray-600" />;
    }
  };

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
    }))
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

export default Question_Chart;