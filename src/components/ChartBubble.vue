<template>
  <div
    style="
      float: left;
      background-color: lightgray;
      margin: 2px;
      
      height: 8%;
    "
    :style="'width:'+width_param+'%'"
  >
    <Bubble
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
import { Bubble } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, PointElement, LinearScale);

export default {
  name: "ChartBubble",
  components: { Bubble },
  props: {
    interactive:{
        type:Boolean,
        default:true
    },
    chartId: {
      type: String,
      default: "bubblechartbyagebyidle",
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
    width_param:{
      type : Number,
      default: 40,
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
    appstylemode : {
      default: "DARK",
      type: String,
    },
  },

  methods: {
    OpenDFMCase(evt, item) {
        if(!this.$props.interactive) return;
        const dataset_index = item[0].datasetIndex;
        const selected_index = item[0].index;
        const selected_dataitem = this.$props.chartData.datasets[dataset_index].data[selected_index];
        const sr_record_guid =selected_dataitem.sr_record_guid;
        const sr_age = selected_dataitem.sr_age;
        //const r =selected_dataitem.r;
        if(sr_age >=45 && sr_record_guid !== null)
        window.open("https://onesupport.crm.dynamics.com/main.aspx?appid=101acb62-8d00-eb11-a813-000d3a8b3117&forceUCI=1&pagetype=entityrecord&etn=incident&id="+sr_record_guid+"&formid=33fb74b3-86ac-4db6-9904-2ad75648175b`");
     
    },
  },

  data() {
    return {
      chartOptions: {
        responsive: true,
       
        onClick: this.OpenDFMCase,
        layout: {
          padding: 10,
        },
        plugins: {
          title: {
            display: true,
            text: "Case Distribution by Age by Idle Days",
            //color: this.$props.appstylemode === 'DARK'?'white':'black',
          },

          datalabels: {
            formatter: () => {
              return "";
            },
          },
          //tooltip
          tooltip: {
            callbacks: {
              label: function (context) {
                let idle_days = context.parsed.y;
                let age_days = context.parsed.x;

                return [
                  " ",
                  context.raw.sr_customer,
                  context.raw.sr_number + " | " + context.raw.sr_region,
                  "OWNER: " + context.raw.sr_owner.toUpperCase(),
                  "AGE: " + age_days + " days | IDLE: " + idle_days + " days",
                  " "
                ];
              },
            },
          },
          //tooltip ends
        },
        scales: {
          x: {
            display: true,
            min: 0,
            max: 120,
            ticks: {
              stepSize: 15,
              maxTicksLimit: 10,
              callback: function (value) {
                if (value === 120) return "120 or more";
                return "Age " + value;
              },
            },
          },

          y: {
            display: true,

            ticks: {
              stepSize: 1,
              callback: function (value) {
                return value !== 0 ? "Idle " + value + " " : " ";
              },
            },
          },
        },
      },
    };
  },
};
</script>