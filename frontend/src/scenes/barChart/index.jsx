import { chart , chartJS } from "chart.js/auto";
import { Bar , Doughnut , Line } from "react-chartjs-2";

const BarChart = () => {
    return (
        <div >
          <div>
            <Bar 
              data={{
                labels: ["A","B","C"],
                datasets: [
                    {
                        label: "Revenue",
                        data: [200, 300, 400]
                    }
                ]
              }}
            />
          </div>
          <div>

          </div>
          <div>

          </div>
        </div>
    )
}