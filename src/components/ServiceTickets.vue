<template >
  <div style="margin-left: 0px;margin-bottom:5px">
    <table class="table">
      <caption
        v-html="title"
        :class="{
          'caption_default':appstylemode === 'DEFAULT',
          'caption_dark': appstylemode === 'DARK'
          }"       
      ></caption>
      <thead>
        <tr  :class= "{
          'head_default':appstylemode === 'DEFAULT',
          'head_dark':appstylemode === 'DARK',
        }"       
        >
          <th width="6%" align="center">Status</th>
          <th align="left"></th>
          <th width="10%" align="left">Case ID</th>
          <th width="2%" align="center">Unify</th>
          <th width="2%" align="center">IcM</th>
           <th width="2%" align="center">Bug</th>
           <!-- <th width="2%" align="center">Bug</th> -->
          <th width="2%" align="center">Region</th>


          <th width="15%" align="left">Customer</th>

          
          <th width="5%" align="center">Owner</th>

          <!-- <th width="6%">Created On</th> -->
          <th width="3%">Age</th>
          <th width="3%">Pain</th>
          <th width="3%">Idle</th>

          <th width="2%">Status</th>
          <th width="6%" align="center">POD</th>

          <!-- <th width="32%" align="center">Title</th> -->
          <th :class="{'internal_title_enabled':showInternalTitle==='true','internal_title_disabled':showInternalTitle!=='true'}" align="center">Title</th>
          <th v-show="showInternalTitle==='true'" width="16%" align="center">Internal Title</th>
          <th width="8%" align="center"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-bind:key="serviceticket.sr_number"
          v-for="serviceticket in servicetickets"            

          @mouseover="MouseOver(serviceticket)"       
          @mouseleave="MouseLeave()"  
          @dblclick="$emit('review-serviceticket', serviceticket)" 
          
         
          
          :class="
          {          
            'row_bottom_line tr_default ': hoveredId !== serviceticket.sr_number && hovered === true && appstylemode==='DEFAULT',
            'row_bottom_line tr_over_default': hoveredId === serviceticket.sr_number && hovered === true && appstylemode==='DEFAULT',
            'row_bottom_line tr_leave_default':hovered === false && appstylemode === 'DEFAULT',
            
            'tr_dark_default': hoveredId !== serviceticket.sr_number && hovered === true && appstylemode==='DARK',
            'tr_over_dark': hoveredId === serviceticket.sr_number && hovered === true && appstylemode==='DARK',
            'tr_leave_dark':hovered === false && appstylemode === 'DARK',
          }
          "
        >
          <ServiceTicket
            v-bind:serviceticket="serviceticket"
            v-on:assign-mce-task="assignMceTask_To_Dashbaord"
            v-on:review-serviceticket="
              $emit('review-serviceticket', serviceticket)
            "
            :appstylemode="appstylemode"
            :showInternalTitle="showInternalTitle"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ServiceTicket from "./ServiceTicket";
import { GetSettingFromLocalStorage } from "../common.js";

export default {
  name: "ServiceTickets",
  components: {
    ServiceTicket,
  },

  date( ) {
    return {
    hoveredId:""  ,
    showInternalTitle: false,
    }
    
  },

  props: ["servicetickets", "title", "appstylemode","hovered"],

  created () {
     this.chartFilter_Enabled = true;
    this.showInternalTitle = GetSettingFromLocalStorage("showInternalTitle")===null? "false":GetSettingFromLocalStorage("showInternalTitle")
     
  },
 
  
  methods: {
    assignMceTask_To_Dashbaord(newreview_cpetask, cpe_taskowner) {
      this.$emit("assign-mce-task", newreview_cpetask, cpe_taskowner);
    },

    MouseOver(serviceticket) {
      this.hoveredId = serviceticket.sr_number
      this.$emit("MouseOver");     
    },

    MouseLeave() {
      this.hoveredId = ""
      this.$emit("MouseLeave")
    },

  },
};
</script>

<style scoped>

.internal_title_enabled {
  width:25%
}

.internal_title_disabled {
  width:40%
}

.caption_default {
  padding-left: 20px;
  background:lightgray;
  color:#000;
}

.caption_dark {
  padding-left: 20px;
  background:#686464;
  color:lightgray;

}

.head_default {
 background:#f3f2f1; 
  color:#000;
}

.head_dark {  
  background:#333333;
  color:#fff
}


tbody {
  background-color: white;
  /* #e4f0f5; */
}

thead,
tfoot {
  background-color: lightgray;
  color: #242525;
  width: 20%;
}

caption {
  padding: 10px;
  caption-side: top;
  background: #ddd;
  text-align: left;
  font-size: 15px;
  color: black;
}

caption.bg_60 {
  background-color: gray;
}

caption.bg_4560 {
  background: gray;
}

caption.bg_3045 {
  background-color: gray;
}
caption.bg_1530 {
  background-color: gray;
}
caption.bg_15 {
  background-color: gray;
}

table {
  border-collapse: collapse;
  /* border: 1px solid rgb(200, 200, 200); */
 
  /* width:80%; */
  /* letter-spacing: 0.005rem;
    font-size :14px;
    font-family: Segoe UI; */
  /* margin:0px left; */
  /* font-size: .8rem; */
}

/* tr:hover { 
  background: #f3f2f1;
} */

.tr_over_default {
  /* background: rgb(240, 239, 248); */
 background: #f3f2f1;
 color:#000;
}

.tr_leave_default {
  /* background: rgb(240, 239, 248); */
  background:#fff;
  color:#000;
}

.row_bottom_line {
  border-bottom: 1px solid rgb(243, 242, 241)
}

.tr_default {
 background: #fff;
 color:#000;
}

.tr_over_dark {
  /* background: rgb(240, 239, 248); */
 background: #4e4d4d;
 color:#fff;
}

.tr_leave_dark {
  /* background: rgb(240, 239, 248); */
  background:#252527;
  color:#fff;
}

.tr_dark_default {
  background:#252527;
  color:#fff;
}

td,
th {
  border: 0px solid rgb(160, 151, 170);
  padding: 0px 3px;
  font-weight: normal;
  height: 30px;
  /* font-size: .8rem;; */
}

td {
  text-align: center;
}
</style>
