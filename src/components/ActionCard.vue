<template>
  <div
    style="float: left; background-color: lightgray; margin: 2px; width: 24.7%"
  >
    <div
      style="height: 5px; width: 100%; padding: 0px; margin: 0px"
      :class="{
        button_idle: action.action_type === 1,
        button_mce_assign: action.action_type === 2,
        button_mce_pending: action.action_type === 3,
        button_mce_done: action.action_type === 4,
        button_aged_case: action.action_type === 5,
        button_backup_case:action.action_type === 6,
        button_idle_solution_delivered:action.action_type === 7
      }"
    ></div>

    <div id="container_for_age_idle">
      <p
        style="
          color: black;
          font-size: 1em;
          padding: 5px;
          text-transform: uppercase;
        "
      >
        <!-- <i class="fas fa-align-justify"></i> -->
        <span
          style="display: inline-block; top: 2px; vertical-align: middle;height:24px;weight:24px"
          v-html="Computed_Country"
        ></span>
        <a
          :href="`https://onesupport.crm.dynamics.com/main.aspx?appid=101acb62-8d00-eb11-a813-000d3a8b3117&forceUCI=1&pagetype=entityrecord&etn=incident&id=${action.sr_record_guid}&formid=33fb74b3-86ac-4db6-9904-2ad75648175b`"
          target="_blank"
        >
          {{ action.sr_number }}
        </a>

        <i class="fas fa-user-alt"></i> {{ action.sr_caseowner }}
        <i class="fas fa-history"></i> {{ action.sr_age }}
        <i class="fas fa-bed"></i> {{ action.sr_idle_days }}
      </p>
    </div>
    <div style="padding: 10px">
      <p style="color: black; font-size: 1em; text-transform: uppercase">
        {{ action.action_description }}
      </p>
    </div>

    <div style="display:inline-block;font-size=1em;margin:5px auto">
      <button
        style="
          color: white;
          width: 180px;
          padding: 5px;
          cursor: pointer;
          border: 0px;
        "
        @click="doAction(action)"
        :class="{
          button_idle: action.action_type === 1,
          button_mce_assign: action.action_type === 2,
          button_mce_pending: action.action_type === 3,
          button_mce_done: action.action_type === 4,
          button_aged_case:  action.action_type === 5,
          button_backup_case:  action.action_type === 6,
          button_idle_solution_delivered: action.action_type === 7         
        }"
      >
        <i
          :class="{
            'fas fa-arrow-alt-circle-right': action.action_type === 1 || action.action_type === 5 || action.action_type === 6 || action.action_type === 7,
            'fas fa-phone-alt': action.action_type === 2,
            'fas fa-phone-square-alt': action.action_type === 3,
            'fas fa-check-circle': action.action_type === 4,
            
          }"
        ></i>
        {{ action.action_label }}
      </button>
    </div>
  </div>
  <AssignMCEModal
    v-bind:showDialog="showDialog"
    :sr_number="action.sr_number"
    :modalTitle="modalTitle"
    :sr_caseowner="action.sr_caseowner"
    :sr_age="action.sr_age"
    v-on:assign-mce-task="assignMceTask"
    v-on:cancel-mce-assign="cancelMceAssign"
    v-on:CloseAssignModal="CloseAssignModal"
  ></AssignMCEModal>
</template>


<script>

import { Process_Country } from "../common.js";

import AssignMCEModal from "../components/AssignMCEModal";

export default {
  name: "ActionCard",
  props: ["action", "showAllActions"],
  components: {
    AssignMCEModal,
  },
  data() {
    return {
      currentUser: "",
      issuperuser: false,
      showDialog: false,
      modalTitle: "",
    };
  },

  created() {
    this.currentUser = window.localStorage.getItem("whoami");
    this.issuperuser = window.localStorage.getItem("issuperuser");
  },

  computed: {
    Computed_Country: function () {
      const region = this.$props.action.sr_country_code;
      return Process_Country(region)
      
    },
  },

  methods: {
    Review(action) {
      this.$router.push({
        path: "/ServiceTicketDetails",
        query: {
          sr_number: action.sr_number,
        },
      });
    },

    doAction(action) {
      switch (action.action_type) {
        // 1 -> idle case 2 -> mce assign 3 -> mce complete
        case 1:
          window.open(
            "https://onesupport.crm.dynamics.com/main.aspx?appid=101acb62-8d00-eb11-a813-000d3a8b3117&forceUCI=1&pagetype=entityrecord&etn=incident&id=" +
              action.sr_record_guid +
              "&formid=33fb74b3-86ac-4db6-9904-2ad75648175b"
          );
          break;
        case 2:
         
            this.modalTitle =
              "Please choose the engineer who will take MCE request";
            console.log("assing mce modal popup");
            this.showDialog = true;         
          break;
        case 3:
          this.$router.push({
            path: "/ServiceTicketDetails",
            query: {
              sr_number: action.sr_number,
            },
          });
          break;
        case 4:
          window.open(
            "https://onesupport.crm.dynamics.com/main.aspx?appid=101acb62-8d00-eb11-a813-000d3a8b3117&forceUCI=1&pagetype=entityrecord&etn=incident&id=" +
              action.sr_record_guid +
              "&formid=33fb74b3-86ac-4db6-9904-2ad75648175b"
          );
          break;
        case 5:
        case 6:
        case 7:
          window.open(
            "https://onesupport.crm.dynamics.com/main.aspx?appid=101acb62-8d00-eb11-a813-000d3a8b3117&forceUCI=1&pagetype=entityrecord&etn=incident&id=" +
              action.sr_record_guid +
              "&formid=33fb74b3-86ac-4db6-9904-2ad75648175b"
          );
          break;
      }
    },

    CloseAssignModal() {
      this.showDialog = false;
    },

    async assignMceTask(newreview_cpetask, cpe_taskowner) {
      this.showDialog = false;

      // update mce status as pending call
      let action = this.$props.action;
      action.action_type = 3;
      action.action_description = "MCE On-Going By " + cpe_taskowner;
      action.action_label = "COMPLETE MCE";

      //update cpe task owner from UI:
      action.action_owner = cpe_taskowner;
      this.$emit("assign-mce-task", newreview_cpetask, cpe_taskowner);
    },

    cancelMceAssign() {
      this.showDialog = false;
    },
  },
};
</script>

<style scoped>
.button_mce_assign {
  background-color: #2266e3;
}

.button_mce_pending {
  background-color: orange;
}

.button_mce_done {
  background-color: green;
}

.button_idle {
  background-color: gray;
}

.button_aged_case {
 background-color :#A94D00;
}

.button_backup_case {
 background-color :rgb(153, 9, 122) ;
}

.button_idle_solution_delivered {
  background-color :#A99D00
}

a {
  border: none;
  color: black;
  cursor: pointer;
  text-decoration: none;
}
</style>