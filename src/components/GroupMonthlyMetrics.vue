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

  <RefreshConfirmationModal :showDialog="showDialog" @Refresh_Confirmed="RefreshConfirmed" @Refresh_Canceled="RefreshCanceled"  greetingMessage="Are you sure to refresh the cache to get the live data which could take seconds ?">
  </RefreshConfirmationModal>

    <ul v-show="loaded === true">
      <li style="float: left">
        <a> Group Monthly Metrics </a>
      </li>

      <li style="float: right;padding-right:30px" @click="CleanCache">
        <a>
          <i
            class="fas fa-sync-alt"
            title="Clean server-side cache and re-fetch live data"
          ></i>  &nbsp;{{latestFreshTime}} UTC
        </a>
      </li>
    </ul>
    <div v-for="(data, index) in analyzed_ds_teams" :key="data.manager">
      <label
        :class="{
          'white-text': appstylemode === 'DARK' || appstylemode === null,
          'black-text': appstylemode === 'DEFAULT',
        }"
        style="display:block;font-size:14px;text-align:left;padding:10px;text-transform: uppercase;text-align:left;c"
        ><i class="fas fa-user-friends" :class="{seperator: index!==0 }"></i> {{ data.manager }}'S TEAM
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
            <i class="fas fa-bone"></i> LOAD
          </p>
          <p class="boardcontent">{{ data.MetricsTeamLevel.load_index }}</p>
          <p class="boardcontent_sub">
            &nbsp;({{ data.MetricsTeamLevel.cases_assigned }})
          </p>
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
            <i class="fas fa-coffee"></i> THROUGHPUT
          </p>
          <p class="boardcontent">
            {{ data.MetricsTeamLevel.throughput_index }}
          </p>
          <p class="boardcontent_sub">
            &nbsp;({{ data.MetricsTeamLevel.cases_closed }})
          </p>
          <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
        </div>

        <div
          id="display1530"
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
          <i class="far fa-object-ungroup"></i> DELTA
          </p>
          <p class="boardcontent">
            {{ data.MetricsTeamLevel.delta }}
          </p>
          
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
            <i class="fas fa-user-alt"></i> ENGINEERS
          </p>
          <p class="boardcontent">
            {{ data.MetricsTeamLevel.engineers }}
          </p>
          
          <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
        </div>

         <div
          id="display1530"
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
            <i class="fas fa-clock"></i> DAYS ELAPSED
          </p>
          <p class="boardcontent">
            {{ data.MetricsTeamLevel.days_elapsed }}
          </p>
          
          <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
        </div>


        <div style="clear: both"></div>

      </div>



   
      <!-- end -->

      <ChartBarByEngineer
        :title="`Backlog By Engineer`"
        :chartData="data.DSBarMonthlyMetrics"
        :width_param="49.75"
        :height="147"
      ></ChartBarByEngineer>

      <ChartBarByEngineer
        :title="`Backlog By Engineer`"
        :chartData="data.DSBarMonthlyMetrics_Index"
        :height="147"
        :width_param="49.75"
        :stepValue="0.5"
      ></ChartBarByEngineer>
      <div style="clear: both"></div>
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

import ChartBarByEngineer from "./ChartBarByEngineer.vue";
import SiteNav from "../components/SiteNav";
import Footer from "../components/layout/Footer";
import RefreshConfirmationModal from "./RefreshConfirmationModal";

export default {
  name: "GroupMonthlyMetrics",
  components: {
    ChartBarByEngineer,
    SiteNav,
     Footer,
      RefreshConfirmationModal,
  },

  data() {
    return {
      siteNivBar_expanded: "false",
      loaded: false,
      appstylemode: "DEFAULT",
       showDialog:false, //trigger the refresh modal 

        latestFreshTime:"",

      metrics_of_team_level: {
        cases_assigned: 0,
        cases_closed: 0,
        throughput_index: 0.0,
        load_index: 0.0,
        delta:0
      },
      //dataset after analysis
      analyzed_ds_teams: [],

      //dataset for barchat of assignment
      dataset_chart_bar_monthly_metrics: {
        labels: [],
        datasets: [
          {
            label: null,
            data: [],
            backgroundColor: null,
          },
        ],
      },

      dataset_chart_bar_monthly_metrics_index: {
        labels: [],
        datasets: [
          {
            label: null,
            data: [],
            backgroundColor: null,
          },
        ],
      },

      //metrices data for teams
      montlymetrics_teams: [],
    };
  },

  async created() {
    this.loaded = false;

     //set monthly metrics menu as selected item
     SaveSettingToSessionStorage('selectedMenu','3')

    this.latestFreshTime = await this.GetFreshTime();

    this.siteNivBar_expanded = GetSettingFromLocalStorage(
      "siteNivBar_expanded"
    );

    this.appstylemode =GetAppStyleMode();

   let teammanagers_alias_str =
      GetSettingFromSessionStorage("teammanagers_alias");

    if(teammanagers_alias_str=== null){
       const setting = await this.getsetting();
       SaveSettingToSessionStorage("teammanagers_alias",setting.teammanagers_alias);
    }

    let teammanagers_alias =
      GetSettingFromSessionStorage("teammanagers_alias").split(",");

    this.userRole = await WebAPI_Helper("get", "currentuserrole", null);

    //initial backlog for each team before we are going to analyze the data;
    for (let i = 0; i < teammanagers_alias.length; i++) {
       if(teammanagers_alias[i]==="" || teammanagers_alias[i] ===null) continue;

      //  if (this.userRole <=3 && teammanagers_alias[i] !== GetSettingFromSessionStorage("whoami")) continue;

      const data = await this.MonthlyMetricsByManager(teammanagers_alias[i]);
      const item = {
        manager: teammanagers_alias[i],
        metricses: data
       
      };
      this.montlymetrics_teams.push(item);
    }

    //Analyze the assignment of each team
    for (let i = 0; i < this.montlymetrics_teams.length; i++) {
      let engineers =[];
      if( GetSettingFromSessionStorage(this.montlymetrics_teams[i].manager)!==null) {
       engineers = GetSettingFromSessionStorage(this.montlymetrics_teams[i].manager).split(",");
      }
      else {
        engineers =await this.getteammembers(this.montlymetrics_teams[i].manager);
        SaveSettingToSessionStorage(
          this.montlymetrics_teams[i].manager,
          engineers
        );
      }

      this.Generate_Dataset_For_Charts(this.montlymetrics_teams[i].metricses);

      //Rectify the tp and load index by dividing the engineers' count
      this.metrics_of_team_level.throughput_index = (
        this.metrics_of_team_level.throughput_index /
        this.montlymetrics_teams[i].metricses.length
      ).toFixed(2);
      this.metrics_of_team_level.load_index = (
        this.metrics_of_team_level.load_index /
        this.montlymetrics_teams[i].metricses.length
      ).toFixed(2);

      this.metrics_of_team_level.engineers =engineers.length;
       const today = new Date();
      const today_day = String(today.getDate()).padStart(2, '0');
      this.metrics_of_team_level.days_elapsed = (today_day*0.7123).toFixed(2);

      this.metrics_of_team_level.delta = this.metrics_of_team_level.cases_assigned - this.metrics_of_team_level.cases_closed >=0? 
      "+"+ (this.metrics_of_team_level.cases_assigned - this.metrics_of_team_level.cases_closed).toString() :
      this.metrics_of_team_level.cases_assigned - this.metrics_of_team_level.cases_closed ;

      let data_point = {
        manager: this.montlymetrics_teams[i].manager,
        engineers: engineers.length,
        DSBarMonthlyMetrics: this.dataset_chart_bar_monthly_metrics,
        DSBarMonthlyMetrics_Index: this.dataset_chart_bar_monthly_metrics_index,
        MetricsTeamLevel: this.metrics_of_team_level,
      };

      this.analyzed_ds_teams = [...this.analyzed_ds_teams, data_point];
      this.Clean_Dataset_ForAllCharts();
    }
    this.loaded = true;
  },

  methods: {
    //Show | show Nav Bar of left panel
    ToggleNavBar(siteNivBar_expanded) {
      this.siteNivBar_expanded = siteNivBar_expanded;
    },

       CleanCache() {
        this.showDialog = true;
    },

    async GetFreshTime() {
      return await WebAPI_Helper("get","latestfreshtime(metrics)");
    },

    RefreshConfirmed(){
      this.showDialog=false;
      WebAPI_Helper("get", "cleancache(metrics)", null);
      location.reload();

    },

    
    RefreshCanceled(){
      this.showDialog=false;   

    },
    

    async MonthlyMetricsByManager(manager_alias) {
      const data = WebAPI_Helper(
        "get",
        "monthlymetrics(" + manager_alias + ")",
        null
      );

      return data;
    },

    async getteammembers(manager_alias) {
      return await WebAPI_Helper(
        "get",
        "teammembers(" + manager_alias + ")",
        null
      );
    },

    async getsetting() {
      return WebAPI_Helper("get", "getsetting", null);
    },
    

    Generate_Dataset_For_Charts(metricses) {
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

      //stacked starts

      //sort the metrics
      metricses = metricses.sort((a, b) => a.cases_closed - b.cases_closed);

      let labels_engineers_alias = [];
      metricses.forEach((metrics) => {
        let engeineer_alias = metrics.engineer_alias;
        labels_engineers_alias.push(engeineer_alias);
      });

      //Initial stacked dataset.
      let stacked_dataset_chart_bar = [];
      let stacked_dataset_chart_bar_index = [];

      //labels_engineers_alias.forEach((metrices)=>{
      let backgroundColor_metrics=Shuffle(backgroundColor_buffer, 0, 2);
      let dataset_item_cases_assigned = {
        label: "Cases Assigned",
        backgroundColor: backgroundColor_metrics[0],
        data: new Array(metricses.length).fill(0), // set value as 0
      };
      //set data of dataset item of all pod as 0
      stacked_dataset_chart_bar.push(dataset_item_cases_assigned);

      let dataset_item_cases_closed = {
        label: "Cases Closed",
        backgroundColor:backgroundColor_metrics[1],
        data: new Array(metricses.length).fill(0), // set value as 0
      };
      //set data of dataset item of all pod as 0
      stacked_dataset_chart_bar.push(dataset_item_cases_closed);
      //})

      //labels_engineers_alias.forEach((metrices)=>{
      let dataset_item_cases_assigned_index = {
        label: "Load Index",
        backgroundColor: backgroundColor_metrics[0],
        data: new Array(metricses.length).fill(0), // set value as 0
      };
      //set data of dataset item of all pod as 0
      stacked_dataset_chart_bar_index.push(dataset_item_cases_assigned_index);

      let dataset_item_cases_closed_index = {
        label: "Throughput Index",
        backgroundColor: backgroundColor_metrics[1],
        data: new Array(metricses.length).fill(0), // set value as 0
      };
      //set data of dataset item of all pod as 0
      stacked_dataset_chart_bar_index.push(dataset_item_cases_closed_index);
      //})

      //generated the stacked dataset for assignment based on pod
      labels_engineers_alias.forEach((engineer_alias) => {
        let index_metrics = metricses.findIndex((metrics) => {
          return metrics.engineer_alias === engineer_alias;
        }); // suppose index for renhe in labels is 2, then get the mtrics[2]
        let metrics = metricses[index_metrics];

        stacked_dataset_chart_bar[0].data[index_metrics] =
          metrics.cases_assigned; // datasets[0] is for assigned.
        stacked_dataset_chart_bar_index[0].data[index_metrics] =
          metrics.load_index; // datasets[0] is for assigned.

        stacked_dataset_chart_bar[1].data[index_metrics] = metrics.cases_closed; // datasets[1] is for closed.
        stacked_dataset_chart_bar_index[1].data[index_metrics] =
          metrics.throughput_index; // datasets[1] is for closed.

        this.metrics_of_team_level.cases_assigned += metrics.cases_assigned;
        this.metrics_of_team_level.load_index += metrics.load_index;
        this.metrics_of_team_level.cases_closed += metrics.cases_closed;
        this.metrics_of_team_level.throughput_index += metrics.throughput_index;
        
      });

      this.dataset_chart_bar_monthly_metrics.labels = labels_engineers_alias;
      this.dataset_chart_bar_monthly_metrics.datasets =
        stacked_dataset_chart_bar;

      this.dataset_chart_bar_monthly_metrics_index.labels =
        labels_engineers_alias;
      this.dataset_chart_bar_monthly_metrics_index.datasets =
        stacked_dataset_chart_bar_index;

      //staced ends
    },

    Clean_Dataset_ForAllCharts() {
      this.dataset_chart_bar_monthly_metrics = {
        labels: [],
        datasets: [
          {
            label: null,
            data: [],
            backgroundColor: null,
          },
        ],
      };

      this.dataset_chart_bar_monthly_metrics_index = {
        labels: [],
        datasets: [
          {
            label: null,
            data: [],
            backgroundColor: null,
          },
        ],
      };

      this.metrics_of_team_level = {
        cases_assigned: 0,
        cases_closed: 0,
        throughput_index: 0.0,
        load_index: 0.0,
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
  font-size: 20px;
  text-align: center;
  font-family: Segoe UI;
  font-weight: lighter;
  display: inline-block;
}

.seperator {
  margin-top: 20px
}
</style>