// ---------------------------------------
// API CONFIG
// ---------------------------------------
const API_BASE_URL = 'https://omnicronhydroponicsproject-production.up.railway.app';
const UPDATE_INTERVAL = 30000; // 30 sec refresh

// current live data (no defaults - waits for API)
let currentData = {
  ph: null,
  tds: null,
  waterLevel: null
};

// ---------------------------------------
// WATER STATUS HELPERS
// ---------------------------------------
function getWaterStatus(level) {
  if (level < 7) return "OUT OF WATER";
  if (level > 50) return "IN WATER";
  return "MID LEVEL";
}

// gauge needs binary: 0 = no water, 1 = water
function waterStatusBinary(level) {
  return level > 50 ? 1 : 0;
}

// color for line chart + gauge
function getWaterColor(level) {
  if (level < 7) return '#D55E00';   // red
  if (level > 50) return '#009E73';  // green
  return '#E69F00';                  // orange
}

// ---------------------------------------
// FETCH FUNCTIONS
// ---------------------------------------
async function fetchLatestReading() {
  try {
    const res = await fetch(`${API_BASE_URL}/readings/latest`);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    console.error("❌ Latest reading error:", e);
    return null;
  }
}

async function fetchAllReadings() {
  try {
    const res = await fetch(`${API_BASE_URL}/readings/`);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    console.error("❌ Error fetching all readings:", e);
    return [];
  }
}

// ---------------------------------------
// ECHARTS SETUP
// ---------------------------------------
const hours = Array.from({ length: 24 }, (_, i) => i + ":00");

// -------------------------
// INITIALIZE LINE CHART
// -------------------------
const lineChart = echarts.init(document.getElementById('lineChart'));

const lineOption = {
  title: {
    text: '24-Hour pH Level History',
    left: 'center',
    top: 10
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      let out = params[0].axisValueLabel + "<br/>";
      params.forEach(item => {
        out += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
      });
      return out;
    }
  },
  legend: {
    top: 40,
    data: ['pH Level']
  },
  grid: { left: '8%', right: '8%', bottom: '10%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: hours },
  yAxis: {
    type: 'value',
    name: 'pH Level',
    min: 0,
    max: 14,
    position: 'left'
  },
  series: [
    {
      name: 'pH Level',
      type: 'line',
      smooth: true,
      itemStyle: { color: '#0072B2' }, // colorblind-friendly blue
      lineStyle: { color: '#0072B2' },
      data: []
    }
  ]
};

lineChart.setOption(lineOption);

// ---------------------------------------
// GAUGES
// ---------------------------------------
const phGauge = echarts.init(document.getElementById('phGaugeChart'));
const tdsGauge = echarts.init(document.getElementById('tdsGaugeChart'));
const waterGauge = echarts.init(document.getElementById('waterLevelGaugeChart'));

phGauge.setOption({
  series: [{
    type: 'gauge',
    startAngle: 180,
    endAngle: 0,
    min: 0,
    max: 14,
    splitNumber: 7,
    axisLine: {
      lineStyle: {
        width: 20,
        color: [
          [0.35, '#D55E00'],  // red (acidic)
          [0.5, '#E69F00'],   // orange (slightly acidic)
          [0.65, '#009E73'],  // green (neutral/optimal)
          [0.8, '#E69F00'],   // orange (slightly alkaline)
          [1, '#D55E00']      // red (alkaline)
        ]
      }
    },
    axisTick: { distance: -20, length: 8 },
    axisLabel: { distance: -35, fontSize: 12 },
    detail: {
      formatter: '{value}',
      fontSize: 20,
      offsetCenter: [0, '70%']
    },
    title: {
      offsetCenter: [0, '90%'],
      fontSize: 14
    },
    data: [{ value: 0, name: 'pH Level' }]
  }]
});

tdsGauge.setOption({
  series: [{
    type: 'gauge',
    startAngle: 180,
    endAngle: 0,
    min: 0,
    max: 2000,
    splitNumber: 8,
    axisLine: {
      lineStyle: {
        width: 20,
        color: [
          [0.25, '#D55E00'],  // red (very low)
          [0.4, '#E69F00'],   // orange (low)
          [0.7, '#009E73'],   // green (optimal 500-1400)
          [0.85, '#E69F00'],  // orange (high)
          [1, '#D55E00']      // red (very high)
        ]
      }
    },
    axisTick: { distance: -20, length: 8 },
    axisLabel: { distance: -35, fontSize: 12 },
    detail: {
      formatter: '{value} ppm',
      fontSize: 18,
      offsetCenter: [0, '70%']
    },
    title: {
      offsetCenter: [0, '90%'],
      fontSize: 14
    },
    data: [{ value: 0, name: 'PPM (TDS)' }]
  }]
});

waterGauge.setOption({
  series: [{
    type: 'gauge',
    startAngle: 180,
    endAngle: 0,
    min: 0,
    max: 1,
    splitNumber: 1,
    axisLine: {
      lineStyle: {
        width: 20,
        color: [
          [0.5, '#D55E00'],   // red (no water)
          [1, '#009E73']      // green (water detected)
        ]
      }
    },
    axisTick: { show: false },
    axisLabel: {
      distance: -35,
      fontSize: 12,
      formatter: function(value) {
        return value === 0 ? 'No' : 'Yes';
      }
    },
    detail: {
      formatter: function(value) {
        return value === 1 ? 'WATER' : 'NO WATER';
      },
      fontSize: 18,
      offsetCenter: [0, '70%'],
      color: 'auto'
    },
    title: {
      offsetCenter: [0, '90%'],
      fontSize: 14
    },
    data: [{ value: 0, name: 'Water Status' }]
  }]
});

// ---------------------------------------
// UPDATE GAUGE WITH LIVE DATA
// ---------------------------------------
function updateGaugeCharts(data) {
  if (!data || data.ph_level === undefined || data.nutrient_level === undefined || data.water_level === undefined) {
    console.warn("⚠️ Invalid or incomplete data received:", data);
    return;
  }

  currentData.ph = data.ph_level;
  currentData.tds = data.nutrient_level;
  currentData.waterLevel = data.water_level;

  phGauge.setOption({
    series: [{
      data: [{ value: currentData.ph, name: 'pH Level' }]
    }]
  });

  tdsGauge.setOption({
    series: [{
      data: [{ value: currentData.tds, name: 'PPM (TDS)' }]
    }]
  });

  waterGauge.setOption({
    series: [{
      data: [{ value: waterStatusBinary(currentData.waterLevel), name: 'Water Status' }]
    }]
  });
}

// ---------------------------------------
// UPDATE LINE CHART WITH HISTORY
// ---------------------------------------
function updateLineChart(readings) {
  if (readings.length < 1) return;

  const last24 = readings.slice(-24);

  const timestamps = last24.map(r => {
    let d = new Date(r.timestamp);
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  lineChart.setOption({
    xAxis: { data: timestamps },
    series: [
      { data: last24.map(r => r.ph_level) }
    ]
  });
}

// ---------------------------------------
// INITIALIZATION + LIVE LOOP
// ---------------------------------------
async function initializeCharts() {
  const latest = await fetchLatestReading();
  if (latest) updateGaugeCharts(latest);

  const history = await fetchAllReadings();
  if (history) updateLineChart(history);

  setInterval(async () => {
    const latest = await fetchLatestReading();
    if (latest) updateGaugeCharts(latest);

    const history = await fetchAllReadings();
    if (history) updateLineChart(history);
  }, UPDATE_INTERVAL);
}

document.addEventListener('DOMContentLoaded', initializeCharts);

window.addEventListener('resize', () => {
  lineChart.resize();
  phGauge.resize();
  tdsGauge.resize();
  waterGauge.resize();
});
