<template>
  <SiteNav @ToggleNavBar="ToggleNavBar" :siteNivBar_expanded="siteNivBar_expanded"></SiteNav>
  <div
    :class="{
      NavBarCollapsed:
        siteNivBar_expanded === 'false' || siteNivBar_expanded === undefined,
      NavBarExpanded: siteNivBar_expanded === 'true',
    }"  >
      <div id="loadingcontainer" v-show="loaded !== true">
      <img src="../images/loading.jpg" />
      </div>

    <RefreshConfirmationModal
      :showDialog="showDialog"
      @Refresh_Confirmed="RefreshConfirmed"
      @Refresh_Canceled="RefreshCanceled"
    ></RefreshConfirmationModal>

    <div v-show="loaded">
      <ul>
        <li style="float: left">
          <a>Dashboard For Active Cases </a>
        </li>

        <li style="float: right; padding-right: 30px" @click="CleanCache">
          <a>
            <i
              class="fas fa-sync-alt"
              title="Clean server-side cache and re-fetch live data"
            ></i> &nbsp;{{latestFreshTime}} UTC
           
          </a>
        </li>

        <li v-show="userrole===5"
          style="float: right"
          v-bind:class="{
            filter_applied: showdetailsPanelofGroupDashboard === 'true',
            filter_canceled:
              showdetailsPanelofGroupDashboard === 'false' ||
              showdetailsPanelofGroupDashboard === undefined ||
              showdetailsPanelofGroupDashboard === null,
          }"
          @click="ToggleDetailsPanel"
        >
          <a
            ><i
              class="fab fa-buffer"
              titie="Show detailed dashboard of each team"
            ></i>
          </a>
        </li>
      </ul>

      <div v-if="userrole ===5">
        <!-- overall view -->
        <label
          :class="{
            'white-text': appstylemode === 'DARK' || appstylemode === null,
            'black-text': appstylemode === 'DEFAULT',
          }"
          style="display:block;font-size:14px;text-align:left;padding:10px;text-transform: uppercase;text-align:left;c"
          ><i class="fas fa-user-friends"></i> OVERALL DASHBOARD
        </label>
        <Displayboard
          :summary="analyzed_ds_teams_overall.summary"
          :appstylemode="appstylemode"
        ></Displayboard>
        <ChartBubble
          :interactive="false"
          :width_param="99.5"
          :chartData="analyzed_ds_teams_overall.DSBubble"
          :height="70"
        ></ChartBubble>
        <ChartBarByEngineer
          :title="`Backlog By Engineer`"
          :width_param="99.5"
          :chartData="analyzed_ds_teams_overall.DSBarBacklog"
          :height="70"
        ></ChartBarByEngineer>
        <div style="clear: both"></div>
        <!-- <div style="margin:20px;display:block"> &nbsp; </div> -->
        <!-- overall end -->
      </div>

      <div
        v-for="data in analyzed_ds_teams"
        :key="data.manager"
        v-show="showdetailsPanelofGroupDashboard === 'true'"
      >
        <label
          :class="{
            'white-text': appstylemode === 'DARK' || appstylemode === null,
            'black-text': appstylemode === 'DEFAULT',
          }"
          style="display:block;font-size:14px;text-align:left;padding:10px;text-transform: uppercase;text-align:left;c"
          ><i class="fas fa-user-friends" style="margin-top: 20px"></i> {{ data.manager }}'S TEAM</label
        >
        <Displayboard
          :summary="data.summary"
          :appstylemode="appstylemode"
        ></Displayboard>
        <ChartBubble
          :interactive="false"
          :width_param="99.5"
          :chartData="data.DSBubble"
          :height="70"
        ></ChartBubble>

        <ChartBarByEngineer
          :title="`Backlog By Engineer`"
          :chartData="data.DSBarBacklog"
          :height="146.5"
        ></ChartBarByEngineer>
        <ChartPieByPod
          :chartData="data.DSPiePod"
          :height="70.99"
        ></ChartPieByPod>
        <ChartPieByRegion
          :chartData="data.DSPieRegion"
          :height="70.99"
        ></ChartPieByRegion>
        <ChartPieByStatus
          :chartData="data.DSPieStatus"
          :height="70.99"
        ></ChartPieByStatus>
        <ChartPieByIcM
          :chartData="data.DSPieIcM"
          :height="70.99"
        ></ChartPieByIcM>
        <div style="clear: both"></div>
      </div>
    </div>
  </div>
  <Footer :appstylemode="appstylemode" />
</template>
<script>
import {
  WebAPI_Helper,
  GetSettingFromSessionStorage,
  SaveSettingToSessionStorage,
  GetSettingFromLocalStorage,
     GetAppStyleMode,

  Shuffle,
} from "../common.js";

import ChartBubble from "./ChartBubble.vue";
import ChartPieByStatus from "./ChartPieByStatus.vue";
import ChartPieByIcM from "./ChartPieByIcM.vue";
import ChartPieByPod from "./ChartPieByPod.vue";
import ChartPieByRegion from "./ChartPieByRegion.vue";
import ChartBarByEngineer from "./ChartBarByEngineer";
import Footer from "../components/layout/Footer";
import RefreshConfirmationModal from "./RefreshConfirmationModal";

import Displayboard from "../components/Displayboard.vue";

//site nav
import SiteNav from "../components/SiteNav";

export default {
  name: "GroupDashboard",
  components: {
    ChartBubble,
    ChartPieByStatus,
    ChartPieByIcM,
    ChartPieByPod,
    ChartPieByRegion,
    ChartBarByEngineer,
    SiteNav,
    Displayboard,
    Footer,
    RefreshConfirmationModal,
  },
  data() {
    return {
      backlog_teams: [], //backlogs_teams['yeda']=<backlog list>
      analyzed_ds_teams: [], //backlogs array for different teams. will be analyzed_ds_teams['luha']={manager:'luha',backloglist:<caselist>,DSbuble:<ds_bubble>,DSPieIcM:<ds_pie_icm>}
      analyzed_ds_teams_overall: {},
      siteNivBar_expanded: "false",
      showDialog: false, //trigger the refresh modal
      loaded: false,
      appstylemode: "DEFAULT",

       latestFreshTime:"",
       userrole:1,

      showdetailsPanelofGroupDashboard: "false",

      //dataset for charts
      dataset_chart_bubble: {
        datasets: [],
      },

      //dataset for pirchart by case status
      dataset_chart_pie_by_status: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

      // dataset for piechar by icm
      dataset_chart_pie_by_icm: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

      //dataset for piechar by pod
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
      dataset_chart_pie_by_region: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

      //dataset for barchat for icm b engineer
      dataset_chart_bar_backlog_by_engineer: {
        labels: [],
        datasets: [
          {
            label: null,
            data: [],
            backgroundColor: null,
          },
        ],
      },
    };
  },

  

  async created() {
    this.loaded = false;  
     //set group dashboard menu as selected item
    SaveSettingToSessionStorage('selectedMenu','2');

    this.latestFreshTime = await this.GetFreshTime();

     

      this.showdetailsPanelofGroupDashboard =
      GetSettingFromSessionStorage(this.showdetailsPanelofGroupDashboard) !== null
        ? GetSettingFromSessionStorage(this.showdetailsPanelofGroupDashboard)
        : "true";

    this.siteNivBar_expanded =
      GetSettingFromLocalStorage("siteNivBar_expanded") !== null
        ? GetSettingFromLocalStorage("siteNivBar_expanded")
        : "false";

    this.appstylemode =GetAppStyleMode();

    let teammanagers_alias_str =
      GetSettingFromSessionStorage("teammanagers_alias");

    if (teammanagers_alias_str === null) {
      const setting = await WebAPI_Helper("get","getsetting",null);

      SaveSettingToSessionStorage(
        "teammanagers_alias",
        setting.teammanagers_alias
      );
    }

    let teammanagers_alias =
      GetSettingFromSessionStorage("teammanagers_alias").split(",");


      for(let i=0;i<teammanagers_alias.length;i++){
         let profile = await WebAPI_Helper("get","teamprofile/manager/"+teammanagers_alias[i],null);
         SaveSettingToSessionStorage("Threshold_High_Backlog"+"_Of_Team_"+teammanagers_alias[i],profile.Threshold_High_Backlog)

      }
   

    //initial backlog for each team before we are going to analyze the data;
    for (let i = 0; i < teammanagers_alias.length; i++) {
       if(teammanagers_alias[i]==="" || teammanagers_alias[i] ===null) continue;

      const data = await this.ServiceTicketsByManager(teammanagers_alias[i]);
      const item = {
        manager: teammanagers_alias[i],
        backlog: data,
      };
      this.backlog_teams.push(item);
    }

    let backlog_overall = [];

    //Analyze the backlog of each team
    let overall_engineers_number = 0;
    for (let i = 0; i < this.backlog_teams.length; i++) {
      backlog_overall = [...backlog_overall, ...this.backlog_teams[i].backlog]; // save the team backlog to overall view

      let summary = await this.Generate_Summary(
        this.backlog_teams[i].backlog,
        this.backlog_teams[i].manager
      );

      this.Generate_Dataset_For_Charts(
        this.backlog_teams[i].backlog,
        this.backlog_teams[i].manager.toUpperCase()
      );

      let data_point = {
        manager: this.backlog_teams[i].manager,
        summary: summary,
        DSBubble: this.dataset_chart_bubble,
        DSPiePod: this.dataset_chart_pie_by_pod,
        DSPieRegion: this.dataset_chart_pie_by_region,
        DSPieStatus: this.dataset_chart_pie_by_status,
        DSPieIcM: this.dataset_chart_pie_by_icm,
        DSBarBacklog: this.dataset_chart_bar_backlog_by_engineer,
      };
      this.analyzed_ds_teams.push(data_point);

      overall_engineers_number += summary.engineers;

      this.Clean_Dataset_ForAllCharts();
    }

  this.userrole= GetSettingFromSessionStorage("userrole") === null? await WebAPI_Helper("get","currentuserrole",null):parseInt(GetSettingFromSessionStorage("userrole")); 
   SaveSettingToSessionStorage("userrole",this.userrole);

 //generate the dataset of overall view
 if(this.userrole ===5) { // generate overall summary for region lead only
    
    let summary_overall = await this.Generate_Summary(backlog_overall, null);
    // rectify the overall engineers number:
    summary_overall.engineers = overall_engineers_number;

    this.Generate_Dataset_For_Charts(backlog_overall, "OVERALL DASHBOARD");
    let data_point_overall = {
      summary: summary_overall,
      DSBubble: this.dataset_chart_bubble,
      DSPiePod: this.dataset_chart_pie_by_pod,
      DSPieRegion: this.dataset_chart_pie_by_region,
      DSPieStatus: this.dataset_chart_pie_by_status,
      DSPieIcM: this.dataset_chart_pie_by_icm,
      DSBarBacklog: this.dataset_chart_bar_backlog_by_engineer,
    };
    this.analyzed_ds_teams_overall = data_point_overall;
    
 }
 //end

    this.loaded = true;
  },

  methods: {
    ToggleDetailsPanel() {
      if (this.showdetailsPanelofGroupDashboard === "true") {
        this.showdetailsPanelofGroupDashboard = "false";
      } else this.showdetailsPanelofGroupDashboard = "true";

      SaveSettingToSessionStorage(
        "showdetailsPanelofGroupDashboard",
        this.showdetailsPanelofGroupDashboard
      );
    },

    async GetFreshTime() {
      return await WebAPI_Helper("get","latestfreshtime(dashboard)");
    },

    async getteammembers(manager_alias) {
      return await WebAPI_Helper(
        "get",
        "teammembers(" + manager_alias + ")",
        null
      );
    },

    CleanCache() {
      this.showDialog = true;
    },

    RefreshConfirmed() {
      this.showDialog = false;
      // this.latestRefreshTime = new Date().toISOString().split("T")[1].slice(0, 8) + " UTC";
      WebAPI_Helper("get", "cleancache(dashboard)", null);
      location.reload();
    },

    RefreshCanceled() {
      this.showDialog = false;
    },

    Generate_Backlog(servicetickets) {
      let engineers_backlog_array = [];
      for (let i = 0; i < servicetickets.length; i++) {
        let sr_caseowner = servicetickets[i].sr_caseowner;
        let item_found = undefined;
        if (engineers_backlog_array.length != 0) {
          item_found = engineers_backlog_array.find(
            (item) => item.sr_caseowner === sr_caseowner
          );
        }

        if (item_found !== undefined) {
          // find an existing item
          item_found.backlog += 1;
        } else {
          let backlog_item = {
            sr_caseowner: sr_caseowner,
            backlog: 1,
          };
          engineers_backlog_array.push(backlog_item);
        }
      }
      //rank it

      engineers_backlog_array = engineers_backlog_array.sort(
        (a, b) => a.backlog - b.backlog
      );

      return engineers_backlog_array;
    },

    async Generate_Summary(servicetickets, manager_alias = null) {
      let servicetickets_15 = servicetickets.filter(
        (ticket) => ticket.sr_age < 15
      );
      let servicetickets_15_30 = servicetickets.filter(
        (ticket) => ticket.sr_age < 30 && ticket.sr_age >= 15
      );
      let servicetickets_30_45 = servicetickets.filter(
        (ticket) => ticket.sr_age < 45 && ticket.sr_age >= 30
      );
      let servicetickets_45_60 = servicetickets.filter(
        (ticket) => ticket.sr_age < 60 && ticket.sr_age >= 45
      );
      let servicetickets_60 = servicetickets.filter(
        (ticket) => ticket.sr_age >= 60
      );

      let bug_count = "NA";//servicetickets.filter(ticket => ticket.sr_bugurl!==null).length;
      //calculate the bug infor is too high price.
      let summary = {};

      summary.count15 = servicetickets_15.length;
      summary.count1530 = servicetickets_15_30.length;
      summary.count3045 = servicetickets_30_45.length;
      summary.count4560 = servicetickets_45_60.length;
      summary.count60 = servicetickets_60.length;
      summary.backlog = servicetickets.length;

      if (manager_alias !== null) {
        //  summary.engineers =await this.getteammembers(manager_alias).length; //this.Refresh_Engieers_Number(servicetickets);
        let engineers_string = GetSettingFromSessionStorage(manager_alias);
        let engineers=[];
        if (engineers_string === null) {
          engineers = await this.getteammembers(manager_alias);
          SaveSettingToSessionStorage(manager_alias, engineers);
        }
        else {
          engineers = engineers_string.split(",");
        }
        summary.engineers = engineers.length;
      } else {
        summary.engineers = 0;
      }

      summary.bug_count = bug_count;
      summary.trendingissues_count =
        this.Refresh_Trending_Issues_Count(servicetickets);

      const total =
        summary.count15 +
        summary.count1530 +
        summary.count3045 +
        summary.count4560 +
        summary.count60;

      if (total !== 0) {
        summary.count15_percentage =
          (100 * (summary.count15 / total)).toFixed(1) + "%";
        summary.count1530_percentage =
          (100 * (summary.count1530 / total)).toFixed(1) + "%";
        summary.count3045_percentage =
          (100 * (summary.count3045 / total)).toFixed(1) + "%";
        summary.count4560_percentage =
          (100 * (summary.count4560 / total)).toFixed(1) + "%";
        summary.count60_percentage =
          (100 * (summary.count60 / total)).toFixed(1) + "%";
        summary.trendingissues_count_percentage =
          (100 * (summary.trendingissues_count / total)).toFixed(1) + "%";

          summary.bug_count_percentage = "NA";
         // (100 * (summary.bug_count / total)).toFixed(1) + "%";
      }

      return summary;
    },

    Refresh_Engieers_Number(servicetickets) {
      let engineers = [];
      for (let i = 0; i < servicetickets.length; i++) {
        let sr_caseowner = servicetickets[i].sr_caseowner;

        //for current case, we checked the case owner and see if this curent owner appears in the engineers list.
        // if not, it's a new engineer and put it into engineers list
        if (
          engineers.find((element) => element === sr_caseowner) === undefined
        ) {
          engineers = [...engineers, sr_caseowner];
        }
      }
      // the length of engineers list is just the number of engineers of current service ticekts.
      return engineers.length;
    },

    Refresh_Trending_Issues_Count(servicetickets) {
      let trending_number = 0;

      for (let i = 0; i < servicetickets.length; i++) {
        if (servicetickets[i].is_trending_issue === true) {
          trending_number = trending_number + 1;
        }
      }
      return trending_number;
    },

    Clean_Dataset_ForAllCharts() {
      this.dataset_chart_bubble = {
        datasets: [],
      };

      //dataset for pirchart by case status
      this.dataset_chart_pie_by_status = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };

      // dataset for piechar by icm
      this.dataset_chart_pie_by_icm = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };

      //dataset for piechar by pod
      this.dataset_chart_pie_by_pod = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
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

      //dataset for barchat for icm b engineer
      this.dataset_chart_bar_backlog_by_engineer = {
        labels: [],
        datasets: [
          {
            label: null,
            data: [],
            backgroundColor: null,
          },
        ],
      };
    },

    Generate_Dataset_For_Charts(servicetickets, team_manager) {
      // Variables for piechart of icm status
      let Number_IcMRaised = 0;
      let Number_NoIcM = 0;

      // Variables for piechart by pod
      let labels_pod = [];
      let Number_pod = []; // An array to store the number of each pod

      // Variables for piechart by status
      let labels_status = [];
      let Number_status = [];

      //Variables for piechart by region
      let labels_region = [];
      let Number_region = []; // An array to store the number of each pod

      //Variabes for bubble chart.
      let dataset_for_bubble_chart = [];

      //Variablles for bar chart of backlog
      let labels_backlog = [];
      let Numbers_backlog = [];
      let engineers_backlog = this.Generate_Backlog(servicetickets);

      for (let i = 0; i < engineers_backlog.length; i++) {
        let sr_caseowner = engineers_backlog[i].sr_caseowner;
        let backlog = engineers_backlog[i].backlog;
        labels_backlog.push(sr_caseowner);
        Numbers_backlog.push(backlog);
      }

      //Initial labels for pod
      for (let i = 0; i < servicetickets.length; i++) {
        let pod =
          servicetickets[i].sr_support_pod !== null
            ? servicetickets[i].sr_support_pod
            : "Unknown";

        //initial labels for pod
        if (labels_pod.find((element) => element === pod) === undefined) {
          labels_pod = [...labels_pod, pod];
          //initiale  array
          Number_pod.push(0);
        }

        //initial labels for region
        let region =
          servicetickets[i].sr_country_code !== null
            ? servicetickets[i].sr_country_code
            : "Unknown";

        if (labels_region.find((element) => element === region) === undefined) {
          labels_region = [...labels_region, region];
          //initiale  array
          Number_region.push(0);
        }

        //initial labes for case status
        let status =
          servicetickets[i].sr_status !== null
            ? servicetickets[i].sr_status
            : "Unknown";
        if (labels_status.find((element) => element === status) === undefined) {
          labels_status = [...labels_status, status];
          //initiale  array
          Number_status.push(0);
        }
      }

      //Initial labels and background  for bubble chart
      let data_item_15Days = {
        label: "LESS THAN 15 DAYS",
        backgroundColor: "#01579b",
        data: [],
      };

      let data_item_1530 = {
        label: "15-30 DAYS",
        backgroundColor: "#311b92",
        data: [],
      };

      let data_item_3045 = {
        label: "31-45 DAYS",
        backgroundColor: "#e27743",
        data: [],
      };

      let data_item_4560 = {
        label: "46-60 DAYS",
        backgroundColor: "#880e4f",
        data: [],
      };

      let data_item_60 = {
        label: "> 60 DAYS",
        backgroundColor: "#b71c1c",
        data: [],
      };
      //end

      //Generate datasets from list now.
      for (let i = 0; i < servicetickets.length; i++) {
        let serviceticket = servicetickets[i];
        let idle_days = serviceticket.sr_idle_days;
        let sr_age = serviceticket.sr_age;
        let sr_owner = serviceticket.sr_caseowner;
        let sr_number = serviceticket.sr_number;
        let sr_region = serviceticket.sr_country_code;
        let sr_customer = serviceticket.primaryAddress;
        let status = serviceticket.sr_status;
        let sr_icm = serviceticket.sr_icm;
        let sr_record_guid = serviceticket.sr_record_guid;

        //generate dataset for bubble chart
        let data_point = {
          x: sr_age <= 120 ? sr_age : 120,
          y: idle_days <= 120 ? idle_days : 120,
          r: 10,
          sr_owner: sr_owner,
          sr_number: sr_number,
          sr_region: sr_region,
          sr_customer: sr_customer,
          sr_record_guid: sr_record_guid,
        };

        if (serviceticket.sr_age < 15) {
          data_item_15Days.data = [...data_item_15Days.data, data_point];
        } else if (serviceticket.sr_age >= 15 && serviceticket.sr_age <= 30) {
          data_item_1530.data = [...data_item_1530.data, data_point];
        } else if (serviceticket.sr_age > 30 && serviceticket.sr_age <= 45) {
          data_item_3045.data = [...data_item_3045.data, data_point];
        } else if (serviceticket.sr_age > 45 && serviceticket.sr_age <= 60) {
          data_item_4560.data = [...data_item_4560.data, data_point];
        } else {
          data_item_60.data = [...data_item_60.data, data_point];
        }
        //generate dataset for bubble chart ends

        let temp_index;

        //generate dataset for chart pie by status

        //Search the labels of status, and increase the number if matched.
        temp_index = labels_status.indexOf(status);
        let status_index =
          temp_index != -1 ? temp_index : labels_status.indexOf("Unknown");
        Number_status[status_index] += 1;

        //Search the labels of icm, and increase the number if matched.
        if (sr_icm !== null) Number_IcMRaised += 1;
        else Number_NoIcM += 1;

        //Search the labels of pod, and increase the number if matched.
        let item_pod = serviceticket.sr_support_pod;
        temp_index = labels_pod.indexOf(item_pod);
        let pod_index =
          temp_index !== -1 ? temp_index : labels_pod.indexOf("Unknown");
        Number_pod[pod_index] += 1; //increase the number of corresponding pod

        //Search the labels of region, and increase the number if matched.
        let item_region = serviceticket.sr_country_code;
        temp_index = labels_region.indexOf(item_region);
        let region_index =
          temp_index !== -1 ? temp_index : labels_region.indexOf("Unknown");
        Number_region[region_index] += 1; //increase the number of corresponding region
      }
      // loop end

      // insert the data_item int bubble dataset dic
      dataset_for_bubble_chart = [
        data_item_15Days,
        data_item_1530,
        data_item_3045,
        data_item_4560,
        data_item_60,
      ];
      this.dataset_chart_bubble.datasets = dataset_for_bubble_chart;

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

      //generate dataset for pie chart by icm
      let data_icm = [];
      let background_icm = [];
      let datasets_icm = [];
      let dataitem_icm = {};

      this.dataset_chart_pie_by_icm.labels = [
        "Cases with IcM Raised",
        "Cases without IcM",
      ];

      data_icm = [Number_IcMRaised, Number_NoIcM];
      // background_icm = Shuffle(backgroundColor_buffer).slice(
      //   0,
      //   this.dataset_chart_pie_by_icm.labels.length
      // );

      background_icm = ["#880e4f", "darkgray"];
      
      dataitem_icm.data = data_icm;
      dataitem_icm.backgroundColor = background_icm;
      datasets_icm = [...datasets_icm, dataitem_icm];

      this.dataset_chart_pie_by_icm.datasets = datasets_icm;

      //end

      //generate dataset for pie chart by pod
      let backgroundColor_pod = [];
      backgroundColor_pod = Shuffle(backgroundColor_buffer).slice(
        0,
        labels_pod.length
      );

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

      // datasets for barchat of backlog
      let background_backlog = [];
      let datasets_backlog = [];
      let high_backlog_limit = parseInt(
        GetSettingFromSessionStorage("Threshold_High_Backlog"+"_Of_Team_"+team_manager.toLowerCase())
      );

      if(isNaN(high_backlog_limit)) high_backlog_limit = 15; // set default high backlog threshodl as 15;

       //generate varied color based on backlog
      for (let i = 0; i < Numbers_backlog.length; i++) {
        if (Numbers_backlog[i] < high_backlog_limit) {
          background_backlog.push("darkgray");
        } else background_backlog.push("#b71c1c");
      }

      let dataitem_backlog = {
        label: "Backlog (team: " + team_manager.toUpperCase() + ")",
        backgroundColor: background_backlog,
        data: Numbers_backlog,
      };
      datasets_backlog.push(dataitem_backlog);

      this.dataset_chart_bar_backlog_by_engineer.labels = labels_backlog;
      this.dataset_chart_bar_backlog_by_engineer.datasets = datasets_backlog;

      //generate dataset for pie chart by status
      // let data = [];
      let backgroundColor_status = [];
      let datasets = [];
      let dataitem = {};

      backgroundColor_status = Shuffle(backgroundColor_buffer).slice(
        0,
        labels_status.length
      );
      dataitem.data = Number_status;
      dataitem.backgroundColor = backgroundColor_status;
      datasets = [...datasets, dataitem];
      this.dataset_chart_pie_by_status.datasets = datasets;
      this.dataset_chart_pie_by_status.labels = labels_status;
    },

    //Show | show Nav Bar of left panel
    ToggleNavBar(siteNivBar_expanded) {
      this.siteNivBar_expanded = siteNivBar_expanded;
    },

    async ServiceTicketsByManager(manager_alias) {
      const data = WebAPI_Helper(
        "get",
        "serviceticketsbymanager(" + manager_alias + ")",
        null
      );

      return data;
    },
  },
};
</script>

<style scoped>
body {
  background-color: #aab1c0;
  font-family: Helvetica, sans-serif;
}

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
</style>