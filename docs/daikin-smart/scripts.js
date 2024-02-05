const fetchMetrics = async () => {
  const { hash, pathname } = document.location;
  const id = hash.replace(/^#/, '') || 'test';
  const response = await fetch(`https://d3qhojbpnd45u2.cloudfront.net/${id}.json`);

  if (pathname.match('dashboard') && !response.ok) {
    window.location = '/daikin-smart/';
  }

  const { energy, prices, temps } = await response.json();
  // TODO: Use timezone offset?
  const shiftedEnergy = energy.map(({ time, value }) => ({
    time: new Date(new Date(time).getTime() + 1000 * 3600).toISOString(),
    value,
  }));

  const totalConsumtion = shiftedEnergy.reduce((sum, { value }) => sum + value, 0);
  const totalConsumtionRounded = Math.round((totalConsumtion + Number.EPSILON) * 100) / 100;
  document.getElementById('consumtion').innerHTML = totalConsumtionRounded;

  const totalCost = shiftedEnergy.reduce((sum, { time, value }) => {
    const energyTime = new Date(time).getTime();

    const energyPrice = prices
      .find((price) => new Date(price.time).getTime() === energyTime)

    return sum + value * (energyPrice?.value || 0);
  }, 0);

  const averagePrice = prices.reduce((a, { value }) => a + value, 0) / prices.length;
  const averagePriceCost = totalConsumtion * averagePrice;

  const savings = (1 - totalCost / averagePriceCost) * 100;

  document.getElementById('savings').innerHTML = Math.max(
    Math.round(savings * 10) / 10,
    0,
  );

  const chartConfig = getChartConfig();

  chartConfig.data.datasets[0].data = shiftedEnergy
    .map(({ time: x, value: y }) => ({ x, y }));
  chartConfig.options.scales.energy.suggestedMax = Math.round(
    Math.max(...shiftedEnergy.map(({ value }) => value)) * 1.5
  );

  chartConfig.data.datasets[1].data = prices
    .map(({ time: x, value: y }) => ({ x, y: Math.round(y * 100) }));

  new Chart(document.getElementById('chart'), chartConfig);

  // Temps chart.

  const tempChartConfig = getChartConfig();

  const tempLabels = {
    leavingWater: 'Framledning',
    outdoor: 'Utomhus',
    room: 'Rum',
    tank: 'Varmvatten',
    target: 'Mål',
  };

  const tempChart = document.getElementById('chart-temp');

  if (temps) {
    tempChartConfig.data.datasets = Object.entries(temps)
      .map(([metric, points]) => ({
        type: 'line',
        label: tempLabels[metric],
        pointHoverRadius: 4,
        pointHoverBorderWidth: 8,
        yAxisID: 'temp',
        data: points
          .map(transformPoint)
          .filter(filterTemps),
        tension: 0.4,
        cubicInterpolationMode: 'monotone',
      }));
  } else {
    tempChart && tempChart.remove();
  }

  tempChartConfig.options.scales.temp.display = true;
  tempChartConfig.options.scales.price.display = false;
  tempChartConfig.options.scales.energy.display = false;

  if (tempChart) {
    new Chart(tempChart, tempChartConfig);
  }
};

const stepSize = (input) => Math.round(input.scale.max / 3);

const filterTemps = ({ y }) => y > -100;

const transformPoint = ({ time: x, value: y }) => ({ x, y });

const capitalize = (input) =>
  input.charAt(0).toUpperCase() + input.slice(1);

// https://www.chartjs.org/docs/latest/samples/advanced/linear-gradient.html
let width, height, gradient;
function getGradient(ctx, chartArea) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed.
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgb(0, 206, 165)'); // app: rgb(92, 202, 167)
    gradient.addColorStop(0.5, 'rgb(255, 211, 52)');
    gradient.addColorStop(1, 'rgb(224, 95, 9)'); // app: rgb(229, 158, 82)
  }

  return gradient;
}

Chart.defaults.font = {
  family: '"Open Sans", sans-serif',
  size: 16,
  lineHeight: 1.5,
};

Chart.defaults.color = '#515151';

const getChartConfig = () => ({
  locale: 'sv',
  type: 'scatter',
  data: {
    datasets: [
      {
        type: 'bar',
        label: 'Förbrukning',
        borderWidth: 0,
        backgroundColor: 'rgba(202, 68, 51, 1)',
        borderRadius: {
          topLeft: 4,
          topRight: 4,
        },
        yAxisID: 'energy',
        order: 1,
      },
      {
        type: 'line',
        label: 'Elpris',
        fill: false,
        stepped: true,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 12,
        borderColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // This case happens on initial chart load
          if (!chartArea) return;

          return getGradient(ctx, chartArea);
        },
        pointBorderWidth: 0,
        yAxisID: 'price',
        order: 0,
      }
    ],
  },
  options: {
    normalized: true,
    plugins: {
      tooltip: {
        callbacks: {
          title: ([{ parsed: { x } }]) => {
            const date = new Date(x);
            const day = new Intl.DateTimeFormat('sv-SE', { weekday: 'long' }).format(date);
            const time = new Intl.DateTimeFormat('sv-SE', { hour: 'numeric', minute: 'numeric' }).format(date);

            return `${capitalize(day)} ${time}`;
          },
          label: (context) => {
            const { yAxisID: axis, label } = context.dataset;
            const { y: value } = context.parsed;

            if (axis === 'price') {
              return `${value} öre`;
            }

            if (axis === 'energy') {
              return `${value} kWh`;
            }

            if (axis === 'temp') {
              return `${label}: ${value} °C`;
            }
          }
        },
        padding: {
          top: 15,
          bottom: 15,
          left: 25,
          right: 25,
        },
        displayColors: false,
        titleAlign: 'center',
        bodyAlign: 'center',
      },
      legend: {
        display: false,
      }
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'x',
    },
    elements: {
      point: {
        radius: 0,
      }
    },
    scales: {
      x: {
        type: 'time',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: (value) => new Date(value).toString().substring(16, 18),
        }
      },
      energy: {
        beginAtZero: true,
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          tickWidth: false
        },
        ticks: {
          padding: 0,
          callback: (value) => `${value} kWh`,
          stepSize,
        },
      },
      temp: {
        type: 'linear',
        display: false,
        position: 'left',
        ticks: {
          padding: 0,
          callback: (value) => `${value} °C`,
          stepSize,
        },
      },
      price: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          display: false,
        },
        ticks: {
          padding: 0,
          callback: (value) => `${value} öre`,
          stepSize,
        },
      },
    }
  }
});

fetchMetrics();
