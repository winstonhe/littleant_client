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
import { DataLabelFormatter} from "../common.js";
import { Doughnut } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  ChartDataLabels
);

export default {
  name: "ChartPieByRegion",
  components: { Doughnut },
  props: {
    chartId: {
      type: String,
      default: "piechartbyregion",
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
     Filter_ServiceTickets_FromChart(evt, item) {
     
     //const clicked_backgroundColor = 'blue'
     // get the selected label which will be conditiion to filter
     
       if(this.$props.chartData.labels.length==1) return; // only one label, then do nothing
      let selectedIndex=item[0].index;
      let selectedLabel= this.$props.chartData.labels[selectedIndex]  

     

    //   let index_for_BlackColor = this.$props.chartData.datasets[0].backgroundColor.indexOf(clicked_backgroundColor)

    //   if( index_for_BlackColor !== -1 && index_for_BlackColor != selectedIndex ) return;

    //  let current_backgroundColor = this.$props.chartData.datasets[0].backgroundColor[item[0].index]

    //  // retrieve the original background color
    //  if(current_backgroundColor  !=clicked_backgroundColor) {
    //       this.original_backgroundColor = this.$props.chartData.datasets[0].backgroundColor[item[0].index];
    //       this.$props.chartData.datasets[0].backgroundColor[item[0].index]= clicked_backgroundColor;
    //       this.$props.chartData.labels[item[0].index] +=" \u221A";
    //       console.log("begin to filer");

           this.$emit("E_FilterServiceTicketsFromChart", "REGION", selectedLabel);
    //  }
    //  else { // backgron coor is black already, so it's 2nd click and we need to restore the background color 

    //         this.$props.chartData.datasets[0].backgroundColor[item[0].index] = this.original_backgroundColor;
    //         this.$props.chartData.labels[item[0].index] = this.$props.chartData.labels[item[0].index].slice(0, this.$props.chartData.labels[item[0].index].length - 2);
    //         console.log("remove fintler");
    //  }      
  
    },
  },

  data() {
    return {
      chartOptions: {
        responsive: true,
        onClick: this.Filter_ServiceTickets_FromChart,

        pieceLabel: {
          mode: "percentage",
          precision: 1,
        },

        layout: {
          padding: 10,
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
            text: "Case Distribution by Region",
          },

          legend: {
            display: true,
            align: "start",
          },
          datalabels: {
            color: "white",
            useHTML: true,
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
                // if (context.dataset.data.length > 1) {
                //   tips = [...tips,""]
                //   tips = [...tips,"Click to filter data"]
                // }
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