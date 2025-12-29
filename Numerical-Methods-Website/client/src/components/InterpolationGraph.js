// client/src/components/InterpolationGraph.js
import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InterpolationGraph = ({ tableData, method, precision = 4, polyCoeffs }) => {
  const chartData = useMemo(() => {
    if (!tableData || !tableData.rows || tableData.rows.length === 0) {
      return null;
    }

    // Extract x and y values from the table
    const xValues = tableData.rows.map(row => row[0]);
    const yValues = tableData.rows.map(row => row[1]);

    // Get min and max for x values
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const range = maxX - minX;
    const step = range / 100; // Generate 100 points for smooth curve

    // Generate points along the interpolation curve
    const interpolationPoints = [];
    for (let x = minX; x <= maxX; x += step) {
      let y = null;
      // Find surrounding data points
      for (let i = 0; i < xValues.length - 1; i++) {
        if (x >= xValues[i] && x <= xValues[i + 1]) {
          // Linear interpolation between points
          const x0 = xValues[i];
          const x1 = xValues[i + 1];
          const y0 = yValues[i];
          const y1 = yValues[i + 1];
          y = y0 + (x - x0) * (y1 - y0) / (x1 - x0);
          break;
        }
      }
      if (y !== null) {
        interpolationPoints.push({ x, y });
      }
    }

    // Generate points for the polynomial if coefficients are provided
    let polyPoints = [];
    if (polyCoeffs && polyCoeffs.length === 3) {
      for (let x = minX; x <= maxX; x += step) {
        const y = polyCoeffs[0] + polyCoeffs[1] * x + polyCoeffs[2] * x * x;
        polyPoints.push({ x, y });
      }
    }

    // Create unified labels from all interpolation points
    const labels = interpolationPoints.map(p => p.x.toFixed(precision));

    // Create data arrays - both need to have same length as labels
    // For interpolation curve: use y values directly
    const interpolationData = interpolationPoints.map(p => p.y);

    // For original data points: map them to the nearest label position
    const originalPointsData = labels.map((label, idx) => {
      const x = parseFloat(label);
      // Check if this x is an original data point (or very close to one)
      const closeIndex = xValues.findIndex(xVal => Math.abs(xVal - x) < step / 2);
      if (closeIndex !== -1) {
        return yValues[closeIndex];
      }
      return null;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Interpolation Curve',
          data: interpolationData,
          borderColor: 'rgba(46, 204, 113, 1)',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tension: 0.2,
        },
        {
          label: 'Original Data Points',
          data: originalPointsData,
          borderColor: 'rgba(52, 152, 219, 1)',
          backgroundColor: 'rgba(52, 152, 219, 0.8)',
          borderWidth: 0,
          pointRadius: 7,
          pointHoverRadius: 9,
          showLine: false,
          tension: 0,
          spanGaps: true,
        },
        ...(polyPoints.length > 0 ? [{
          label: 'Simplified Polynomial',
          data: polyPoints.map(p => ({ x: p.x, y: p.y })),
          borderColor: 'rgba(231, 76, 60, 1)',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          borderDash: [8, 4],
          tension: 0.2,
        }] : []),
      ],
    };
  }, [tableData, method, precision, polyCoeffs]);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'x',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: 'f(x)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: `Newton's Interpolation Formula (${method.charAt(0).toUpperCase() + method.slice(1)} Difference)`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        displayColors: true,
        callbacks: {
          label: function (context) {
            if (context.dataset.label === 'Original Data Points') {
              return `y = ${context.parsed.y.toFixed(precision)}`;
            }
            return `f(x) = ${context.parsed.y.toFixed(precision)}`;
          },
        },
      },
    },
  };

  if (!chartData) {
    return <div className="chart-placeholder">No data available for plotting</div>;
  }

  return (
    <div className="interpolation-graph-container">
      <div className="graph-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default InterpolationGraph;
