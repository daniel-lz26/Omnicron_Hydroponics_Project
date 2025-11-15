// ---------------------------------------
// API CONFIG
// ---------------------------------------
const API_BASE_URL = 'https://omnicronhydroponicsproject-production.up.railway.app';
const UPDATE_INTERVAL = 30000; // 30 sec refresh

// current live data defaults
let currentData = {
  ph: 6.5,
  tds: 700,
  waterLevel: 75
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

// default placeholders if DB empty
const phData = Array(24).fill(6.0);
const tdsData = Array(24).fill(700);
const waterLevelData = Array(24).fill(30);

// -------------------------
// INITIALIZE LINE CHART
// -------------------------
const lineChart = echarts.init(document.getElementById('lineChart'));

const lineOption = {
  title: {
    text: '24-Hour Water System History',
    left: 'center',
    top: 10
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      let out = params[0].axisValueLabel + "<br/>";
      params.forEach(item => {
        if (item.seriesName === "Water Status") {
          out += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
        } else {
          out += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
        }
      });
      return out;
    }
  },
  legend: {
    top: 40,
    data: ['pH Level', 'TDS (ppm)', 'Water Status']
  },
  grid: { left: '8%', right: '8%', bottom: '10%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: hours },
  yAxis: [
    {
      type: 'value',
      name: 'pH Level',
      min: 0,
      max: 14,
      position: 'left'
    },
    {
      type: 'value',
      name: 'TDS (ppm)',
      position: 'right'
    },
    {
      type: 'category',
      name: 'Water Status',
      position: 'right',
      offset: 80,
      data: ['No', 'Yes']
    }
  ],
  series: [
    {
      name: 'pH Level',
      type: 'line',
      smooth: true,
      yAxisIndex: 0,
      data: phData
    },
    {
      name: 'TDS (ppm)',
      type: 'line',
      smooth: true,
      yAxisIndex: 1,
      data: tdsData
    },
    {
      name: 'Water Status',
      type: 'line',
      smooth: true,
      yAxisIndex: 2,
      data: waterLevelData.map(v => v > 50 ? "Yes" : "No")
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
    data: [{ value: currentData.ph }]
  }]
});

tdsGauge.setOption({
  series: [{
    type: 'gauge',
    startAngle: 180,
    endAngle: 0,
    min: 500,
    max: 900,
    data: [{ value: currentData.tds }]
  }]
});

waterGauge.setOption({
  series: [{
    type: 'gauge',
    startAngle: 180,
    endAngle: 0,
    min: 0,
    max: 1,
    data: [{ value: waterStatusBinary(currentData.waterLevel) }]
  }]
});

// ---------------------------------------
// UPDATE GAUGE WITH LIVE DATA
// ---------------------------------------
function updateGaugeCharts(data) {
  currentData.ph = data.ph_level;
  currentData.tds = data.nutrient_level;
  currentData.waterLevel = data.water_level;

  phGauge.setOption({
    series: [{ data: [{ value: currentData.ph }] }]
  });

  tdsGauge.setOption({
    series: [{ data: [{ value: currentData.tds }] }]
  });

  waterGauge.setOption({
    series: [{
      data: [{ value: waterStatusBinary(currentData.waterLevel) }]
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
      { data: last24.map(r => r.ph_level) },
      { data: last24.map(r => r.nutrient_level) },
      { data: last24.map(r => (r.water_level > 50 ? "Yes" : "No")) }
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
