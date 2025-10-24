// Mock data for 24 hours time line, using an array to make time increments
const hours = Array.from({ length: 24 }, (_, i) => i + ":00");
// Mock data to show lines working, we put 24 for each hour (real one with be every 6 hours)
const phData = [5.0,5.1,5.2,5.3,5.1,5.5,5.4,5.6,5.2,5.5,5.7,5.6,5.6,5.7,5.4,5.6,5.5,5.4,5.6,5.7,5.6,5.6,5.7,5.8];
const tdsData = [750,760,770,780,790,750,765,760,770,760,755,750,740,740,750,755,750,760,750,755,750,765,770,765];
const waterLevelData = [15,16,15,14,15,15,16,15,17,16,15,16,15,16,15,17,15,15,16,15,17,15,16,15];
// Title of chart/where it sits
const lineOption = {
 title: {
   text: 'Water chart demo',
   left: 'center',
   top: 10
 }, //shows data when we hover hover the chart
 tooltip: {
   trigger: 'axis'
 },
 legend: { //show/hide lines that are on the chart
   top: 40,
   data: ['pH Level', 'TDS (ppm)', 'Water Level (%)']
 },
 grid: {//spacing
   left: '8%',
   right: '8%',
   bottom: '10%',
   containLabel: true
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
       lineStyle: { color: '#58D9F9' }
     },
     axisLabel: {
       formatter: '{value}'
     }
   },
   {
     type: 'value',
     name: 'TDS / Water Level',
     position: 'right',
     axisLine: {
       lineStyle: { color: '#FF6E76' }
     },
     axisLabel: {
       formatter: '{value}'
     }
   }
 ],
 series: [
   {
     name: 'pH Level',
     type: 'line',
     smooth: true, //curved lines and not rigid
     yAxisIndex: 0, //which axis to use
     data: phData,
     lineStyle: { //color/thickness
       width: 3,
       color: '#58D9F9'
     },
     areaStyle: { //under the line theres a tint of color
       color: 'rgba(88,217,249,0.1)'
     }
   },
   {
     name: 'TDS (ppm)',
     type: 'line',
     smooth: true,
     yAxisIndex: 1,
     data: tdsData,
     lineStyle: {
       width: 3,
       color: '#FF6E76'
     },
     areaStyle: {
       color: 'rgba(255,110,118,0.1)'
     }
   },
   {
     name: 'Water Level (%)',
     type: 'line',
     smooth: true,
     yAxisIndex: 1,
     data: waterLevelData,
     lineStyle: {
       width: 3,
       color: '#7CFFB2'
     },
     areaStyle: {
       color: 'rgba(124,255,178,0.1)'
     }
   }
 ]
};
// Initialize chart
var lineChart = echarts.init(document.getElementById('lineChart'));
lineChart.setOption(lineOption);
// pH Gauge
var gaugeChart = echarts.init(document.getElementById('gaugeChart'));
const gaugeOption = {
series: [
  { //chart type and shape
  //we created a semi circle
    type: 'gauge',
    startAngle: 180,
    endAngle: 0,
    center: ['50%', '75%'],
    radius: '90%',
    min: 0,
    max: 14, //scale range
    splitNumber: 14, //14 sections
    axisLine: {
      lineStyle: {
        width: 6,
        color: [
          // Acidic
          [0.3, '#FF6E76'], 
          // Slightly more acidic
          [0.5, '#FDDD60'],
          // Neutral
          [0.7, '#58D9F9'],
          // basic
          [1, '#7CFFB2']  
        ]
      }
    },
    pointer: { //pointer needle
      icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
      // svg path for the pointer to be a triangle
      length: '12%',
      width: 20,
      offsetCenter: [0, '-60%'],
      itemStyle: { color: 'auto' }
      //will change colors to match where its pointing
    },
    axisTick: {
      length: 10, // amount of tics in between colors
      lineStyle: { color: 'auto', width: 2 }
    },
    splitLine: { // larger lines
      length: 20,
      lineStyle: { color: 'auto', width: 4 }
    },
    axisLabel: {
      color: '#464646',
      fontSize: 14,
      distance: -50, // so the axis is inside the semi circle
      formatter: function (value) {
        return value % 2 === 0 ? value : ''; // shows the numbers
      }
    },
    title: { // ph level title positioning
    // its higher than the center
      offsetCenter: [0, '-10%'],
      fontSize: 18,
      color: '#333',
      text: 'pH Level'
    },
    detail: { //allows the 0.0 decimal place to be shown
      fontSize: 26,
      offsetCenter: [0, '-35%'],
      valueAnimation: true, // animation smoothness?
      formatter: function (value) {
        return value.toFixed(1) + ' pH';
      },
      color: 'inherit'
    },
    data: [
      { value: 5.7, name: 'pH Level' } // no mock data so we currently have it pointed at the ideal
      //lettuce pH
    ]
  }
]
};


gaugeChart.setOption(gaugeOption);