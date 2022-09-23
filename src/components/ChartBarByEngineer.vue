<template>
  <div
    style="
      float: left;
      background-color: lightgray;
      margin: 2px;
      width: 40%;
      height: 8%;
    "
       :style="'width:'+width_param+'%'"
  >
    <Bar
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
import { Bar } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

export default {
  name: "ChartBarByEngineer",
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
     width_param:{
      type : Number,
      default: 40,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },

    chartData: {
      type: Object,
      required: true,
    },
    title:{
      type:String,
    },

     stepValue: {
      type: Number,
      default: 5,
    },


  },
  data() {
    return {
      chartOptions: {
        responsive: true,

        scales: {
                y: {               

                  ticks: {
                    stepSize: this.$props.stepValue,
                  },
                },
              },

        
        plugins: {
          legend: {
            display: true,          

          },
          title: {
              display: false,
              text: this.$props.title,
            },

          datalabels: {
            color: "white", 
            formatter: (value) => {
              if(value!=0 || value !='0'){               
                 return value;
                 }
                 return "";
            },          
          },
         
        },
      },
    };
  },
};
</script>
