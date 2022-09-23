<template>
  <SiteNav @ToggleNavBar="ToggleNavBar" :siteNivBar_expanded="siteNivBar_expanded"></SiteNav>
  <div
    :class="{
      NavBarCollapsed:
        siteNivBar_expanded === 'false' || siteNivBar_expanded === undefined,
      NavBarExpanded: siteNivBar_expanded === 'true',
    }"
  >
    <div id="loadingcontainer" v-show="loaded !== true">
      <img src="../images/loading.jpg" />
    </div>

   <LoadingModal
        :showLoading="showLoading"      
        :message="messageforloading"       
      >
    </LoadingModal>

    <div v-show="loaded === true">
      <RefreshConfirmationModal
        :showDialog="showDialog"
        @Refresh_Confirmed="RefreshConfirmed"
        @Refresh_Canceled="RefreshCanceled"
      ></RefreshConfirmationModal>

   

      <ul>
        <li style="float: left">
          <a> Case Assignment </a>
        </li>

       

          <li style="float: left">
          <a>{{ title }}</a>
        </li>

        <li
          style="float: right;margin-right: 30px"
          v-bind:class="{
            filter_applied: retrieveMode === 2,
            filter_canceled: retrieveMode !== 2,
          }"
          @click="MonthlyAssignments"
        >
          <a><i class="fas fa-th-large" title="Monthly Assignments"></i> </a>
        </li>

        <li
          style="float: right"
          v-bind:class="{
            filter_applied: retrieveMode === 1,
            filter_canceled: retrieveMode !== 1,
          }"
          @click="DailyAssignments"
        >
          <a><i class="fas fa-th" title="Daily Assignments"></i> </a>
        </li>

         <li style="float: right;" @click="CleanCache">
          <a>
            <i
              class="fas fa-sync-alt"
              title="Clean server-side cache and re-fetch live data"
            ></i>
            &nbsp;{{ latestFreshTime }} UTC
          </a>
        </li>

      </ul>

      <div v-for="(data, index) in analyzed_ds_teams" :key="data.manager">
        <label
          :class="{
            'white-text': appstylemode === 'DARK' || appstylemode === null,
            'black-text': appstylemode === 'DEFAULT',
          }"
          style="
            display: block;
            font-size: 14px;
            text-align: left;
            padding: 10px;
            text-transform: uppercase;
            text-align: left;
          "
        >
          <i
            class="fas fa-user-friends"
            :class="{ seperator: index !== 0 }"
          ></i>
          {{ data.manager }}'S TEAM &nbsp;&nbsp;
        </label>

        <!-- Statistics  start-->

        <div id="displaycontiner">
          <div
            id="display15"
            style="float: left"
            :class="{
              'displayboard display15': appstylemode === 'DEFAULT',
              'displayboard dark': appstylemode === 'DARK',
            }"
          >
            <p
              :class="{
                'title title_default': appstylemode === 'DEFAULT',
                'title title_dark': appstylemode === 'DARK',
              }"
            >
              <i class="fas fa-user-alt"></i> ENGINEERS
            </p>
            <p class="boardcontent">{{ data.engineers }}</p>
            <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
          </div>

          <div
            id="display1530"
            style="float: left"
            :class="{
              'displayboard display1530': appstylemode === 'DEFAULT',
              'displayboard dark': appstylemode === 'DARK',
            }"
          >
            <p
              :class="{
                'title title_default': appstylemode === 'DEFAULT',
                'title title_dark': appstylemode === 'DARK',
              }"
            >
              <i class="fas fa-bone"></i> CASES {{mode_description}}
            </p>
            <p class="boardcontent">
              {{ data.totalAssignment_count }}
            </p>
            <p class="boardcontent_sub">
              &nbsp;&nbsp;LOAD:{{
                Today_Load_Index(data)
              }}
            </p>
            <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
          </div>
          <div style="clear: both"></div>
        </div>

        <!-- end -->
        <div v-show="data.totalAssignment_count != 0">
          <ChartStackedBarByEngineer
            :chartData="data.DSBarAssignment"
            :height="146.5"
          ></ChartStackedBarByEngineer>
          <ChartPieByPod
            :chartData="data.DSPiePod"
            :height="70.99"
          ></ChartPieByPod>
          <ChartPieByBandwidth
            :chartData="data.DSPieBandwidth"
            :height="70.99"
          ></ChartPieByBandwidth>

          <ChartPieByRegion
            :chartData="data.DSPieRegion"
            :height="70.99"
          ></ChartPieByRegion>
          <ChartPieByAssignmentMethod
            :chartData="data.DSPieAssignmentMethod"
            :height="70.99"
          ></ChartPieByAssignmentMethod>
        </div>

        <div style="clear: both"></div>
        <!-- <div style="margin:20px;display:block"> &nbsp; </div> -->
      </div>
    </div>
  </div>
  <Footer :appstylemode="appstylemode" />
</template>

<script>
import {
  WebAPI_Helper,
  SaveSettingToSessionStorage,
  GetSettingFromSessionStorage,
  GetSettingFromLocalStorage,
   SaveSettingToLocalStorage,
   GetAppStyleMode,
  Shuffle,
} from "../common.js";

import ChartPieByPod from "./ChartPieByPod.vue";
import ChartPieByRegion from "./ChartPieByRegion.vue";
import ChartPieByBandwidth from "./ChartPieByBandwidth.vue";
import ChartStackedBarByEngineer from "./ChartStackedBarByEngineer";
import ChartPieByAssignmentMethod from "./ChartPieByAssignmentMethod";
import RefreshConfirmationModal from "./RefreshConfirmationModal";

import Footer from "../components/layout/Footer";
//site nav
import SiteNav from "../components/SiteNav";

import LoadingModal from "./LoadingModal";

export default {
  name: "GroupAssignment",

  components: {
    ChartPieByPod,
    ChartPieByRegion,
    ChartPieByBandwidth,
    ChartStackedBarByEngineer,
    ChartPieByAssignmentMethod,
    SiteNav,
    RefreshConfirmationModal,
    LoadingModal,
 
    Footer,
  },

  data() {
    return {
      siteNivBar_expanded: "false",
      loaded: false,
      appstylemode: "DEFAULT",
      showDialog: false, //trigger the refresh modal
      latestFreshTime: "",
      retrieveMode: 1,
      mode_description:"",

      //assignments for teams
      assignment_teams: [],

      refreshtimeInterval: 0,
      userRole:1,
      days_elapsed:0,

      //dataset after analysis
      analyzed_ds_teams: [],

       messageforloading:"",
       showLoading: false,

      //to store the assignmen count after cleanup
      assignment_number_after_cleanup: 0,

      //dataset for barchat of assignment
      dataset_chart_bar_assignment: {
        labels: [],
        datasets: [
          {
            label: null,
            data: [],
            backgroundColor: null,
          },
        ],
      },

      //dataset for piechar by region
      dataset_chart_pie_by_region: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

      //dataset for piechar by region
      dataset_chart_pie_by_pod: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

      //dataset for piechar by region
      dataset_chart_pie_by_bandwidth: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

      //dataset for piechar by assignment method
      dataset_chart_pie_by_assignmentmethod: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },
    };
  },
  beforeUnmount() {
    clearInterval(this.refreshtimeInterval);
  },

  async created() {
    this.loaded = false;
    this.showDialog = false;

     //set assignment menu as selected item
      SaveSettingToSessionStorage('selectedMenu','4')

       this.retrieveMode =
      GetSettingFromLocalStorage("retrieveAssignmentMode") === null
        ? 1
        : parseInt(GetSettingFromLocalStorage("retrieveAssignmentMode"));

    this.updateTitle();
    this.loaded=await this.Init();    
    this.refreshtimeInterval = setInterval(this.Init, 300000); // auto refresh the components for each 2 mins
  },

  methods: {
    Today_Load_Index(data) {
      if(this.retrieveMode === 1) {
      return (data.totalAssignment_count / data.engineers).toFixed(2);
      }
      else {
       const today = new Date();
      const today_day = String(today.getDate()).padStart(2, '0');
      this.days_elapsed = (today_day*0.7123).toFixed(2);
      return (data.totalAssignment_count / data.engineers/ this.days_elapsed).toFixed(2);
      }
    },

    CleanCache() {
      this.showDialog = true;
    },

    updateTitle() {
       if(this.retrieveMode === 1) {
       this.mode_description = "TODAY";
     }
     else {
       this.mode_description = "THIS-MON";
     }

    },

    setTickWhenLoading() {
      this.messageforloading +="..";
    },

    MonthlyAssignments () {
     
      this.retrieveMode = 2;
       this.updateTitle();
      SaveSettingToLocalStorage("retrieveAssignmentMode", "2");
      this.Init();
     
     
    },

    DailyAssignments() {
      this.retrieveMode =1;
       this.updateTitle();
      SaveSettingToLocalStorage("retrieveAssignmentMode", "1");
      this.Init();
    },

    async Init() {
      this.latestFreshTime = await this.GetFreshTime();
      
      if(this.loaded === false)
         this.showLoading = false ;// loading modal not show if loaded is false;
      else  
      this.showLoading = true

      this.messageforloading= "Loading data in process. Please feel free to enjoy your coffee now  <i class='fas fa-mug-hot'></i> ...";
      let loadingMessageInterval= setInterval(this.setTickWhenLoading,1000)


      this.siteNivBar_expanded =
        GetSettingFromLocalStorage("siteNivBar_expanded") !== null
          ? GetSettingFromLocalStorage("siteNivBar_expanded")
          : "false";

        this.appstylemode =GetAppStyleMode();

      let teammanagers_alias_str =
        GetSettingFromSessionStorage("teammanagers_alias");

      if (teammanagers_alias_str === null) {
        const setting = await this.getsetting();

        SaveSettingToSessionStorage(
          "teammanagers_alias",
          setting.teammanagers_alias
        );
      }

      let teammanagers_alias =
        GetSettingFromSessionStorage("teammanagers_alias").split(",");

      this.userRole = await WebAPI_Helper("get", "currentuserrole", null);

      //initial backlog for each team before we are going to analyze the data;
       this.assignment_teams = [];
      for (let i = 0; i < teammanagers_alias.length; i++) {
        if (teammanagers_alias[i] === "" || teammanagers_alias[i] === null)
          continue;
             

        let data = await this.AssignmentByManager(teammanagers_alias[i], this.retrieveMode);
       

        let item = {
          manager: teammanagers_alias[i],
          assignments: data,
        };
        this.assignment_teams.push(item);
        if (teammanagers_alias[i] !== "" && teammanagers_alias[i] !== null) {
          var team_members = await this.getteammembers(teammanagers_alias[i]);
        }
        SaveSettingToSessionStorage(
          teammanagers_alias[i],
          JSON.stringify(team_members)
        );
      }

      //Analyze the assignment of each team
      this.analyzed_ds_teams=[];     
      this.assignment_teams.forEach((team) => {
        let engineers = JSON.parse(GetSettingFromSessionStorage(team.manager));

        //Generate dataset for team, the generate dataset will be stored tempororily by compononent data.
        this.Generate_Dataset_For_Charts(
          team.assignments,
          team.manager,
          engineers
        );

        let data_point = {
          manager: team.manager,
          engineers: engineers.length,
          DSBarAssignment: this.dataset_chart_bar_assignment,
          DSPieBandwidth: this.dataset_chart_pie_by_bandwidth,
          DSPiePod: this.dataset_chart_pie_by_pod,
          DSPieRegion: this.dataset_chart_pie_by_region,
          DSPieAssignmentMethod: this.dataset_chart_pie_by_assignmentmethod,
          totalAssignment_count: this.assignment_number_after_cleanup, //this.assignment_teams[i].assignments.length,
        };

        this.analyzed_ds_teams = [...this.analyzed_ds_teams, data_point];

        //clean the component data before next round of loop
        this.Clean_Dataset_ForAllCharts();
      });

      this.showLoading = false; // hide loading modal once done. 
      clearInterval(loadingMessageInterval); //release interval

      return true;
    },

    async getRefreshTime() {
      this.latestFreshTime = await this.GetFreshTime();
    },

    async GetFreshTime() {
      return await WebAPI_Helper("get", "latestfreshtime(assignment)");
    },

    RefreshConfirmed() {
      this.showDialog = false;
      this.loaded = false;
      WebAPI_Helper("get", "cleancache(assignment)", null);
      location.reload();
    },

    RefreshCanceled() {
      this.showDialog = false;
    },

    //Show | show Nav Bar of left panel
    ToggleNavBar(siteNivBar_expanded) {
      this.siteNivBar_expanded = siteNivBar_expanded;
    },

    async AssignmentByManager(manager_alias,mode) {
      let data = WebAPI_Helper(
        "get",
        "assignments/manager/" + manager_alias + "/mode/" + mode,
        null
      );

      return data;
    },

    async getsetting() {
      return WebAPI_Helper("get", "getsetting", null);
    },

    async getteammembers(manager_alias) {
      return await WebAPI_Helper(
        "get",
        "teammembers(" + manager_alias + ")",
        null
      );
    },

    // calculate how many cases assigned for each engineeer
    Prehandling_Assignment(assignments, manager_alias) {
      let engineers_assignment_array = [];

      let assignments_cleanedup = [];

      let teammembers = [];
      teammembers = JSON.parse(GetSettingFromSessionStorage(manager_alias));

     
      //initialize the assignment number as 0 for all team members.
      let Number_pod = [];
      teammembers.forEach((member) => {
        let item = { sr_caseowner: member, assigned_number: 0 };
        engineers_assignment_array.push(item);
      });

      let count = 0;
      let labels_pod = [];

      assignments.forEach((assignment) => {
        let sr_caseowner = assignment.sr_caseowner;
        let item_found = undefined;
        item_found = engineers_assignment_array.find(
          (item) => item.sr_caseowner === sr_caseowner
        );

        if (item_found !== undefined) {
          assignments_cleanedup.push(assignment);
          // find an existing item
          item_found.assigned_number += 1;
          count++;

          //initial labels for pod
          let pod = assignment.support_pod;

          if (labels_pod.find((element) => element === pod) === undefined) {
            labels_pod = [...labels_pod, pod];
            Number_pod.push(0);
          }
        }
      });

      //rank it

      engineers_assignment_array = engineers_assignment_array.sort(
        (a, b) => a.assigned_number - b.assigned_number
      );

      this.assignment_number_after_cleanup = count;
      return {
        enginees_assignment_statistics: engineers_assignment_array,
        assignments_cleanedup: assignments_cleanedup,
        pods_of_assignment: labels_pod,
        Number_pod: Number_pod,
      };
    },

    Generate_Dataset_For_Charts(assignments, manager_alias, engineers) {
      //background Color buffer which will be used by all charts.
      const backgroundColor_buffer = [
        "#1f7115",
        "#e28743",
        "#873e23",
        "#76b5c5",
        "#7943e2",
        "#063970",
        "#880e4f",
        "#2596be",
        "#be4d25",
        "#e243bb",
        "#11381a",
        "#e2b943",
        "#e2435c",
        "#301b5a",
        "#eb7bb6",
      ];

      // Variables for piechart by pod
      let labels_pod = [];
      let Number_pod = []; // An array to store the number of each pod

      //Variables for piechart by region
      let labels_region = [];
      let Number_region = []; // An array to store the number of each region

      //Variables for piechart by region
      let labels_assignmentmethod = [];
      let Number_assignmentmethod = []; // An array to store the number of each assignmentmethod

      //Generate assignment statiscis before generating stacked dataset
      let labels_assignment_alias = []; // the labels of assignment, which should be engineers alias
      let engineers_assignment_statistics = []; // The assignment statistics after cleanup.

      //The purpose of this API is to summarize the assignment count per each engineer , then we sort it by count in ascend.
      let assignment_statistics = this.Prehandling_Assignment(
        assignments,
        manager_alias
      );

      engineers_assignment_statistics =
        assignment_statistics.enginees_assignment_statistics;
      labels_pod = assignment_statistics.pods_of_assignment; // Labels of POD after cleanup
      Number_pod = assignment_statistics.Number_pod; // Number of Pod after cleanup.
      let assignments_cleanedup = [];
      assignments_cleanedup = assignment_statistics.assignments_cleanedup;

      //bandwidth start
      //variable for piechart by bandwith
      let labels_bandwidth = ["Bandwidth Consumed", "Bandwidth Available"];
      let Number_bandwidth = [0, 0];

      Number_bandwidth[0] = this.assignment_number_after_cleanup; // assigned count

      if(this.retrieveMode === 1){

      let total_Bandwidth = engineers.length * 1.2;
      let available_buffer =
        total_Bandwidth - this.assignment_number_after_cleanup > 0
          ? parseInt(
              (total_Bandwidth - this.assignment_number_after_cleanup).toFixed(
                0
              )
            )
          : 0;

      Number_bandwidth[1] = available_buffer;
      } else { // monthly mode

        let total_Bandwidth = engineers.length * 1.2 * this.days_elapsed;
      let available_buffer =
        total_Bandwidth - this.assignment_number_after_cleanup > 0
          ? parseInt(
              (total_Bandwidth - this.assignment_number_after_cleanup).toFixed(
                0
              )
            )
          : 0;

      Number_bandwidth[1] = available_buffer;

      }

      // engineers_assignment_statistics is the statistics order by assigned number.
      engineers_assignment_statistics.forEach((assignment_statistics) => {
        let sr_caseowner = assignment_statistics.sr_caseowner;
        labels_assignment_alias.push(sr_caseowner); // We generate the alias lable order by assigned cases ascend.
      });

      //end

      //Initial labels
      assignments_cleanedup.forEach((assignment) => {
        //initial labels for region
        let region =
          assignment.sr_regioncode !== null
            ? assignment.sr_regioncode
            : "Unknown";

        if (labels_region.find((element) => element === region) === undefined) {
          labels_region = [...labels_region, region];
          //initiale  array
          Number_region.push(0);
        }

        //initial labels for assignment method
        let assignmentmethod =
          assignment.bookingmethod !== null
            ? assignment.bookingmethod
            : "Unknown";

        if (
          labels_assignmentmethod.find(
            (element) => element === assignmentmethod
          ) === undefined
        ) {
          labels_assignmentmethod = [
            ...labels_assignmentmethod,
            assignmentmethod,
          ];
          //initiale  array
          Number_assignmentmethod.push(0);
        }
      });

      //initial background color for assignmnet mthod
     let backgroundColor_assignmentmothod = [];
     if ( labels_assignmentmethod.length === 2){
        backgroundColor_assignmentmothod = ["#2596be","#be4d25",];
     } else {
        backgroundColor_assignmentmothod = ["#2596be"];
     }
      // backgroundColor_assignmentmothod = Shuffle(backgroundColor_buffer).slice(
      //   0,
      //   labels_assignmentmethod.length
      // );

      //Initial stacked dataset.
      let backgroundColor_pod = [];
      backgroundColor_pod = Shuffle(backgroundColor_buffer).slice(
        0,
        labels_pod.length
      );

      let stacked_dataset_chart_bar = [];

      labels_pod.forEach((label, index) => {
        let dataset_item = {
          label: label,
          backgroundColor: backgroundColor_pod[index],
          data: new Array(labels_assignment_alias.length).fill(0), // set value as 0
        };
        //set data of dataset item of all pod as 0
        stacked_dataset_chart_bar.push(dataset_item);
      });

      //Initial stacked dataset end

      assignments_cleanedup.forEach((assignment) => {
        //generated the stacked dataset for assignment based on pod
        let pod = assignment.support_pod;
        let sr_caseowner = assignment.sr_caseowner;
        let index_caseowner = labels_assignment_alias.indexOf(sr_caseowner);

        //get the dataset itm
        let index_dataset_item_found = stacked_dataset_chart_bar.findIndex(
          (item) => {
            return item.label === pod;
          }
        );

        if (index_dataset_item_found !== -1) {
          let dataset_item =
            stacked_dataset_chart_bar[index_dataset_item_found];

          dataset_item.data[index_caseowner] += 1;
        }

        // stacked dataset end

        //Search the labels of pod, and increase the number if matched.
        let item_pod = assignment.support_pod;
        let temp_index = labels_pod.indexOf(item_pod);
        let pod_index =
          temp_index !== -1 ? temp_index : labels_pod.indexOf("Unknown");
        Number_pod[pod_index] += 1; //increase the number of corresponding pod

        //Search the labels of region, and increase the number if matched.
        let item_region = assignment.sr_regioncode;
        temp_index = labels_region.indexOf(item_region);
        let region_index =
          temp_index !== -1 ? temp_index : labels_region.indexOf("Unknown");
        Number_region[region_index] += 1; //increase the number of corresponding region

        let item_assignmentmethod = assignment.bookingmethod;
        temp_index = labels_assignmentmethod.indexOf(item_assignmentmethod);
        let assignmentmethod_index =
          temp_index !== -1
            ? temp_index
            : labels_assignmentmethod.indexOf("Unknown");
        Number_assignmentmethod[assignmentmethod_index] += 1;
      });

      this.dataset_chart_bar_assignment.labels = labels_assignment_alias;
      this.dataset_chart_bar_assignment.datasets = stacked_dataset_chart_bar;

      let dataitem_pod = [];
      let datasets_pod = [];

      dataitem_pod.data = Number_pod;
      dataitem_pod.backgroundColor = backgroundColor_pod;

      datasets_pod = [...datasets_pod, dataitem_pod];
      this.dataset_chart_pie_by_pod.datasets = datasets_pod;

      //Cut the labes if it's longer than 8
      let labels_pod_shortened = labels_pod.map(function (label) {
        return label.length <= 10 ? label : label.slice(0, 8);
      });

      this.dataset_chart_pie_by_pod.labels = labels_pod_shortened;
      //end

      //generate dataset for pie chart by bandwidth
      // let backgroundColor_bandwidth = [];
      // backgroundColor_bandwidth = Shuffle(backgroundColor_buffer).slice(
      //   0,
      //   labels_bandwidth.length
      // );
      let backgroundColor_bandwidth=["darkgray","green"];
      let dataitem_bandwidth = [];
      let datasets_bandwidth = [];

      dataitem_bandwidth.data = Number_bandwidth;
      dataitem_bandwidth.backgroundColor = backgroundColor_bandwidth;

      datasets_bandwidth.push(dataitem_bandwidth);
      this.dataset_chart_pie_by_bandwidth.datasets = datasets_bandwidth;
      this.dataset_chart_pie_by_bandwidth.labels = labels_bandwidth;
      //end

      //generate dataset for pie chart by region
      let backgroundColor_region = [];
      backgroundColor_region = Shuffle(backgroundColor_buffer).slice(
        0,
        labels_region.length
      );
      let dataitem_region = [];
      let datasets_region = [];

      dataitem_region.data = Number_region;
      dataitem_region.backgroundColor = backgroundColor_region;

      datasets_region = [...datasets_region, dataitem_region];
      this.dataset_chart_pie_by_region.datasets = datasets_region;
      this.dataset_chart_pie_by_region.labels = labels_region;
      //end

      //generate dataset for pie chart by assignmethod
      // let backgroundColor_assignmentmothod = [];
      // backgroundColor_assignmentmothod = Shuffle(backgroundColor_buffer).slice(
      //   0,
      //   labels_assignmentmethod.length
      // );
      let dataitem_assignmentmethod = [];
      let datasets_assignmentmethod = [];

      dataitem_assignmentmethod.data = Number_assignmentmethod;
      dataitem_assignmentmethod.backgroundColor =
        backgroundColor_assignmentmothod;

      datasets_assignmentmethod = [
        ...datasets_assignmentmethod,
        dataitem_assignmentmethod,
      ];
      this.dataset_chart_pie_by_assignmentmethod.datasets =
        datasets_assignmentmethod;
      this.dataset_chart_pie_by_assignmentmethod.labels =
        labels_assignmentmethod;
      //end
    },

    Clean_Dataset_ForAllCharts() {
      //dataset for barchat of assignment
      this.dataset_chart_bar_assignment = {
        labels: [],
        datasets: [
          {
            label: null,
            data: [],
            backgroundColor: null,
          },
        ],
      };

      //dataset for piechar by region
      this.dataset_chart_pie_by_region = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };

      //dataset for piechar by region
      this.dataset_chart_pie_by_pod = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };

      //dataset for piechar by bandwidth
      this.dataset_chart_pie_by_bandwidth = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };

      //dataset for piechar by bandwidth
      this.dataset_chart_pie_by_assignmentmethod = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
#loadingcontainer {
  /* margin: 100px auto; */
  /* padding: 30 px; */
  font-size: 1em;
  background-color: #191f26;
  width: 100%;
  height: 100%;
}
.NavBarExpanded {
  margin-left: 12%;
}

.NavBarCollapsed {
  margin-left: 3%;
}

.white-text {
  color: white;
}

.black-text {
  color: black;
}

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

#displaycointer {
  background: gray;
  padding: 20px;
  text-align: center;

  line-height: 0px;
  margin: 10px auto;
}

.title {
  padding: 15px;
  width: 100%;
  font-size: 16px;
  color: white;
  border-left: 4px solid orange;
}

.title_default {
  background: olive;
  color: #fff;
}

.title_dark {
  background: #000;
  color: #fff;
}

.displayboard {
  width: 12.5%;
  height: 100px;
  display: inline-block;
}

.dark {
  background: #252527;
  color: #fff;
}

.display15 {
  background: #01579b;
  color: #fff;
}

.display1530 {
  background: #311b92;
  color: #fff;
}

.trending {
  background: rgb(59, 103, 145);
  color: #fff;
}

.displaybacklog {
  background: #607d8b;
  color: #fff;
}

.availableengineers {
  background: #004d40;
  color: #fff;
}

.boardcontent {
  font-size: 30px;
  text-align: center;
  font-family: Segoe UI;
  font-weight: lighter;
  display: inline-block;
}

.boardcontent_sub {
  font-size: 15px;
  text-align: center;
  font-family: Segoe UI;
  font-weight: lighter;
  display: inline-block;
}

.seperator {
  margin-top: 20px;
}

.filter_applied {
  background-color: orange;
}

.filter_canceled {
  background-color: #333;
}
</style>