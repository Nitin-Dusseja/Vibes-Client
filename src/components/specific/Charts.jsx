import React from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
} from 'chart.js'
import { getLast7Days } from '../../lib/features'


ChartJS.register(
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
)

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false
    },
  },

  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false
      }
    }
  }
}

const labels = getLast7Days()

const LineChart = ({ value = [] }) => {

  const data = {
    labels: labels,
    datasets: [{
      data: value,
      label: "Messages",
      fill: true,
      backgroundColor: "rgba(25,137,240,0.2)",
      borderColor: "rgba(25,137,240,0.9)"
    }]
  }

  return (
    <Line data={data} options={lineChartOptions} />
  )
}

const DoughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 100,
}

const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels: labels,
    datasets: [{
      data: value,
      label: "Total Chats vs Group Chats",
      backgroundColor: ["rgba(25,137,240,0.2)", "rgba(25,137,240,0.9)"],
      borderColor: ["rgba(25,137,240,0.9)", "rgba(25,137,240,0.3)"],
      offset: 10,
    }]
  }

  return (
    <Doughnut style={{ zIndex: 10 }} data={data} options={DoughnutChartOptions} />
  )
}

export { LineChart, DoughnutChart };