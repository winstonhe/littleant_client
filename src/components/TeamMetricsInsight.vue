<template>
  <SiteNav @ToggleNavBar="ToggleNavBar" :siteNivBar_expanded="siteNivBar_expanded"></SiteNav>
  <div
    :class="{
      NavBarCollapsed:
        siteNivBar_expanded === 'false' || siteNivBar_expanded === undefined,
      NavBarExpanded: siteNivBar_expanded === 'true',
    }"
  >
  <LoadingCircle :showLoading="loaded === false" ></LoadingCircle>

    <div v-show="loaded === true">
      <EngineerFilterModal
        :engineers="engineers"
        :showDialog="showFilter"
        :EngineersFilterModalTitle="EngineersFilterModalTitle"
        @ApplyFilter="ApplyFilter"
        @Cancel_Filter="CancelFilter"
        @CloseEngineerFilterModal="showFilter = false"
      ></EngineerFilterModal>

      <ul>
        <li style="float: left">
          <a>{{ title }}</a>
        </li>

        <li
          style="float: right;margin-right: 30px"
          v-bind:class="{
            filter_applied: lineChartMode === 'monthmode',
            filter_canceled: lineChartMode !== 'monthmode',
          }"
          @click="showChartofMonth"
        >
          <a><i class="fas fa-th-large" title="Monthly View (Past 12 months)"></i> </a>
        </li>

        <li
          style="float: right"
          v-bind:class="{
            filter_applied: lineChartMode === 'datemode',
            filter_canceled: lineChartMode !== 'datemode',
          }"
          @click="showChartofDate"
        >
          <a><i class="fas fa-th" title="Daily View (Past 30 days)"></i> </a>
        </li>

        <li v-show="userrole<=2"
          style="float: right;"
          v-bind:class="{
            filter_applied: filterApplied === true,
            filter_canceled: filterApplied === false,
          }"
          @click="showFilter = true"
        >
          <a><i class="fas fa-filter" title="Filter Engineers"></i> </a>
        </li>

        <li
          v-show="filterApplied"
          style="float: right"
          class="cahrtfilter_applied"
          @click="CancelFilter"
        >
          <a
            >[{{ engineers_Filters_Description }}] <i class="fas fa-eraser"></i
          ></a>
        </li>
      </ul>
     
      
      <div
      v-if="Team_DateSet_Array.length === 1 && !Team_DateSet_Array[0].isDataContained"
        style="display: inline-block; margin: 50px; padding-top: 5px"
      >
        <label  style="top: 5px"        
         :class="{
            'white-text': appstylemode === 'DARK' ,
            'black-text': appstylemode !== 'DARK'
          }"
        >
          To display the operation footprint of your team, kindly please create a daily snapshot by navigating to my little ant and clicking the button of snapshot creation.</label>
      </div>
    

      <div v-for="Team_DataSet in Team_DateSet_Array" :key="Team_DataSet.name" v-show="Team_DataSet.isDataContained">
        <label style="
            display: block;
            font-size: 14px;
            text-align: left;
            padding: 10px;
            text-transform: uppercase;
            text-align: left;
          "
           :class="{
            'white-text': appstylemode === 'DARK' ,
            'black-text': appstylemode !== 'DARK'
          }"
        >
          <i class="fas fa-user-friends" ></i> {{ Team_DataSet.name }}
          &nbsp;&nbsp;
        </label>

        <!-- Team line chart -->

        <ChartLine
          :interactive="false"
          :width_param="49.75"
          :chartData="Team_DataSet.dataset"
          :height="200"
          :title="`Team Case Distribution By Age`"
          :minValue="0"
          :maxValue="Team_DataSet.maxValue"
          :stepValue="20"
        ></ChartLine>

        <ChartLinePercentage
          :interactive="false"
          :width_param="49.75"
          :chartData="Team_DataSet.dataset_percent"
          :height="200"
          :title="`Percentage of Team Case Distribution By Age`"
        ></ChartLinePercentage>

        <ChartLine
          :interactive="false"
          :width_param="49.75"
          :chartData="Team_DataSet.dataset_assigned"
          :height="200"
          :title="`Team Case Assignment`"
          :minValue="0"
          :maxValue= "Team_DataSet.maxValue_asigned" 
          :stepValue="stepValue_team_linechart_assigned"        
        ></ChartLine>
          <!-- " maxValue_team_linechart_assigned" -->
         <div style="clear: both"></div>
      </div>

      <!-- team line chart end -->
      <div style="clear: both"></div>

      <!-- engineers line chart -->
      <div
        v-for="engineer_dataset in Engineers_Dataset"
        :key="engineer_dataset.name"
      >
        <label
          :class="{
            'white-text': appstylemode === 'DARK' || appstylemode === null,
            'black-text': appstylemode !== 'DARK',
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
          <i class="fas fa-user-alt" style="margin-top: 20px"></i>
          {{ engineer_dataset.name }}
          &nbsp;&nbsp;
        </label>

        <ChartLine
          :interactive="false"
          :width_param="49.75"
          :chartData="engineer_dataset.dataset"
          :height="160"
          :title="`Engineer Case Distribution (${engineer_dataset.name})`"
          :minValue="0"
          :maxValue="20"
          :stepValue="2"
        ></ChartLine>

        <ChartLinePercentage
          :interactive="false"
          :width_param="49.75"
          :chartData="engineer_dataset.dataset_percent"
          :height="160"
          :title="`Percertange of Case Distribution (${engineer_dataset.name})`"
        ></ChartLinePercentage>

        <ChartLine
          :interactive="false"
          :width_param="49.75"
          :chartData="engineer_dataset.dataset_assigned"
          :height="160"
          :title="`Engineer Case Assignment (${engineer_dataset.name})`"
          :minValue="0"
          :maxValue="maxValue_engineer_linechart_assigned"
          :stepValue="stepValue_engineer_linechart_assigned"
        ></ChartLine>
        <div style="clear: both"></div>
      </div>

      <!-- engineer chart end -->
    </div>
  </div>
  <div style="clear: both"></div>
  <Footer :appstylemode="appstylemode" v-if="loaded === true"/>
</template>
<script>
import {
  WebAPI_Helper,
  GetSettingFromSessionStorage,  
  SaveSettingToSessionStorage,
  GetSettingFromLocalStorage,
  SaveSettingToLocalStorage,
  GetAppStyleMode,
  Get_Team_DisplayName

} from "../common.js";

import ChartLine from "./ChartLine.vue";
import ChartLinePercentage from "./ChartLinePercentage";
import SiteNav from "./SiteNav";
import Footer from "../components/layout/Footer";
import EngineerFilterModal from "../components/EngineerFilterModal";
import LoadingCircle from "./LoadingCircle.vue";

export default {
  name: "TeamMetricsInsight",
  components: {
    ChartLine,
    ChartLinePercentage,
    SiteNav,
    EngineerFilterModal,
    LoadingCircle,
    Footer,
  },

  data() {
    return {
      siteNivBar_expanded: "false",
      loaded: false,
      userrole:1,
      appstylemode: "DEFAULT",
      showFilter: false,
      filterApplied: false,
      yearmonthdate: 0,
      yearmonth: 0,
      EngineersFilterModalTitle:
        "Please choose engineers for whom you want to check operation footprint ",
      engineers: [],

      title: "",
      engineers_Filters_Description: "",

      lineChartMode: "monthmode",

      metricsSnapshots: [],

      // for team dataset
      Team_DataSet: {},
      
      //team_dataset array for teams.
      Team_DateSet_Array :[],

      //max value

      maxValue_team_linechart_assigned: 30,
      maxValue_engineer_linechart_assigned: 4,

      stepValue_team_linechart_assigned: 3,
      stepValue_engineer_linechart_assigned: 1,

      //for engineer's dataset
      Engineers_Dataset: [],

      //temp dataset for storing the processed data
      dataset_chart_line: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

      //temp dataset for storing the processed data
      dataset_chart_line_assigned: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

      //temp dataset for storing the processed data
      dataset_percent_chart_line: {
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

  async created() {
    this.loaded = false;

   this.userrole= GetSettingFromSessionStorage("userrole") === null? await WebAPI_Helper("get","currentuserrole",null):parseInt(GetSettingFromSessionStorage("userrole")); 
   SaveSettingToSessionStorage("userrole",this.userrole);


    //set footprint menu as selected item
    SaveSettingToSessionStorage("selectedMenu", "6");

    this.siteNivBar_expanded =
      GetSettingFromLocalStorage("siteNivBar_expanded") !== null
        ? GetSettingFromLocalStorage("siteNivBar_expanded")
        : "false";

    this.appstylemode =GetAppStyleMode();

    
    this.lineChartMode =
      GetSettingFromLocalStorage("lineChartMode") === null
        ? "datemode"
        : GetSettingFromLocalStorage("lineChartMode");

    this.Init_LineChart_For_Team();
  },

  methods: {
    //Show | show Nav Bar of left panel
    ToggleNavBar(siteNivBar_expanded) {
      this.siteNivBar_expanded = siteNivBar_expanded;
    },
      
    async reportingm1manager(whoami) {
      return WebAPI_Helper("get", "reportingm1manager(" + whoami + ")");
    },

    async RetrieveSnapshots(manager_alias,yearmonthdate) {
      return WebAPI_Helper(
        "get",
        "metricssnapshots/manager/"+manager_alias+"/yearmonth/" + yearmonthdate
      );
    },

    async RetrieveSnapshotsGroupbyMonth(manager_alias,yearmonth) {
      return WebAPI_Helper(
        "get",
        "metricssnapshotsgroupbymonth/manager/"+ manager_alias+ "/yearmonth/" + yearmonth
      );
    },

    CancelFilter() {
      this.Engineers_Dataset = [];
      this.showFilter = false;
      window.localStorage.removeItem("engineers_chosen_forchart");
      this.filterApplied = false;
      this.engineers_Filters_Description = "";
    },
    ApplyFilter(engineers_chosen) {
      SaveSettingToLocalStorage(
        "engineers_chosen_forchart",
        JSON.stringify(engineers_chosen)
      );
      //clearn existing dataset;
      this.Engineers_Dataset = [];

      this.engineers_Filters_Description =
        "Engineers in(' " + engineers_chosen + " ')";

      engineers_chosen.forEach((engineer) => {
        this.CleanDataset();
        let engineerMetricsArray = this.metricsSnapshots.filter(
          (metrics) => metrics.engineer_alias === engineer
        );
        this.Generate_Dataset_For_Charts(engineerMetricsArray);

        let temp_dataset_chart_line = {
          ...this.dataset_chart_line,
        };

        let temp_dataset_chart_line_assigned = {
          ...this.dataset_chart_line_assigned,
        };

        let temp_dataset_percent_chart_line = {
          ...this.dataset_percent_chart_line,
        };

        let DataSet_item = {
          name: engineer.toUpperCase(),
          dataset: temp_dataset_chart_line,
          dataset_assigned: temp_dataset_chart_line_assigned,
          dataset_percent: temp_dataset_percent_chart_line,
        };

        this.Engineers_Dataset.push(DataSet_item);
      });

      this.showFilter = false;
      this.filterApplied = true;
    },

    CleanDataset() {
      this.dataset_chart_line = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };

      this.dataset_chart_line_assigned = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };

      this.dataset_percent_chart_line = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };
    },

    async Generate_Engineers(manager_alias) {
      this.engineers = [];
      let engineers = await this.getteammembers(manager_alias);//JSON.parse(GetSettingFromSessionStorage(manager_alias));
      engineers.forEach((engineer) => {
        let temp = {
          engineer_name: engineer,
          backlog: "*",
        };

        this.engineers.push(temp);
      });
    },

     async getteammembers(manager_alias) {
      return await WebAPI_Helper(
        "get",
        "teammembers(" + manager_alias + ")",
        null
      );
    },

    showChartofMonth() {
      this.lineChartMode = "monthmode";

      SaveSettingToLocalStorage("lineChartMode", "monthmode");

      this.Team_DataSet={};
      this.Team_DateSet_Array=[];

      this.Init_LineChart_For_Team();
    },

    showChartofDate() {
      this.lineChartMode = "datemode";
      SaveSettingToLocalStorage("lineChartMode", "datemode");
      this.Team_DataSet={};
      this.Team_DateSet_Array=[];
      this.Init_LineChart_For_Team();
    },

    async Init_LineChart_For_Team() {
      let today = new Date();
      let month = new Date().getMonth() + 1;
      let currentdate = today.getDate();
      let yearmonthdate_string = today.getFullYear();
      yearmonthdate_string +=
        month.toString().length === 1
          ? "0" + month.toString()
          : month.toString();
      yearmonthdate_string +=
        currentdate.toString().length === 1
          ? "0" + currentdate.toString()
          : currentdate.toString(); //  new Date().toISOString().slice(0, 10).replaceAll('-','');

      this.yearmonthdate = parseInt(yearmonthdate_string.slice(0, 8));
      this.yearmonth = parseInt(yearmonthdate_string.slice(0, 6));

      let teammanagers_alias=[];
      if(this.userrole <=2) // the engineer filter will be enabled for M1 manager or below.
      {
      const whoami = GetSettingFromSessionStorage("whoami") !== null?GetSettingFromSessionStorage("whoami") : await WebAPI_Helper("get","whoami",null);
      SaveSettingToSessionStorage("whoami",whoami);

      let manager_alias = await this.reportingm1manager(whoami);
          // generate engineers list for filter modal
      this.Generate_Engineers(manager_alias);  
      teammanagers_alias.push(manager_alias);     
      }
      else { // M1 manager or above.

      // retrieve manager alias array
        let teammanagers_alias_str =  GetSettingFromSessionStorage("teammanagers_alias");
      if (teammanagers_alias_str === null) {
        const setting = await WebAPI_Helper("get","getsetting",null);
        SaveSettingToSessionStorage(
          "teammanagers_alias",
          setting.teammanagers_alias
        );
         teammanagers_alias =  setting.teammanagers_alias.split(",");    
        }  

        else  teammanagers_alias =  teammanagers_alias_str.split(","); 
        
      }      
     

      for(let i=0;i<teammanagers_alias.length;i++){
        
      //create dataset for current team stars.

        let manager_alias = teammanagers_alias[i];

          if (this.lineChartMode === "datemode") {
        this.title = "Case Distribution and Assignment By Date";

        this.maxValue_team_linechart_assigned = 30;
        this.stepValue_team_linechart_assigned = 3;
        this.maxValue_engineer_linechart_assigned = 4;
        (this.stepValue_engineer_linechart_assigned = 1),
          (this.metricsSnapshots = await this.RetrieveSnapshots(manager_alias,
            this.yearmonthdate
          ));
      } else {
        this.title = "Case Distribution and Assignment By Month";

        this.maxValue_team_linechart_assigned = 450;
        this.stepValue_team_linechart_assigned = 40;

        this.maxValue_engineer_linechart_assigned = 40;
        this.stepValue_engineer_linechart_assigned = 4;
        this.metricsSnapshots = await this.RetrieveSnapshotsGroupbyMonth(manager_alias,
          this.yearmonth
        );
      }

      //generate team dataset
      this.Generate_Dataset_For_Charts(this.metricsSnapshots);

      let team_dataset_chart_line = {
        ...this.dataset_chart_line,
      };

      let team_dataset_chart_line_assigned = {
        ...this.dataset_chart_line_assigned,
      };

      let team_dataset_percent_chart_line = {
        ...this.dataset_percent_chart_line,
      };

    let isDataContained = this.dataset_chart_line.datasets[0].data.filter( data => data!==0).length >0;

      this.Team_DataSet = {
        name:Get_Team_DisplayName(manager_alias)+ "'s TEAM",
        isDataContained: isDataContained,
        dataset: team_dataset_chart_line,
        dataset_assigned: team_dataset_chart_line_assigned,
        dataset_percent: team_dataset_percent_chart_line,
        maxValue: Math.ceil(Math.max(...this.dataset_chart_line.datasets[5].data) / 100) *100,
        maxValue_asigned: Math.ceil(Math.max(...team_dataset_chart_line_assigned.datasets[0].data) / 10) *10 >=30? Math.ceil(Math.max(...team_dataset_chart_line_assigned.datasets[0].data) / 10) *10 :20,
     
      };

      this.Team_DateSet_Array.push(this.Team_DataSet);

      //create dataset for current team ends

      }    

      const engineers_chosen_forchart = JSON.parse(
        GetSettingFromLocalStorage("engineers_chosen_forchart")
      );

      if (engineers_chosen_forchart !== null) {
        this.filterApplied = true;
        this.ApplyFilter(engineers_chosen_forchart);
      }

      // loaded
      this.loaded = true;
    },

    getDaysInMonth(year, month) {
          return new Date(year, month, 0).getDate();
    },

    Generate_Dataset_For_Charts(metricsSnapshots) {
      //Initial the labels of date like 1,2,3,,,,31.

      let labels_xAxis = [];

      if (this.lineChartMode == "datemode") {
        // date mode
        let date = parseInt(this.yearmonthdate.toString().slice(6, 8));
        let today = new Date();
        if (date == 30 || date == 31) {
          for (let i = 1; i <= date; i++) {
            let thatDay = new Date(
              today.getFullYear().toString() +
                "-" +
                (today.getMonth() + 1).toString() +
                "-" +
                i.toString()
            );
            if (thatDay.getDay() === 6 || thatDay.getDay() === 0) continue; //weekend, do not add to X axis;
            labels_xAxis.push(i);
          }
        } else {
          let daysinMonth = this.getDaysInMonth(today.getFullYear().toString(),today.getMonth().toString())
          for (let i = date + 1; i <= daysinMonth; i++) {
            let thatDay_string =
              today.getFullYear().toString() +
              "-" +
              today.getMonth().toString() +
              "-" +
              i.toString();

            let thatDay = new Date(thatDay_string);

            if (thatDay.getDay() === 6 || thatDay.getDay() === 0) continue; //weekend, do not add to X axis;

            labels_xAxis.push(i);
          }

          for (let i = 1; i <= date; i++) {
            let thatDay_string =
              today.getFullYear().toString() +
              "-" +
              (today.getMonth() + 1).toString() +
              "-" +
              i.toString();

            let thatDay = new Date(thatDay_string);

            if (thatDay.getDay() === 6 || thatDay.getDay() === 0) continue; //weekend, do not add to X axis;

            labels_xAxis.push(i);
          }
        }
      } else {
        // monthly mode

        let month = parseInt(this.yearmonthdate.toString().slice(4, 6));
        let year = parseInt(this.yearmonthdate.toString().slice(0, 4));
        if (month >= 12) {
          // generate labels of month if month >=6
          for (let i = month - 11; i <= month; i++) {
            let month = "";
            let yearmonth = "";
            if (i.toString().length == 1) month = "0" + i.toString();
            else month = i.toString();

            yearmonth = year.toString() + month;
            labels_xAxis.push(yearmonth);
          }
        } else if (month <= 11) {
          // generate labels of month if month <=5
          for (let i = 11 - month; i >= 0; i--) {
            let month = "";
            if((12 - i).toString().length === 1) {
              month = "0" + (12 - i).toString();
            } else month = (12 - i).toString();

            let yearmonth = (year - 1).toString() + month;
            labels_xAxis.push(yearmonth);
          }

          for (let i = 1; i <= month; i++) {
            let month = "0" + i.toString();
            let yearmonth = year.toString() + month;
            labels_xAxis.push(yearmonth);
          }
        }
      }

      //Initial labels and background  for line chart
      let data_item_15Days = {
        label: "< 15 DAYS",
        borderColor: "#01579b",
        backgroundColor: "#01579b",
        data: new Array(labels_xAxis.length).fill(0),
      };

      let data_item_15Days_percent = {
        label: "%(< 15 DAYS)",
        borderColor: "#01579b",
        backgroundColor: "#01579b",

        data: new Array(labels_xAxis.length).fill(0),
      };

      let data_item_1530 = {
        label: "15-30",
        borderColor: "#311b92",
        backgroundColor: "#311b92",

        data: new Array(labels_xAxis.length).fill(0),
      };

      let data_item_1530_percent = {
        label: "%(15-30)",
        borderColor: "#311b92",
        backgroundColor: "#311b92",

        data: new Array(labels_xAxis.length).fill(0),
      };

      let data_item_3045 = {
        label: "31-45",
        borderColor: "#e27743",
        backgroundColor: "#e27743",

        data: new Array(labels_xAxis.length).fill(0),
      };

      let data_item_3045_percent = {
        label: "%(31-45)",
        borderColor: "#e27743",
        backgroundColor: "#e27743",

        data: new Array(labels_xAxis.length).fill(0),
      };

      let data_item_4560 = {
        label: "46-60",
        borderColor: "#880e4f",
        backgroundColor: "#880e4f",

        data: new Array(labels_xAxis.length).fill(0),
      };

      let data_item_4560_percent = {
        label: "%(46-60)",
        borderColor: "#880e4f",
        backgroundColor: "#880e4f",

        data: new Array(labels_xAxis.length).fill(0),
      };

      let data_item_60 = {
        label: ">= 60 DAYS",
        borderColor: "#b71c1c",
        backgroundColor: "#b71c1c",

        data: new Array(labels_xAxis.length).fill(0),
      };

      let data_item_60_percent = {
        label: "%(>= 60 DAYS)",
        borderColor: "#b71c1c",
        backgroundColor: "#b71c1c",

        data: new Array(labels_xAxis.length).fill(0),
      };

      let data_item_backlog = {
        label: "BACKLOG",
        borderColor: "green",
        backgroundColor: "green",

        data: new Array(labels_xAxis.length).fill(0),
      };

      let data_item_caseassignment = {
        label: "ASSIGNMENT",
        borderColor: "#e243bb",
        backgroundColor: "#e243bb",
        data: new Array(labels_xAxis.length).fill(0),
      };

      //end

      //Generate datasets from list now.

      for (let i = 0; i < metricsSnapshots.length; i++) {
        let snapshot = metricsSnapshots[i];

        //get the date;
        let date = snapshot.date;

        let index_date = labels_xAxis.findIndex((label) => label == date);

        data_item_15Days.data[index_date] += snapshot.lessthan15days;
        data_item_1530.data[index_date] += snapshot.between1530days;
        data_item_3045.data[index_date] += snapshot.between3045days;
        data_item_4560.data[index_date] += snapshot.between4560days;

        data_item_60.data[index_date] += snapshot.over60days;

        data_item_backlog.data[index_date] += snapshot.backlog;

        //let assigned = snapshot.assigned !== undefined ? snapshot.assigned : 0;
        data_item_caseassignment.data[index_date] += snapshot.assigned; // assigned;
      }
      // loop end

      //generate the date of percentage
      labels_xAxis.forEach((temp_date, index_date) => {
        let total = data_item_backlog.data[index_date];

        data_item_15Days_percent.data[index_date] =
          total !== 0
            ? ((100 * data_item_15Days.data[index_date]) / total).toFixed(2)
            : 0;
        data_item_1530_percent.data[index_date] =
          total !== 0
            ? ((100 * data_item_1530.data[index_date]) / total).toFixed(2)
            : 0;
        data_item_3045_percent.data[index_date] =
          total !== 0
            ? ((100 * data_item_3045.data[index_date]) / total).toFixed(2)
            : 0;
        data_item_4560_percent.data[index_date] =
          total !== 0
            ? ((100 * data_item_4560.data[index_date]) / total).toFixed(2)
            : 0;
        data_item_60_percent.data[index_date] =
          total !== 0
            ? ((100 * data_item_60.data[index_date]) / total).toFixed(2)
            : 0;
      });

      // insert the data_item int bubble dataset dic

      let dataset_chart_line = [
        data_item_15Days,
        data_item_1530,
        data_item_3045,
        data_item_4560,
        data_item_60,
        data_item_backlog,
        // data_item_caseassignment,
      ];

      let dataset_chart_line_assigned = [data_item_caseassignment];

      let dataset_percent_chart_line = [
        data_item_15Days_percent,
        data_item_1530_percent,
        data_item_3045_percent,
        data_item_4560_percent,
        data_item_60_percent,
      ];

      this.dataset_chart_line.datasets = dataset_chart_line;
      this.dataset_chart_line.labels = labels_xAxis;

      this.dataset_chart_line_assigned.datasets = dataset_chart_line_assigned;
      this.dataset_chart_line_assigned.labels = labels_xAxis;

      this.dataset_percent_chart_line.datasets = dataset_percent_chart_line;
      this.dataset_percent_chart_line.labels = labels_xAxis;
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

.filter_applied {
  background-color: orange;
}

.filter_canceled {
  background-color: #333;
}
</style>