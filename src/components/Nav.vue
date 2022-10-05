<template>
  <ul>

   
    <li style="float: right" class="dropdown">
      <a><i class="fas fa-cog"></i> </a>
      <div class="dropdown-content">
        <div @click="$emit('ShowPersonalSettingModal')">
          <a><i class="fas fa-user-cog"></i> Personal Option</a>
        </div>
  
        
        
         <div
          v-show="userrole >=3"
          @click="$emit('ShowTeamProfileModal')"
        >
          <a><i class="fas fa-address-card"></i> Team Profiles</a>
        </div>

        <div
          v-show="userrole >=5"
          @click="$emit('ShowSettingModal')"
        >
          <a><i class="fas fa-cog"></i> Global Settings</a>
        </div>
       

        
      </div>
    </li>

     <li style="float: right" @click="$emit('ShowFeedbackModal')">
      <a>
        <i
          class="fas fa-question-circle"
          title="Share your feedback"
        ></i> 
      </a>
    </li>

    <li style="float: right; width: 500px"><SearchCase></SearchCase></li>
    <li style="float: right" @click="CleanCache">
      <a>
        <i
          class="fas fa-sync-alt"
          title="Clean server-side cache and re-fetch live data"
        ></i> &nbsp; {{latestFreshTime}} UTC
      </a>
    </li>
    <li style="float: right">
      <a href="http://littleant:8000" target="_blank">
        <i class="fas fa-paw" title="Open SAB"></i
      > </a>
    </li>

     <li  v-show="userrole >=2"   
      style="float: right"
      @click="$emit('Create-Snapshot')"
    >
      <a>
        <i class="fas fa-cube" title="Create a snapshot of today's operation"></i>
      </a>
    </li>

    
    <li
      style="float: right"
      v-bind:class="{
        filter_applied: showAllActions === 'true',
        filter_canceled:
          showAllActions === 'false' ||
          showAllActions === undefined ||
          showAllActions === null,
      }"
      @click="$emit('Switch-ActionCards')"
    >
      <a><i class="fas fa-th" :title="switch_actioncrds_tip"></i> </a>
      
    </li>

    <li
      style="float: right"
      v-bind:class="{
        filter_applied: chartEnabled === 'true',
        filter_canceled:
          chartEnabled === 'false' ||
          chartEnabled === undefined ||
          chartEnabled === null,
      }"
      @click="$emit('Switch-Chart')"
    >
      <a><i class="fas fa-chart-pie" :title="switch_chart_tip"></i> </a>
    </li>

    <li 
      :class="{
        colormode: appstylemode === 'DEFAULT',
        darkmode: appstylemode === 'DARK',
      }"
      style="float: right"
      @click="SwithTheme"
    >
      <a>
        <i class="fas fa-desktop" :title="switch_theme_tip"></i>
      </a>
    </li>

    <li
      v-show="userrole >=2"
      style="float: right"
      v-bind:class="{
        filter_applied: filterApplied === 'true' || filterApplied===true,
        filter_canceled:
          filterApplied === 'false' || filterApplied === undefined,
      }"
      @click="$emit('Show-Filter')"
    >
      <a><i class="fas fa-filter" title="Filter Engineers"></i> </a>
    </li>

    
    <li   v-show="chartFilter_Enabled"  
      style="float: right"
     class=cahrtfilter_applied
      @click="$emit('Disable-Chart-Filter')"
    >
      <a>[{{chart_Filters_Description}}]    <i class="fas fa-eraser"></i></a>
    </li>
    <li>
    </li>
    

  </ul>
</template>
<script>
import { GetAppStyleMode, SetAppStyleMode, WebAPI_Helper ,GetSettingFromSessionStorage,SaveSettingToSessionStorage } from "../common.js";
import SearchCase from "../components/SearchCase";

export default {
  name: "Nav",
  props: ["filterApplied", "chartEnabled","showAllActions","chartFilter_Enabled","chart_Filters_Description"],

  data() {
    return {
      isadministrator: false,
      userrole:1,
      teamname: "",
      whoami: "",
      appstylemode: "",
      latestFreshTime:"",
  
    };
  },

  computed: {
    switch_theme_tip: function () {
      if (this.appstylemode === "DEFAULT") {
        return "Switch to dark mode to protect your eyes :)";
      } else return "Switch to colorful mode";
    },

     switch_actioncrds_tip: function () {
      if (this.showAllActions === "true") {
        return "Turn off action cards which is not pending on you";
      } else return "Turn on all action cards that is relevant to you";
    },

     switch_chart_tip: function () {
      if (this.chartEnabled === "true") {
        return "Turn off chart";
      } else return "Turn on chart";
    },

  },

  async created() {

     this.latestFreshTime = await this.GetFreshTime();

    // this.isadministrator = await WebAPI_Helper("get", "isadministrator", null);
       this.userrole= GetSettingFromSessionStorage("userrole") === null? await WebAPI_Helper("get","currentuserrole",null):parseInt(GetSettingFromSessionStorage("userrole")); 
       SaveSettingToSessionStorage("userrole",this.userrole);


    this.appstylemode = GetAppStyleMode();

    this.whoami = GetSettingFromSessionStorage("whoami");
  },

  components: {
    SearchCase,
  },

  methods: {
    async getsetting() {
      return await WebAPI_Helper("get", "getsetting", null);
    },

    // IsSuperUser() {
    //   const superuser = this.$props.issuperuser;
    //   if ((superuser === "true") | (superuser === true)) return true;
    //   return false;
    // },

    async GetFreshTime() {
      return await WebAPI_Helper("get","latestfreshtime(case)");
    },

    SwithTheme() {
      if (this.appstylemode === "DEFAULT") {
        SetAppStyleMode("DARK");
        this.appstylemode = "DARK";
      } else {
        SetAppStyleMode("DEFAULT");
        this.appstylemode = "DEFAULT";
      }

      this.$emit("Switch_Theme", this.appstylemode);
    },

   CleanCache(){
       this.$emit("CleanCache");
  }
   

  },
};
</script>

<style>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
}

li {
  cursor: pointer;
}

li a {
  display: block;
  color: white;  
  padding: 14px 16px;
  text-decoration: none;
}

li a:hover:not(.active) {
  background-color: #ddd;
}

/*drop down*/
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  right: 0px;
}

.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

li .dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}
/*drop down end*/

.colormode {
  background-color: #333;
}

.darkmode {
  background-color: #000;
}

.filter_applied {
  background-color: orange;
}

.chartfilter_applied {
  background-color: gray;
}

.filter_canceled {
  background-color: green;
}

/*tooltip*/
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 0px dotted green;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 320px;
  background-color: green;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  top: -5px;
  left: 110%;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent green transparent transparent;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>