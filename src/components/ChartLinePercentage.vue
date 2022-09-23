<template>
  <div
    style="
      float: left;
      background-color: lightgray;
      margin: 2px;
      height: 8%;
    "
    :style="'width:' + width_param + '%'"
  >
    <Line
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>

import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
);

export default {
  name: "ChartLinePercentage",
  components: { Line },
  props: {
    chartId: {
      type: String,
      default: "pieline",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },

    title: {
      default: "",
      type: String,
    },

     width_param:{
      type : Number,
      default: 40,
    },

    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Object,
      default: () => {},
    },
    chartData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      // store the orginal background color
      original_backgroundColor: "",
      chartOptions: {
        responsive: true,  
        elements: {
            line: {
                tension: 0.4, // disables bezier curves
            }
        } ,
      
        layout: {
          padding: 10,
        },
       
      //  scales: {
      //               xAxes: [{
      //                       display: true,
      //                       scaleLabel: {
      //                           display: true,
      //                           labelString: 'Date'
      //                       }
      //                   }],
      //               yAxes: [{
      //                       display: true,
      //                       ticks: {
      //                           beginAtZero: true,
      //                           steps: 10,
      //                           stepValue: 5,
      //                           max: 100
      //                       }
      //                   }]
      //           },


       scales: {
          x: {
            display: true,            
            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            },
          },

          y: {
            display: true,
            min: 0,
            max: 100,

            ticks: {
              stepSize: 10,              
            },
          },
        },

        plugins: {
          title: {
            display: true,
            text: [this.title],
          },
          
        datalabels: {
            color: "white",
            formatter:() => {
              return "";
            },
          },

        // //tooltip
        //   tooltip: {
        //     callbacks: {
        //       label: function (context) {
        //         console.log(context);

        //         return [
                
        //         ];
        //       },
        //     },
        //   },
        //   //tooltip ends
         
         },
      },
    };
  },
};
</script>