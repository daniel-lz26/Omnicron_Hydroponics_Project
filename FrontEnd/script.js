var gaugeChart = echarts.init(document.getElementById('gaugeChart'));


const gaugeOption = {
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
         width: 6,
         color: [
           [0.3, '#FF6E76'],   // Acidic
           [0.5, '#FDDD60'],   // Slightly acidic
           [0.7, '#58D9F9'],   // Neutral to slightly basic
           [1, '#7CFFB2']      // Basic
         ]
       }
     },
     pointer: {
       icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
       length: '12%',
       width: 20,
       offsetCenter: [0, '-60%'],
       itemStyle: { color: 'auto' }
     },
     axisTick: {
       length: 10,
       lineStyle: { color: 'auto', width: 2 }
     },
     splitLine: {
       length: 20,
       lineStyle: { color: 'auto', width: 4 }
     },
     axisLabel: {
       color: '#464646',
       fontSize: 14,
       distance: -50,
       formatter: function (value) {
         return value % 2 === 0 ? value : '';
       }
     },
     title: {
       offsetCenter: [0, '-10%'],
       fontSize: 18,
       color: '#333',
       text: 'pH Level'
     },
     detail: {
       fontSize: 26,
       offsetCenter: [0, '-35%'],
       valueAnimation: true,
       formatter: function (value) {
         return value.toFixed(1) + ' pH';
       },
       color: 'inherit'
     },
     data: [
       { value: 5.7, name: 'pH Level' }
     ]
   }
 ]
};


gaugeChart.setOption(gaugeOption);




// ---------- 24-Hour Water Quality Line Chart ----------
var lineChart = echarts.init(document.getElementById('lineChart'));


// Mock data for 24 hours
const hours = Array.from({ length: 24 }, (_, i) => i + ":00");
const phData = [6.8, 6.9, 7.0, 7.1, 7.2, 7.1, 6.9, 6.8, 6.7, 6.5, 6.6, 6.8, 7.0, 7.1, 7.2, 7.1, 7.0, 6.9, 6.8, 6.7, 6.8, 6.9, 7.0, 6.9];
const tdsData = [450, 460, 470, 480, 490, 500, 495, 480, 470, 460, 455, 450, 440, 430, 420, 425, 430, 440, 450, 455, 460, 465, 470, 475];
const waterLevelData = [80, 82, 85, 84, 83, 82, 81, 80, 78, 77, 76, 78, 80, 82, 84, 85, 86, 85, 84, 83, 82, 81, 80, 79];


const lineOption = {
 title: {
   text: '24-Hour Water Quality Trends',
   left: 'center',
   top: 10
 },
 tooltip: { trigger: 'axis' },
 legend: {
   top: 40,
   data: ['pH Level', 'TDS (ppm)', 'Water Level (%)']
 },
 grid: {
   left: '8%',
   right: '8%',
   bottom: '10%',
   containLabel: true
 },
 xAxis: {
   type: 'category',
   boundaryGap: false,
   data: hours,
   name: 'Time (hours)',
   nameLocation: 'middle',
   nameGap: 30
 },
 yAxis: [
   {
     type: 'value',
     name: 'pH Level',
     min: 0,
     max: 14,
     position: 'left',
     axisLine: { lineStyle: { color: '#58D9F9' } },
     axisLabel: { formatter: '{value}' }
   },
   {
     type: 'value',
     name: 'TDS / Water Level',
     position: 'right',
     axisLine: { lineStyle: { color: '#FF6E76' } },
     axisLabel: { formatter: '{value}' }
   }
 ],
 series: [
   {
     name: 'pH Level',
     type: 'line',
     smooth: true,
     yAxisIndex: 0,
     data: phData,
     lineStyle: { width: 3, color: '#58D9F9' },
     areaStyle: { color: 'rgba(88,217,249,0.1)' }
   },
   {
     name: 'TDS (ppm)',
     type: 'line',
     smooth: true,
     yAxisIndex: 1,
     data: tdsData,
     lineStyle: { width: 3, color: '#FF6E76' },
     areaStyle: { color: 'rgba(255,110,118,0.1)' }
   },
   {
     name: 'Water Level (%)',
     type: 'line',
     smooth: true,
     yAxisIndex: 1,
     data: waterLevelData,
     lineStyle: { width: 3, color: '#7CFFB2' },
     areaStyle: { color: 'rgba(124,255,178,0.1)' }
   }
 ]
};


lineChart.setOption(lineOption);