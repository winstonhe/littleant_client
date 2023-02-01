<template>
    <div id="chart_container" style="float:left;width:100%; margin-bottom:2px">      
        <ChartBubble :chartData="DSBubble" :width_param="38.4"  :height="125" v-on:E_FilterServiceTicketsFromChart="Filter_ServiceTickets_FromChart"></ChartBubble>
        <ChartPieByPod :chartData="DSPiePod" :height="70.99"  v-on:E_FilterServiceTicketsFromChart="Filter_ServiceTickets_FromChart"></ChartPieByPod>
        <ChartPieByRegion :chartData="DSPieRegion" :height="70.99" v-on:E_FilterServiceTicketsFromChart="Filter_ServiceTickets_FromChart"></ChartPieByRegion>
        <ChartPieByProgramType :chartData="DSPieProgramType" :height="70.99" v-on:E_FilterServiceTicketsFromChart="Filter_ServiceTickets_FromChart"></ChartPieByProgramType>
        <ChartPieByStatus :chartData="DSPie" :height="70.99" v-on:E_FilterServiceTicketsFromChart="Filter_ServiceTickets_FromChart"></ChartPieByStatus>   
        <ChartPieByIcM :chartData="DSPieIcM" :height="70.99"  v-on:E_FilterServiceTicketsFromChart="Filter_ServiceTickets_FromChart"></ChartPieByIcM>
        <!-- <div v-show="Downloading === 'false'">
            <i class="fas fa-arrow-down" :class="{'bigscreen':isBigScreen === true, 'smallscreen':isBigScreen !== true}" style="float: left; background-color: lightgray; margin: 2px; " @click="ExportToPDF()"  title="Export the charts as PDF"></i>
        </div> -->

        <!-- <div v-show="Downloading === 'true'">
        <i class="fas fa-ellipsis-h" :class="{'bigscreen':isBigScreen === true, 'smallscreen':isBigScreen !== true}" style="float: left; background-color: lightgray; margin: 2px; " ></i>
        </div> -->

    </div> 
  
</template>
<script>
// import Exporter from "vue-chartjs-exporter"; // for chart export


import ChartBubble from '../components/ChartBubble.vue'
import ChartPieByStatus from '../components/ChartPieByStatus.vue'
import ChartPieByIcM from '../components/ChartPieByIcM.vue'
import ChartPieByPod from '../components/ChartPieByPod.vue'
import ChartPieByRegion from '../components/ChartPieByRegion.vue'
import ChartPieByProgramType from '../components/ChartPieByProgramType.vue'

export default {
    name: "ChartPanel",
    props: ["DSBubble","DSPie","DSPieIcM","DSPiePod","DSPieRegion","DSPieProgramType","Downloading"],   
    components:{
        ChartBubble,
        ChartPieByStatus,
        ChartPieByIcM,
        ChartPieByPod,
        ChartPieByRegion,
        ChartPieByProgramType
    },

    // data(){
    //     return {
    //         isBigScreen : false,
    //     };
    // },

    // created() {
    //     const high_resolution_width = 2256;
    //     if(window.screen.availWidth >= high_resolution_width) {
    //         this.isBigScreen= true;
    //     }
    //     else this.isBigScreen = false;        
    // },

    methods: {

      Filter_ServiceTickets_FromChart (parameter, value) {
          
            this.$emit("E_FilterServiceTicketsFromChart",parameter, value);

       },
    //   ExportToPDF() {         
    //   this.$emit("DownLoad_Chart","true");    
         
    //   let bubblechartbyagebyidle = document.getElementById("bubblechartbyagebyidle");
    //   let piechartbyicm = document.getElementById("piechartbyicm");
    //   let piechartbypod = document.getElementById("piechartbypod");
    //   let piechartbyregion = document.getElementById("piechartbyregion");
    //   let piechartbystatus = document.getElementById("piechartbystatus");

    //   const exp= new Exporter([bubblechartbyagebyidle,piechartbyicm, piechartbypod, piechartbyregion, piechartbystatus]);
    //   exp.export_pdf().then((pdf) => {
    //     pdf.save("TeamOperationCharts_ByLittleAnt.pdf"); 
    //      this.$emit("DownLoad_Chart","false");                   
    // //   });

      
    // }
       

    },
   
  
}
</script>
<style scoped>
.bigscreen  {
    padding:5px
}

.smallscreen {
    padding:2px
}
</style>
