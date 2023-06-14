<template >
  <div style="margin-left: 0px;margin-bottom:5px">
    <table class="table" v-if="assignments.length !== 0">
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
          
        <th width="1%"  align="center"></th>
        <th width="1%"  align="center"></th>

          <th width="5%" align="left">Case ID</th>
          <th width="1%" align="left"> <i title="Ascending order by severity level" style="cursor: pointer;" class="fas fa-sort-amount-down-alt" :class="{'sortApplied': sortApplied === true && sortedColumn === 'severity'}" 
             @click="Sort(assignments,'severity')"></i></th>
          <th width="5%" align="left"> <i title="Ascending order by service level"  style="cursor: pointer;"  class="fas fa-sort-amount-down-alt" :class="{'sortApplied': sortApplied === true && sortedColumn === 'servicelevel'}" 
             @click="Sort(assignments,'servicelevel')"></i> </th>
          <th width="5%" align="center">Channel  <i title="Ascending order by channel"  style="cursor: pointer;"  class="fas fa-sort-amount-down-alt" :class="{'sortApplied': sortApplied === true && sortedColumn === 'channel'}" 
             @click="Sort(assignments,'channel')"></i></th>
         
          <th width="5%" align="center">Region  <i title="Ascending order by region"  style="cursor: pointer;"  class="fas fa-sort-amount-down-alt" :class="{'sortApplied': sortApplied === true && sortedColumn === 'region'}" 
             @click="Sort(assignments,'region')"></i></th>
          <th width="10%" align="left">Customer   <i  title="Ascending order by customer" style="cursor: pointer;"  class="fas fa-sort-amount-down-alt" :class="{'sortApplied': sortApplied === true && sortedColumn === 'customer'}" 
             @click="Sort(assignments,'customer')"></i></th> 
          <th width="7%" align="left">Owner 
             <i title="Ascending order by case owner" class="fas fa-sort-amount-down-alt" style="cursor: pointer;"  :class="{'sortApplied': sortApplied === true && sortedColumn === 'owner'}" 
             @click="Sort(assignments,'owner')"></i> </th>         
        
          
          <th width="6%" align="center">POD    <i title="Ascending order by pod" style="cursor: pointer;"  class="fas fa-sort-amount-down-alt" :class="{'sortApplied': sortApplied === true && sortedColumn === 'pod'}" 
             @click="Sort(assignments,'pod')"></i> </th>           
          
          
           
          <th width="30%" align="left">Title</th>        
             
         
          <th width="6%" v-if="numberofChatAssignments !== 0" align="center">Resolved in Chat</th>    
        </tr>
      </thead>
      <tbody>
        <tr
          v-bind:key="assignment.sr_number"
          v-for="(assignment , index) in assignments"            

          @mouseover="MouseOver(assignment)"       
          @mouseleave="MouseLeave()"        
         
          
          :class="
          {          
            'row_bottom_line tr_default ': hoveredId !== assignment.sr_number && hovered === true && appstylemode==='DEFAULT',
            'row_bottom_line tr_over_default': hoveredId === assignment.sr_number && hovered === true && appstylemode==='DEFAULT',
            'row_bottom_line tr_leave_default':hovered === false && appstylemode === 'DEFAULT',
            
            'tr_dark_default': hoveredId !== assignment.sr_number && hovered === true && appstylemode==='DARK',
            'tr_over_dark': hoveredId === assignment.sr_number && hovered === true && appstylemode==='DARK',
            'tr_leave_dark':hovered === false && appstylemode === 'DARK',
          }
          "
        >
          <assignment
            v-bind:assignment="assignment"           
            :appstylemode="appstylemode"
            :showChat2WebColumn="showChat2WebColumn"
            :index="index+1"
            
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Assignment from "./Assignment";
import { GetSettingFromLocalStorage } from "../common.js";

export default {
  name: "Assignments",
  components: {
    Assignment,
  },

  date( ) {
    return {
    hoveredId:""  ,
    showChat2WebColumn:false,
    sortApplied: true,
    sortedColumn:"",
    }
    
  },

  props: ["assignments", "title", "appstylemode","hovered","numberofChatAssignments"],

  updated() {
      this.showChat2WebColumn = this.$props.numberofChatAssignments !== 0;
  },

  created () {
     this.chartFilter_Enabled = true;
    this.showInternalTitle = GetSettingFromLocalStorage("showInternalTitle")===null? "false":GetSettingFromLocalStorage("showInternalTitle");
    this.showChat2WebColumn = this.$props.numberofChatAssignments !== 0;
     
  },
 
  
  methods: {

    MouseOver(assignment) {
      this.hoveredId = assignment.sr_number
      this.$emit("MouseOver");     
    },

    MouseLeave() {
      this.hoveredId = ""
      this.$emit("MouseLeave")
    },

    Sort(assignments,columntype) {
      this.sortApplied =true;
      switch(columntype) {
        case "owner":
          assignments =   assignments.sort((a,b)=> a.sr_caseowner.localeCompare(b.sr_caseowner));
          this.sortedColumn = 'owner';
          break;
        
        case "pod":
          assignments =   assignments.sort((a,b)=> a.support_pod.localeCompare(b.support_pod))
          this.sortedColumn = 'pod';
          break;

        case "channel":
          assignments =   assignments.sort((a,b)=> a.casetype.localeCompare(b.casetype))
          this.sortedColumn = 'channel';
          break;
        
        case "servicelevel":
          assignments =   assignments.sort((a,b)=> a.servicelevel.localeCompare(b.servicelevel))
          this.sortedColumn = 'servicelevel';
          break;
          case "region":
          assignments =   assignments.sort((a,b)=> a.sr_regioncode.localeCompare(b.sr_regioncode))
          this.sortedColumn = 'region';
          break;
          case "customer":
          assignments =   assignments.sort((a,b)=> a.sr_customer.localeCompare(b.sr_customer))
          this.sortedColumn = 'customer';
          break;

          case "severity":
          assignments =   assignments.sort((a,b)=> a.sr_severityCode.localeCompare(b.sr_severityCode))
          this.sortedColumn = 'severity';
          break;
      }
    },

  },
};
</script>

<style scoped>

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

.sortApplied {
  color:orange;
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
