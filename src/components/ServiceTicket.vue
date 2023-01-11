<template>
  <td>
    <i
      v-show="serviceticket.latest_cpe_assessment === 1"
      class="fas fa-smile"
      style="color: green"
      title="Low CPE Risk"
    ></i>
    <i
      v-show="serviceticket.latest_cpe_assessment === 2"
      class="fas fa-meh"
      style="color: orange"
      title="Neutrul CPE Risk"
    ></i>
    
    <i
      v-show="serviceticket.latest_cpe_assessment === 3"
      class="fas fa-frown"
      style="color: darkred"
      title="High CPE Risk"
    ></i>
    &nbsp;<i  v-show="serviceticket.latest_review_type === 10 && serviceticket.case_backup_owner!== null" class="fas fa-handshake">&nbsp;{{serviceticket.case_backup_owner}}</i>
    <i
      v-show="serviceticket.mce_status === 1"
      class="fas fa-phone-alt"
      title="MCE Pending on assignment"
    ></i>
    <i
      v-show="serviceticket.mce_status === 2"
      class="fas fa-phone-volume"
      title="MCE On-going"
    ></i>
    <i
      v-show="serviceticket.mce_status === 3"
      class="fas fa-phone-slash"
      title="MCE Done and pending for case closure"
    ></i>
    {{ serviceticket.mce_task_owner }}
  </td>
  <td
    :class="{
      S500_default:
        serviceticket.programType === 'S500' && appstylemode === 'DEFAULT',
      S500_dark:
        serviceticket.programType === 'S500' && appstylemode === 'DARK',
    }"
  >
    <div v-html="Computed_Program_Type"></div>
  </td>
  <td
    :class="{
       'Sev-A': serviceticket.sr_severityCode === 'A',
       'caseclosed': serviceticket.sr_status === 'Resolved'            
  }"
    style="text-align: left"
  >
    <a
      :class="{
        a_default: appstylemode === 'DEFAULT',
        a_dark: appstylemode === 'DARK',
      }"
      :href="`https://onesupport.crm.dynamics.com/main.aspx?appid=101acb62-8d00-eb11-a813-000d3a8b3117&forceUCI=1&pagetype=entityrecord&etn=incident&id=${serviceticket.sr_record_guid}&formid=33fb74b3-86ac-4db6-9904-2ad75648175b`"
      target="_blank"
    >
      {{ serviceticket.sr_number }}
      <i
        v-show="serviceticket.sr_TechBlockAssessment === 1"
        class="fas fa-bell"
        title="Potential Technical Block"
      ></i>
      <i
        v-show="serviceticket.sr_TechBlockAssessment === 2"
        class="fas fa-bomb"
        style="color: darkred"
        title="Technical Block is occuring"
      ></i>
      <i
        v-show="serviceticket.is_trending_issue"
        class="fas fa-chart-line"
        style="color: orangered"
        title="Trending Issue"
      ></i>
    </a>
  </td>
  <td>
    <a
    :class="{

        'a_default': appstylemode === 'DEFAULT',
        'a_dark': appstylemode === 'DARK',
      }"
      :href="`https://portal.microsofticm.com/imp/v3/incidents/details/${serviceticket.sr_icm}/home`"
      target="_blank"
      v-show="serviceticket.sr_icm !== null"
    >
      <i class="fab fa-battle-net"></i>
    </a>
  </td>

   <td>
    <a
      :class="{
        a_default: appstylemode === 'DEFAULT',
        a_dark: appstylemode === 'DARK',
      }"
      :href="serviceticket.sr_bugurl"
      target="_blank"
      v-show="serviceticket.sr_bugurl !== '' && serviceticket.sr_bugurl !== null"
    >
      <i class="fas fa-bug"></i>
    </a>
  </td>
<!-- 
  <td>
    <a
      :class="{
        a_default: appstylemode === 'DEFAULT',
        a_dark: appstylemode === 'DARK',
      }"
      :href="`https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/${serviceticket.sr_bug}/`"
      target="_blank"
      v-show="serviceticket.sr_icm !== null"
    >
     <i class="fas fa-bug"></i>
    </a>
  </td> -->

  <td style="text-transform: uppercase; text-align: center">
    <div v-html="Computed_Country" :title="serviceticket.sr_country_code"></div>
  </td>

  <td style="text-align: left">
    {{ serviceticket.primaryAddress }}
    <i
      v-show="serviceticket.is_vip_notification_done === true"
      style="color: green"
      class="fas fa-hand-holding-heart"
      title="Monitored Customer"
    >
    </i>
  </td>

  <td style="text-transform: uppercase; text-align: left">
    {{ serviceticket.sr_caseowner }}
  </td>

  <!-- <td>{{ shorDate }}</td> -->
  <td>{{ serviceticket.sr_age }}</td>
  <td
    v-bind:class="{
      long_idle_default: isIdle && appstylemode === 'DEFAULT',
      long_idle_dark: isIdle && appstylemode === 'DARK',
    }"
  >
    {{ serviceticket.sr_idle_days }}
  </td>

  <td>
    <i
      v-bind:title="Computed_Case_Status"
      :class="{
        'fas fa-coffee': serviceticket.sr_status === 'Waiting for Confirmation',
        'fas fa-hammer': serviceticket.sr_status === 'Troubleshooting',
        'fas fa-headphones-alt':
          serviceticket.sr_status === 'Initial Contact Pending',
        'fas fa-question': serviceticket.sr_status === 'Identifying the Issue',
        'far fa-pause-circle':
          serviceticket.sr_status === 'Waiting for Information',
        'fas fa-times': serviceticket.sr_status === 'Resolved',
        'far fa-times-circle':
          serviceticket.sr_status === 'Resolved by Customer',
        'fas fa-expand-alt': serviceticket.sr_status === 'Disconnect/Hang-up',
        'fas fa-exchange-alt':serviceticket.sr_status === 'Transferred from External',
         'far fa-copy':serviceticket.sr_status === 'Duplicate',
      }"
    ></i>
  </td>
  <td style="text-align: center">{{ computed_POD }}</td>

  <td style="text-align: left">{{ serviceticket.sr_title }}</td>
  <td v-show="showInternalTitle==='true'" style="text-align: left">{{ serviceticket.sr_internaltitle }}</td> 

  <td style="text-align: left">
    <button v-show="serviceticket.mce_status !== 1"
      class="btn"
      :class="{ reviewed_today: serviceticket.is_reviewed_today }"
      @click="$emit('review-serviceticket', serviceticket)"
    >
      <i :class="{'fas fa-check':serviceticket.is_reviewed_today, 'fas fa-briefcase-medical':serviceticket.is_reviewed_today !== true }"></i>
    </button>
    <button
      class="btn"
      style="background-color: #2266e3"
      v-show="serviceticket.mce_status === 1"
      @click="Show_Assign_MCE_Modal"
    >
      <i class="fas fa-phone-alt"></i>
    </button>
  </td>
  <AssignMCEModal
    v-bind:showDialog="showDialog"
    :sr_number="serviceticket.sr_number"
    :modalTitle="modalTitle"
    :sr_caseowner="serviceticket.sr_caseowner"
    :sr_age="serviceticket.sr_age"
    v-on:assign-mce-task="assignMceTask"
    v-on:cancel-mce-assign="cancelMceAssign"
    v-on:CloseAssignModal="CloseAssignModal"
  ></AssignMCEModal>
</template>

<script>
import { GetSettingFromSessionStorage, Process_Country } from "../common.js";

import AssignMCEModal from "./AssignMCEModal.vue";

export default {
  name: "ServiceTicket",
  props: ["serviceticket", "appstylemode","showInternalTitle"],

  components: {
    AssignMCEModal,
  },

  data() {
    return {
      showDialog: false,
      modalTitle: "",
      isIdle: false,
      //showInternalTitle:false,
    };
  },

  created() {

    let Idle_Threshold_In_Days = GetSettingFromSessionStorage("Idle_Threshold_In_Days");
    if (
      Idle_Threshold_In_Days === null ||
      Idle_Threshold_In_Days === undefined ||
      Idle_Threshold_In_Days === ""
    ) {
      this.isIdle = false;
    } else {
      if (
        this.$props.serviceticket.sr_idle_days >
        parseInt(Idle_Threshold_In_Days)
      ) {
        this.isIdle = true;
      } else return (this.isIdle = false);
    }

    console.log(this.$props.showInternalTitle)
   // this.showInternalTitle = GetSettingFromLocalStorage("showInternalTitle")===null? "false": GetSettingFromLocalStorage("showInternalTitle")
     
  },

  methods: {
    Show_Assign_MCE_Modal() {
      this.modalTitle = "Please choose the engineer who will take MCE request";
      this.showDialog = true;
    },

    CloseAssignModal() {
      this.showDialog = false;
    },

    async assignMceTask(newreview_cpetask, cpe_taskowner) {
      this.showDialog = false;

      // update mce status as pending call
      const serviceticket = this.$props.serviceticket;
      serviceticket.mce_status = 2;

      //update cpe task owner from UI:
      serviceticket.mce_task_owner = cpe_taskowner;

      // edmit the event to parent
      this.$emit("assign-mce-task", newreview_cpetask, cpe_taskowner);
    },

    cancelMceAssign() {
      this.showDialog = false;
    },
  },

  computed: {
    shorDate: function () {
      const datestring = this.$props.serviceticket.sr_createdon;
      return datestring.slice(0, 9);
    },

    shortTitle: function () {
      if (
        this.$props.serviceticket.sr_internaltitle === null ||
        this.$props.serviceticket.sr_internaltitle === undefined
      )
        return "";

      return this.$props.serviceticket.sr_internaltitle.slice(0, 60);
    },

    Computed_Case_Status: function () {
      const status = this.$props.serviceticket.sr_status;
      switch (status) {
        case "Waiting for Information":
          return "Pending customer response";
        default:
          return status;
      }
    },

    Computed_Program_Type: function () {
      const programtype = this.$props.serviceticket.programType;
      switch (programtype) {
        case "None":
          return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        default:
          return programtype;
      }
    },

    Computed_Country: function () {
      const region = this.$props.serviceticket.sr_country_code;
      return Process_Country(region);
    },

    computed_POD: function () {
      const pod = this.$props.serviceticket.sr_support_pod;
      switch (pod) {
        case "CE Application":
          return "APP";
        case "CE Power Platform":
          return "PP";
        case "CE Clients":
          return "Client";
        case "CE Platform":
          return "Platform";
        case "CE Customizations":
          return "Customization";
        default:
          return pod.slice(0, 13);
      }
    },
  },
};
</script>

<style scoped>
.fa {
  display: inline-block;
  border: none;
  background: #555;
  color: #fff;
  padding: 7px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.fa:hover {
  background: #666;
}

.serviceticket-item {
  background-color: #f4f4f4;
  padding: 10px;
  width: 30%;
  border-bottom: 1px #ccc solid;
}

.S500_default {
  border-left: 3px green solid;
  background-color: #f2f2f2;
  color: black;
}

.S500_dark {
  border-left: 3px green solid;
  background-color: #444;
  color: #fff;
}

.Sev-A {
  border-left: 3px red solid;
  color: black;
}

.reviewed {
  border-left: 5px green solid;
}

.high-risk {
  border-left: 4px red solid;
}

.mid-risk {
  border-left: 4px orange solid;
}

.low-risk {
  border-left: 4px green solid;
}

.long_idle_default {
  border-left: 3px red solid;
  background-color: #f2f2f2;
  color: black;
}

.long_idle_dark {
  border-left: 3px red solid;
  background-color: #444;
  color: #fff;
}

.reviewed_today {
  background-color: green;
}

.review {
  background-color: #ccc;
  /* color:#fff; */
  border: none;
  padding: 5px 5px;
  /* border-radius: 50%; */
  cursor: pointer;
  float: center;
  /* font-size: .8rem; */
}

.review:hover {
  background: green;
}

td,
th {
  /* border: 1px solid rgb(190, 190, 190); */
  padding: 0px 3px;
  /* font-size: .8rem; */
}

td {
  text-align: center;
}

.a_default {
  border: none;
  color: black;
  cursor: pointer;
  text-decoration: none;
}

.a_dark {
  border: none;
  color: #fff;
  cursor: pointer;
  text-decoration: none;
}

/* a:hover {
  border: none;
  color: black;
  cursor: pointer;
  text-decoration: underline;
} */

/*custom radio button */

/* The container */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 1em;
  text-align: left;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default radio button */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 50%;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196f3;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container .checkmark:after {
  top: 9px;
  left: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.caseclosed {
  text-decoration: line-through;
}
</style>
