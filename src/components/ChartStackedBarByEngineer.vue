<template>
  <div
    style="
      float: left;
      background-color: lightgray;
      margin: 2px;
      width: 25.4%;
      height: 8%;
    "
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
  name: "ChartStackedBarByEngineer",
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
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: true,          

          },
          title: {
              display: false,             
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

        
        //---------
          scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            
            ticks: {
              stepSize: 1,
            },
            
          }
        }
        //-----------
      },
    };
  },
};
</script>
