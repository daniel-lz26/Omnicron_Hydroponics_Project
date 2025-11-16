//Hai this is Bryan
const API_BASE_URL = 'https://omnicronhydroponicsproject-production.up.railway.app';
const UPDATE_INTERVAL = 30000; // 30 sec refresh

// current live data 
let currentData = {
  ph: null,
  tds: null,
  waterLevel: null
};

// determines if in or out of water
function getWaterStatus(level) {
  if (level < 0.07) return "OUT OF WATER";
  if (level > 0.5) return "IN WATER";
  return "MID LEVEL";
}

// for gauge 0 = no water, 1 = water
function waterStatusBinary(level) {
  if (level < 7) return 0;  
  if (level > 50) return 1;  
  return 0;  
}

// colors for charts
function getWaterColor(level) {
  if (level < 7) return '#D55E00';   
  if (level > 50) return '#009E73';  
  return '#E69F00';                  
}

// fetch functions

async function fetchLatestReading() {
  try {
    const res = await fetch(`${API_BASE_URL}/readings/latest`);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    console.error(" Latest reading error:", e);
    return null;
  }
}

async function fetchAllReadings() {
  try {
    const res = await fetch(`${API_BASE_URL}/readings/`);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    console.error("Error fetching all readings:", e);
    return [];
  }
}

// setting up echarts
const hours = Array.from({ length: 24 }, (_, i) => i + ":00");

// line chart
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
      itemStyle: { color: '#0072B2' }, // colorblind-friendly blue :)
      lineStyle: { color: '#0072B2' },
      data: []
    }
  ]
};

lineChart.setOption(lineOption);

// Gauge charts
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
          [0.35, '#D55E00'],  //as the meter moves to the right, the more basic the water is
          [0.5, '#E69F00'],   
          [0.65, '#009E73'],  
          [0.8, '#E69F00'],   
          [1, '#D55E00']      
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
          [0.25, '#D55E00'],  // tds range, as it moves to the right, the more ppm there is
          [0.4, '#E69F00'],   
          [0.7, '#009E73'],   
          [0.85, '#E69F00'],  
          [1, '#D55E00']      
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

//update live data to the gauge charts
function updateGaugeCharts(data) {
  if (!data || data.ph_level === undefined || data.nutrient_level === undefined || data.water_level === undefined) {
    console.warn("⚠️ Invalid or incomplete data received:", data);
    return;
  }

  // Debug: Log raw API data
  console.log("📊 Raw API Data:", {
    ph_level: data.ph_level,
    nutrient_level: data.nutrient_level,
    water_level: data.water_level
  });

  currentData.ph = data.ph_level;
  currentData.tds = data.nutrient_level;
  currentData.waterLevel = data.water_level;

  // Debug: Log what we're sending to each gauge
  console.log("🎯 Gauge Updates:", {
    "pH Gauge (should be 0-14)": currentData.ph,
    "TDS Gauge (should be 500-2000 ppm)": currentData.tds,
    "Water Gauge (should be 0 or 1)": waterStatusBinary(currentData.waterLevel),
    "Water Level Raw (%)": currentData.waterLevel
  });

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

//adding history to the line charts
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

// loop
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
