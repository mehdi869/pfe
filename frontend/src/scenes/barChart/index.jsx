import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState, useEffect , useRef } from 'react';
import { fetchQuestionTypeStats } from '../../API/api';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchQuestionTypeStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Échec du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Options du graphique
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Répartition des types de questions',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} réponses (${Math.round(context.parsed.y / stats.total_responses * 100)}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de réponses'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Types de questions'
        }
      }
    }
  };

  // Données du graphique
  const data = {
    labels: stats?.question_types?.labels || [],
    datasets: [
      {
        label: 'Nombre de réponses',
        data: stats?.question_types?.counts || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div className="text-center py-5">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!stats || !stats.question_types || stats.question_types.labels.length === 0) {
    return <div className="alert alert-info">Aucune donnée disponible</div>;
  }

  return (
    <div className="chart-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
      <h4 className="mb-4">Statistiques des types de questions</h4>
      <p className="text-muted mb-4">
        Total des réponses analysées: <strong>{stats.total_responses}</strong>
      </p>
      
      <Bar ref={chartRef} options={options} data={data} />
      
      <div className="mt-3 text-muted small">
        <i>Graphique interactif - Passez la souris pour voir les détails</i>
      </div>
    </div>
  );
};

export default BarChart;