import { useState, useEffect, useContext } from "react"
import { fetchStatus } from "../../API/api.js"
import { AuthContext } from "../../context/AuthContext.jsx"
import { Bar, Doughnut } from "react-chartjs-2"
import { XCircle, Lightbulb, CheckCircle, Users } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export const StatusChart = () => {
  const authContext = useContext(AuthContext)
  const [data, setData] = useState({
    list: [],
    count: 0,
    null: 0,
    somme: 0,
    list_status: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchStatus(authContext)
        setData({
          list: response.list || [],
          count: response.count || 0,
          null: response.null || 0,
          somme: response.somme || 0,
          list_status: response.list_status || [],
        })
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error)
      }
    }
    fetchData()
  }, [authContext])

  const colors_background = (data.list || []).map((_, index) => (index % 2 === 0 ? "#FF6666" : "#E60000"))
  const colors_border = (data.list || []).map((_, index) => (index % 2 === 1 ? "#FF6666" : "#E60000"))

  const chart = {
    labels: data.list.map((item) => item.status),
    datasets: [
      {
        label: "Status de 2021 à 2023",
        data: data.list.map((item) => Number(item.total)),
        backgroundColor: ['#FF6666'],
        borderColor: ['#E60000'],
        borderWidth: 3,
        borderRadius: 5
      },
    ],
  }



  const chart_cercle = {
    labels: data.list_status.map((item) => item.status),
    datasets: [
      {
        data: data.list_status.map((item) => item.total),
        backgroundColor: ["#E60000", "#FF6666", "#E60000", "#FF6666", "#E60000", "#FF6666"],
      },
    ],
  }

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
  }

  return (
    <div className="grid grid-rows-[15%_1fr] gap-4 h[100%] mr-8 ml-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 w-[99%]">
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
          <div key={i} className="bg-white shadow-md rounded-xl p-4 flex items-center transform transition duration-300 
            hover:-translate-y-2">
            {item.icon}
            <div className="ml-4">
              <p className="text-xl font-semibold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Table */}
      <div className="grid grid-cols-[70%_30%] gap-4 h-[80%] w-[98%]">
        {/* Bar Chart */}
        <div className="bg-white shadow-md rounded-xl p-6 ">
          <h2 className="text-xl font-semibold text-gray-600 mb-6">Histogramme des statuts</h2>
          <Bar data={chart}/>
          
        </div>

        {/* Table + Doughnut */}
        <div className="grid grid-rows-2 gap-4 h-full">
          {/* Status Table */}
          <div className="bg-white shadow-md rounded-xl p-4 overflow-auto">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">Tableau des statuts</h2>
           <table className="w-full ">
              <thead>
                <tr className="text-left " style={{backgroundColor: "#E60000"}}>
                  <th className="pl-[3%] text-white font-extrabold text-[18px] rounded-tl-md rounded-bl-md">#</th>
                  <th className="text-white pl-[10%] font-extrabold text-[15px]">Status</th>
                  <th className="text-white pl-[3%] font-extrabold text-[15px] rounded-tr-md rounded-br-md">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.list_status.map((item, index) => (
                  <tr key={index}>
                    <td className="text-black pl-[3%] font-medium text-[15px] border-b-1">0{index + 1}</td>
                    <td className="text-black pl-[10%] font-medium text-[15px] border-b-1">{item.status}</td>
                    <td className="text-black pl-[3%] font-medium text-[15px] border-b-1">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Doughnut Chart */}
             <div className="bg-white shadow-md rounded-xl p-6 flex flex-col h-full">
               <h2 className="text-xl font-semibold text-gray-600 mb-6 ">
                  Analyse des statuts
               </h2>

              <div className="flex flex-row justify-center items-center flex-grow">
              </div>
              </div>
        </div>
      </div>
    </div>
  )
}