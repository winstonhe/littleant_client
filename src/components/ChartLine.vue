<template>
  <div
    style="float: left; background-color: lightgray; margin: 2px; height: 8%"
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
  name: "ChartLine",
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

    width_param: {
      type: Number,
      default: 40,
    },

    minValue: {
      type: Number,
      default: 0,
    },

    maxValue: {
      type: Number,
      default: 100,
    },

    stepValue: {
      type: Number,
      default: 20,
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

  // computed: {
  //   Computed_maxValue() {
  //     return this.$props.maxValue;
  //   },

  //    Computed_stepValue() {
  //     return this.$props.stepValue;
  //   },
  // },

  updated() {
    this.chartOptions.scales.y.max = this.$props.maxValue;  
    this.chartOptions.scales.y.ticks.stepSize = this.$props.stepValue;
   
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
          },
        },

        layout: {
          padding: 10,
        },

        scales: {
          y: {
            display: true,
            //min: this.minValue,//this.$props.minValue,
            max: this.$props.maxValue,
            min: this.$props.minValue, 

            ticks: {
              stepSize: this.$props.stepValue,
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
            formatter: () => {
              return "";
            },
          },
        },
      },
    };
  },
};
</script>