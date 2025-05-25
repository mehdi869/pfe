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

  const entries = Object.entries(data);
  const sliceEnd = 7; // take entries[1] through entries[6]

  const barchart = {
    labels: entries.slice(1, sliceEnd).map(([k]) => k),
    datasets: [
      {
        label: "Age groupes 2021–2023",
        data: entries.slice(1, sliceEnd).map(([, v]) => v),
        backgroundColor: ["#FF6666"],
        borderColor: ["#E60000"],
        borderWidth: 1,
        barPercentage: 1,
        categoryPercentage: 1,
        borderRadius: 5,
      },
    ],
  };

  const cercleChart = {
    labels: entries.slice(1, sliceEnd).map(([k]) => k),
    datasets: [
      {
        data: entries.slice(1, sliceEnd).map(([, v]) => v),
        backgroundColor: [
          "#E60000",
          "#FF6666",
          "#E60000",
          "#FF6666",
          "#E60000",
          "#FF6666",
        ].slice(0, sliceEnd - 1),
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
  const rows = entries.slice(1, sliceEnd).map(([k, v]) => ({
    "Age Group": k,
    Count: v,
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

  return (
    <div className="h-screen p-4 flex flex-col">
      {/* Export buttons */}
      <div className="flex justify-end mb-4">
        <ExportButton
          handleExcelExport={handleExcelExport}
          handlePdfExport={handlePdfExport}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-rows-[60%_40%] flex-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="border bg-white rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
              Bar Chart des groupes d’âge
            </h2>
            <div className="flex items-center m-8">
              <Bar data={barchart} />
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
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            Tableau des groupes d’âge
          </h2>
          <table className="w-full">
            <thead style={{ backgroundColor: "#E60000" }}>
              <tr>
                <th className="text-white pl-4 py-2">#</th>
                <th className="text-white py-2">Age Groupe</th>
                <th className="text-white py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(1, sliceEnd).map(([key, val], i) => (
                <tr key={i}>
                  <td className="pl-4 py-1">0{i + 1}</td>
                  <td className="py-1">{key}</td>
                  <td className="py-1">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
