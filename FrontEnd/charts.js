// bryan's: hai this does api configuration
const API_BASE_URL = 'http://localhost:8000'; // this will change w raspberry pi URL
const UPDATE_INTERVAL = 30000; // update int: 30 sec
let allReadings = [];

// current live data
let currentData = {
  ph: 6.5, tds: 700, waterLevel: 75
};




// Mock data for 24 hours time line, using an array to make time increments
const hours = Array.from({ length: 24 }, (_, i) => i + ":00");
// Mock data to show lines working, we put 24 for each hour (real one with be every 6 hours)
const phData = [5.0,5.1,5.2,5.3,5.1,5.5,5.4,5.6,5.2,5.5,5.7,5.6,5.6,5.7,5.4,5.6,5.5,5.4,5.6,5.7,5.6,5.6,5.7,5.8];
const tdsData = [750,760,770,780,790,750,765,760,770,760,755,750,740,740,750,755,750,760,750,755,750,765,770,765];
const waterLevelData = [15,16,15,14,15,15,16,15,17,16,15,16,15,16,15,17,15,15,16,15,17,15,16,15];
// Title of chart/where it sits
const lineOption = {
  backgroundColor: '#f9fafb',
 title: {
   text: 'water chart demo',
   left: 'center',
   top: 10
 }, //shows data when we hover hover the chart
 tooltip: {
   trigger: 'axis'
 },
 legend: { //show/hide lines that are on the chart
   top: 35,
   data: ['pH level', 'TDS (ppm)', 'water level (%)']
 },
 grid: {//spacing
   left: '3%',
   right: '4%',
   bottom: '3%',
   containLabel: true,
   borderWidth: 2,
   borderColor: '#000000'
 },
 xAxis: { //24 hour x axis
   type: 'category',
   boundaryGap: false,
   data: hours,
   name: 'Time (hours)',
   nameLocation: 'middle',
   nameGap: 30
 },
 yAxis: [// left is ph and right is tds
   {
     type: 'value',
     name: 'pH Level',
     min: 0,
     max: 14,
     position: 'left',
     axisLine: {
       lineStyle: { color: '#000000ff' }
     },
     axisLabel: {
       formatter: '{value}'
     }
   },
   {
     type: 'value',
     name: 'TDS / Water Level',
     position: 'right',
     min: 0,
     max: 2000,
     axisLine: {
       lineStyle: { color: '#000000ff' }
     },
     axisLabel: {
       formatter: '{value}'
     }
   }
 ],
 series: [
   {
     name: 'pH level',
     type: 'line',
     smooth: true, //curved lines and not rigid
     yAxisIndex: 0, //which axis to use
     data: phData,
   },
   {
     name: 'TDS (ppm)',
     type: 'line',
     smooth: true,
     yAxisIndex: 1,
     data: tdsData,
   },
   {
     name: 'water level (%)',
     type: 'line',
     smooth: true,
     yAxisIndex: 1,
     data: waterLevelData,
   }
 ]
};
// Initialize chart
var lineChart = echarts.init(document.getElementById('lineChart'));
lineChart.setOption(lineOption);

// initializing gauge charts :3
var phGaugeChart = echarts.init(document.getElementById('phGaugeChart'));
var tdsGaugeChart = echarts.init(document.getElementById('tdsGaugeChart'));
var waterLevelGaugeChart = echarts.init(document.getElementById('waterLevelGaugeChart'));

// okabe-ito colorblind-friendly palette
// ph gauge chart
const phGaugeOption = {
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      center: ['50%', '75%'],
      radius: '90%',
      min: 0,
      max: 14,
      splitNumber: 14,
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [6/14,  '#0072B2'],
            [7/14,  '#56B4E9'],
            [8/14,  '#009E73'],
            [12/14, '#E69F00'],
            [1.0,   '#CC79A7']
          ]
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 24,
        offsetCenter: [0, '-60%'],
        itemStyle: { color: '#333' }
      },
      axisTick: {
        length: 12,
        lineStyle: { color: '#333', width: 3 }
      },
      splitLine: {
        length: 25,
        lineStyle: { color: '#333', width: 5 }
      },
      axisLabel: {
        color: '#222',
        fontSize: 16,
        fontWeight: 'bold',
        distance: -55,
        formatter: function (v) { return v % 2 === 0 ? v : ''; }
      },
      title: {
        offsetCenter: [0, '-10%'],
        fontSize: 20,
        color: '#222',
        fontFamily: 'DM Sans, sans-serif'
      },
      detail: {
        fontSize: 32,
        fontWeight: 'bold',
        offsetCenter: [0, '-35%'],
        valueAnimation: true,
        formatter: v => v.toFixed(1) + ' pH',
        color: '#222',
        fontFamily: 'DM Sans, sans-serif'
      },
      data: [{ value: currentData.ph, name: 'pH Level' }]
    }
  ]
};


// tds gauge chart
const tdsGaugeOption = {
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      center: ['50%', '75%'],
      radius: '90%',
      min: 500,
      max: 900,
      splitNumber: 8,
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [0.375, '#0072B2'], // 500–650  (Low) - blue
            [0.625, '#009E73'], // 650–750  (Moderate) - teal
            [0.875, '#E69F00'], // 750–850  (High) - orange
            [1.000, '#CC79A7']  // 850–900  (Very High) - magenta
          ]
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 24,
        offsetCenter: [0, '-60%'],
        itemStyle: { color: '#333' }
      },
      axisTick: {
        length: 12,
        lineStyle: { color: '#333', width: 3 }
      },
      splitLine: {
        length: 25,
        lineStyle: { color: '#333', width: 5 }
      },
      axisLabel: {
        color: '#222',
        fontSize: 16,
        fontWeight: 'bold',
        distance: -55,
        formatter: function (value) {
          return value % 100 === 0 ? value : '';
        }
      },
      title: {
        offsetCenter: [0, '-10%'],
        fontSize: 20,
        color: '#222',
        fontFamily: 'DM Sans, sans-serif'
      },
      detail: {
        fontSize: 32,
        fontWeight: 'bold',
        offsetCenter: [0, '-35%'],
        valueAnimation: true,
        formatter: function (value) {
          return value.toFixed(0) + ' ppm';
        },
        color: '#222',
        fontFamily: 'DM Sans, sans-serif'
      },
      data: [{ value: currentData.tds, name: 'TDS (ppm)' }]
    }
  ]
};

// water lvl gauge chart
const waterLevelGaugeOption = {
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      center: ['50%', '75%'],
      radius: '90%',
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [0.40, '#0072B2'],  // Low
            [0.60, '#56B4E9'],  // OK
            [0.80, '#009E73'],  // Ideal
            [0.90, '#E69F00'],  // High
            [1.00, '#CC79A7']   // Very High
          ]
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 24,
        offsetCenter: [0, '-60%'],
        itemStyle: { color: '#333' }
      },
      axisTick: {
        length: 12,
        lineStyle: { color: '#333', width: 3 }
      },
      splitLine: {
        length: 25,
        lineStyle: { color: '#333', width: 5 }
      },
      axisLabel: {
        color: '#222',
        fontSize: 16,
        distance: -55,
        fontWeight: 'bold',
        formatter: function (value) {
          return value % 20 === 0 ? value : '';
        }
      },
      title: {
        offsetCenter: [0, '-10%'],
        fontSize: 20,
        color: '#222',
        fontFamily: 'DM Sans, sans-serif'
      },
      detail: {
        fontSize: 32,
        offsetCenter: [0, '-35%'],
        fontWeight: 'bold',
        valueAnimation: true,
        formatter: function (value) {
          return value.toFixed(0) + '%';
        },
        color: '#222',
        fontFamily: 'DM Sans, sans-serif'
      },
      data: [{ value: currentData.waterLevel, name: 'water level (%)' }]
    }
  ]
};

phGaugeChart.setOption(phGaugeOption);
tdsGaugeChart.setOption(tdsGaugeOption);
waterLevelGaugeChart.setOption(waterLevelGaugeOption);

// api functions
// falls back to mock data if API fails
async function fetchLatestReading() {
  try {
    const response = await fetch(`${API_BASE_URL}/readings/latest`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching latest reading:', error);
    return null;
  }
}

async function fetchAllReadings() {
  try {
    const response = await fetch(`${API_BASE_URL}/readings/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all readings:', error);
    return [];
  }
}

// updates gauge charts w live data
function updateGaugeCharts(data) {
  if (data) {
    currentData.ph = data.ph_level;
    currentData.tds = data.nutrient_level;
    currentData.waterLevel = data.water_level;

    // ph gauge
    phGaugeChart.setOption({
      series: [{
        data: [{ value: currentData.ph, name: 'pH Level' }]
      }]
    });

    // tds
    tdsGaugeChart.setOption({
      series: [{
        data: [{ value: currentData.tds, name: 'TDS (ppm)' }]
      }]
    });

    // water lvl
    waterLevelGaugeChart.setOption({
      series: [{
        data: [{ value: currentData.waterLevel, name: 'Water Level' }]
      }]
    });
  }
}

// updatds line chart w de historical data
function updateLineChart(readings) {
  if (readings && readings.length > 0) {
    const last24 = readings.slice(-24);
    
    if (last24.length > 0) {
      const timestamps = last24.map(reading => {
        const date = new Date(reading.timestamp);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      });
      
      const phValues = last24.map(reading => reading.ph_level);
      const tdsValues = last24.map(reading => reading.nutrient_level);
      const waterValues = last24.map(reading => reading.water_level);

      lineChart.setOption({
        xAxis: {
          data: timestamps.length >= 24 ? timestamps : hours
        },
        series: [
          { data: phValues.length >= 24 ? phValues : phData },
          { data: tdsValues.length >= 24 ? tdsValues : tdsData },
          { data: waterValues.length >= 24 ? waterValues : waterLevelData }
        ]
      });
    }
  }
}

// initailizes data loading
async function initializeCharts() {
  console.log('Initializing charts with live data...');
  
  const latestReading = await fetchLatestReading();
  if (latestReading) {
    updateGaugeCharts(latestReading);
  }

  const allReadings = await fetchAllReadings();
  if (allReadings) {
    updateLineChart(allReadings);
  }

  // sets up the periodic updates
  setInterval(async () => {
    console.log('Updating charts with latest data...');
    const latestReading = await fetchLatestReading();
    if (latestReading) {
      updateGaugeCharts(latestReading);
    }

    const allReadings = await fetchAllReadings();
    if (allReadings) {
      updateLineChart(allReadings);
    }
  }, UPDATE_INTERVAL);
}

// window resize handler
window.addEventListener('resize', function() {
  lineChart.resize();
  phGaugeChart.resize();
  tdsGaugeChart.resize();
  waterLevelGaugeChart.resize();
});

document.addEventListener('DOMContentLoaded', initializeCharts);
