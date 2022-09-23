<template>
  <div
    style="float: left; background-color: lightgray; margin: 2px; width: 14.6%"
  >
    <Doughnut
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
import { DataLabelFormatter } from "../common.js";

import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: "ChartPieByResource",
  components: { Doughnut },
  props: {
    chartId: {
      type: String,
      default: "piechartbyicm",
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
    plugins: {
      type: Object,
      default: () => {},
    },
    chartData: {
      type: Object,
      required: true,
    },
  },

  methods: {    
  },

  data() {
    return {
    // store the orginal background color
      original_backgroundColor:"",
      chartOptions: {
        responsive: true,       
        layout: {
          padding: 10,
        },

        pieceLabel: {
          mode: "percentage",
          precision: 1,
        },

        elements: {
          arc: {
            borderWidth: 0, // <-- Set this to derired value
            borderColor: "#fff",
          },
        },
        plugins: {
          title: {
            display: true,
            text: ["Engineers Availability Status"],
          },

          legend: {
            display: true,
            align: "start",
          },

          datalabels: {
            color: "white",
            formatter: (value, ctx) => {
              return DataLabelFormatter(value, ctx);
            },
          },

          //tooltip
          tooltip: {
            callbacks: {
              label: function (context) {
                let total = 0;
                for (
                  let index = 0;
                  index < context.dataset.data.length;
                  index++
                ) {
                  total += context.dataset.data[index];
                }
                let currentvalue = context.parsed;
                let label = context.label;
                let percent = ((100 * currentvalue) / total).toFixed(1);
               
                let tips =[ label,  "Count: " + currentvalue,  "Percentage: " + percent + "%"];
                
                return tips;
              },
            },
          },
          //tooltip ends
        },
      },
    };
  },
};
</script>