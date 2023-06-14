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

   <LoadingModal
        :showLoading="showLoading"      
        :message="messageforloading"       
      >
    </LoadingModal>

    <PODFilterModal
        :pods="Pods"
        :showDialog="showPodFilter"
        :PodsFilterModalTitle="PodsFilterModalTitle"
        :refreshTimeStamp="refreshTimeStamp"
        :parameterForSelectedPods="'podsSelectedForAssignment'"
        @ApplyPodFilter="Apply_PodFilter"
        @Cancel_PodFilter="Cancel_PodFilter"
        @ClosePodFilterModal="showPodFilter = false"
      ></PODFilterModal>

    <TeamFilterModal_MultipleChoose
        :teams="teams"
        :showTeamDialog="showTeamsModal"
        :parameterForSelectedTeam="'selected_teams'"
        @ApplyTeamFilter="Apply_Team_Filter"
        @CancelTeamFilter="Cancel_Team_Fitler_Modal"
        @CloseTeamFilterModal="Close_Team_Fitler_Modal"
    >

    </TeamFilterModal_MultipleChoose>

    <div v-show="loaded === true">
      <RefreshConfirmationModal
        :showDialog="showDialog"
        @Refresh_Confirmed="RefreshConfirmed"
        @Refresh_Canceled="RefreshCanceled"
        greetingMessage="Are you sure to refresh the cache to get the live data which could take seconds ?"
      ></RefreshConfirmationModal>

   

      <ul>
        <li style="float: left">
          <a> Case Assignment </a>
        </li>       

          <li style="float: left">
          <a>{{ title }}</a>
        </li>

        <li style="float: right;margin-right: 30px" @click="CleanCache">
          <a>
            <i
              class="fas fa-sync-alt"
              title="Clean server-side cache and re-fetch live data"
            ></i>
            &nbsp;{{ latestFreshTime }} UTC
          </a>
        </li>

        <li
          style="float: right;"
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
   
        <li 
      style="float: right"
      v-bind:class="{
        filter_applied: isTeamFilterApplied === 'true' || isTeamFilterApplied===true,
        filter_canceled:
        isTeamFilterApplied === 'false' ||isTeamFilterApplied === false|| isTeamFilterApplied === undefined,
      }"
      @click="displayTeamsModal"
    >
      <a>        
        <i class="fas fa-sitemap" title="Choose Teams to filter"></i>
      </a>
    </li>

        <li        
         style="float: right"
         v-bind:class="{
          filter_applied: assignmentFilterByPod === 'true' || assignmentFilterByPod===true,
          filter_canceled:
          assignmentFilterByPod === 'false' ||  assignmentFilterByPod === false ||assignmentFilterByPod === undefined,
        }"
        @click="ShowPodFilter"
      >
        <a><i class="fas fa-cubes" title="Filter By PODs"></i> </a>
      </li>
          
          <li   v-show="assignmentFilterByPod"  
          style="float: right"
        class=cahrtfilter_applied
          @click="Cancel_PodFilter"    
        >
          <a>[{{Filters_Description}}]    <i class="fas fa-eraser"></i></a>
        </li>  

      </ul>





      <div style="background-color:black" v-show="loaded === true && ErrorRaised !== true">
          <div class="clr"></div>          
          <div
            style="
              display: inline-block;
              margin: 5px;
              float: right;
              padding-top: 5px;
            "
          >
            <label style="top: 5px;margin-right:30px" 
            :class="{
        switch_black: appstylemode === 'DEFAULT',
        switch_white: appstylemode === 'DARK',
      }"
              >Task Assignment Excluded</label
            >
          </div>

          <div
            style="
              display: inline-block;
              margin: 5px;
              float: right;
              padding-left: 30px;
            "
          >
            <label class="switch">
              <input
                type="checkbox"
                v-model="taskexcluded"
                :value="true"
                name="taskexcluded"
                @click="Toggle_Exclude_Task"
              />
              <span class="slider round"></span>
            </label>
          </div>

          </div>

       <div style="clear: both"></div>

      <div v-for="(data, index) in analyzed_ds_teams" :key="data.team_displayname">

        <div v-if="data.totalAssignment_count !== 0 || assignmentFilterByPod === false">
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
          {{ data.team_displayname }}
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
              <i class="fas fa-bone"></i> ASSIGN {{mode_description}}
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

<!-- net assign -->
          <div
            id="display3045"
            style="float: left"
            :class="{
              'displayboard display3045': appstylemode === 'DEFAULT',
              'displayboard dark': appstylemode === 'DARK',
            }"
            v-show="data.numberofChatAssignments !== 0"
          >
            <p
              :class="{
                'title title_default': appstylemode === 'DEFAULT',
                'title title_dark': appstylemode === 'DARK',
              }"
            >
            <i class="fas fa-headset"></i> NET ASSIGN
            </p>


            <p class="boardcontent">
              {{ data.assignments.length - data.numberofChatAssignments }}
            </p>
            <p class="boardcontent_sub">
              &nbsp;&nbsp;RATIO:{{
                (100*(data.assignments.length - data.numberofChatAssignments)/data.assignments.length).toFixed(2)
              }}%
            </p>

            <!-- <p class="boardcontent">{{ data.chat2web_ratio }} %</p> -->
            <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
          </div>
<!-- net assign end -->

          <div
            id="display4560"
            style="float: left"
            :class="{
              'displayboard display4560': appstylemode === 'DEFAULT',
              'displayboard dark': appstylemode === 'DARK',
            }"
            v-show="data.numberofChatAssignments !== 0"
          >
            <p
              :class="{
                'title title_default': appstylemode === 'DEFAULT',
                'title title_dark': appstylemode === 'DARK',
              }"
            >
            <i class="fas fa-coffee"></i>  Resolved in Chat
            </p>


            <p class="boardcontent">
              {{ data.numberofResolvedInChat }}/{{data.numberofChatAssignments }}
            </p>
            <p class="boardcontent_sub">
              &nbsp;&nbsp;RATIO:{{
                data.ResolvedInChat_ratio
              }}%
            </p>

            <!-- <p class="boardcontent">{{ data.chat2web_ratio }} %</p> -->
            <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
          </div>
        

          <div style="clear: both"></div>
         </div>
        </div>

        <!-- end -->
        <div v-show="data.totalAssignment_count != 0">
          <ChartStackedBarByEngineer
            :chartData="data.DSBarAssignment"
            :height="125"
            @click=" ToggleShowDetails(data)"
          ></ChartStackedBarByEngineer>
          <ChartPieByPod
            :chartData="data.DSPiePod"
            :height="70.99"
            @E_FilterServiceTicketsFromChart = "FilterRecordsFromChart"
          ></ChartPieByPod>        

          <ChartPieByRegion
            :chartData="data.DSPieRegion"
            :height="70.99"
            @E_FilterServiceTicketsFromChart = "FilterRecordsFromChart"
          ></ChartPieByRegion>
          <ChartPieByProgramType
            :chartData="data.DSPieProgramType"
            :height="70.99"
            @E_FilterServiceTicketsFromChart = "FilterRecordsFromChart"
          ></ChartPieByProgramType>
          <ChartPieByCaseType
            :chartData="data.DSPieCaseType"
            :height="70.99"
            @E_FilterServiceTicketsFromChart = "FilterRecordsFromChart"
          ></ChartPieByCaseType>
          <!-- <ChartPieByBandwidth
            :chartData="data.DSPieBandwidth"
            :height="70.99"
          ></ChartPieByBandwidth> -->
          <ChartPieByServiceLevel
            :chartData="data.DSPieAssignmentMethod"
            :height="70.99"
            @E_FilterServiceTicketsFromChart = "FilterRecordsFromChart"
          ></ChartPieByServiceLevel>       
    
          
        </div>
        <div style="float:left">   
         <Assignments v-show="data.showdetails=== true"
          :assignments="data.assignments"
          :numberofChatAssignments="data.numberofChatAssignments"
          :appstylemode="appstylemode"
           :hovered="hovered"
           @MouseOver="Mouse_Over"
           @MouseLeave="Mouse_Leave"
          >           
          </Assignments>  
         </div>
    
        <div style="clear: both"></div>
        <!-- <div style="margin:20px;display:block"> &nbsp; </div> -->
      </div>
    </div>
  </div>
  <Footer :appstylemode="appstylemode" v-if="loaded === true"/>
</template>

<script>
import {
  WebAPI_Helper,
  SaveSettingToSessionStorage,
  GetSettingFromSessionStorage,
  GetSettingFromLocalStorage,
  ClearSettingFromLocalStorage,
   SaveSettingToLocalStorage,
   GetAppStyleMode,
  Shuffle,
  Init_TeamDisplayNames,
} from "../common.js";

import ChartPieByPod from "./ChartPieByPod.vue";
import ChartPieByRegion from "./ChartPieByRegion.vue";
//import ChartPieByBandwidth from "./ChartPieByBandwidth.vue";
import ChartStackedBarByEngineer from "./ChartStackedBarByEngineer";
import ChartPieByServiceLevel from "./ChartPieByServiceLevel";
import ChartPieByProgramType from "./ChartPieByProgramType";
import ChartPieByCaseType from "./ChartPieByCaseType";

import Assignments from "./Assignments.vue"

import RefreshConfirmationModal from "./RefreshConfirmationModal";
import PODFilterModal from "./PODFilterModal";
import LoadingCircle from "./LoadingCircle.vue";

import Footer from "../components/layout/Footer";
//site nav
import SiteNav from "../components/SiteNav";

import LoadingModal from "./LoadingModal";

import TeamFilterModal_MultipleChoose from "./TeamFilterModal_MultipleChoose"

export default {
  name: "GroupAssignment",

  components: {
    ChartPieByPod,
    ChartPieByRegion,
    //ChartPieByBandwidth,
    ChartStackedBarByEngineer,
    ChartPieByServiceLevel,
    ChartPieByProgramType,
    ChartPieByCaseType,
    Assignments,

    SiteNav,
    RefreshConfirmationModal,
    LoadingModal,
    PODFilterModal,
    LoadingCircle,
    TeamFilterModal_MultipleChoose,
 
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

      Filters_Description:'',

      hovered: false,

      taskexcluded: false,// exlude tasks.

      //chart filter description displayed in NAV:
      Filters_Array: [],

      isTeamFilterApplied : false,

      refreshtimeInterval: 0,
      userRole:1,
      days_elapsed:0,

      //dataset after analysis
      analyzed_ds_teams: [],

      //An array to store showdetails flag.
      array_details_enabled_teams:[],

       messageforloading:"",
       showLoading: false,

      //to store the assignmen count after cleanup
      assignment_number_after_cleanup: 0,

      //generated background colors for regions
      genereated_backgourndcolors_for_regions:{},

      //generated background colors for PODs
      genereated_backgourndcolors_for_pods:{},

      //Pods
      Pods: [],

      //Teams:
      teams:[],


      // Entire Assignment:
      backup_entire_assignment :[],

      //All Pods      

      showPodFilter: false,

      assignmentFilterByPod : false,
 
      numberofChatAssignments : 0,
      numberofResolvedInChat:0,
      ResolvedInChat_ratio : 0,

      showTeamsModal: false,

      refreshTimeStamp:0,
    
      //backgorund color buffers
      backgroundColor_buffer : [
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
        "#df682e",
        "#126da2",
        "#361909",
        "#516f57",
        "#E80CAA",
        "#8500FF",
        "#00AEF4",
        "#F0CF3C",
        "#D4942F",
        "#155CD4",
        "#B3D408",
        "#84E5F5"
      ],


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

      //dataset for piechar by program type
      dataset_chart_pie_by_programtype: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

       //dataset for piechar by case type
       dataset_chart_pie_by_casetype: {
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
    this.assignmentFilterByPod = false;

    this.Filters_Description = GetSettingFromLocalStorage("Filters_Description");
    this.Filters_Array =[];
    if(this.Filters_Description !==null)
      this.Filters_Array = [...this.Filters_Array,this.Filters_Description];

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

    Toggle_Exclude_Task() {
        if(this.taskexcluded === true) {
           this.taskexcluded = false;
            SaveSettingToLocalStorage("taskexcluded","false");
        } else {
          this.taskexcluded = true;
            SaveSettingToLocalStorage("taskexcluded","true");
        }

        this.Init();
    },

    ToggleShowDetails(data){
      if(data.showdetails === true) {// the detaisl was showned before, then we need to remove it from enabled array
       let index_to_remove =  this.array_details_enabled_teams.indexOf(data.manager)
        this.array_details_enabled_teams = this.array_details_enabled_teams.filter((item, index) =>index !== index_to_remove)
      }
      else if(data.showdetails === false) { // first time to enable, we need to add it into enabled list
        this.array_details_enabled_teams.push(data.manager);

      }
      //reverse the flag;
      data.showdetails = !data.showdetails;

    },

    Apply_Team_Filter(teams_chosen){
      SaveSettingToLocalStorage("selected_teams",teams_chosen);
      this.showTeamsModal = false;
      this.isTeamFilterApplied = true;
      this.Init();
    },
 
    Close_Team_Fitler_Modal(){
      this.showTeamsModal = false;
    },

    Cancel_Team_Fitler_Modal(){     
      ClearSettingFromLocalStorage("selected_teams");
      this.showTeamsModal = false;
      this.isTeamFilterApplied = false;
      this.Init();
    },


    displayTeamsModal(){
     this.showTeamsModal = true;
    },
    
    Mouse_Over() {
      this.hovered = true;
      this.appstylemode = GetAppStyleMode();
    },

    Mouse_Leave() {
      this.hovered = false;
      this.appstylemode = GetAppStyleMode();
    },


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

    ShowPodFilter(){
      this.showPodFilter = true;
    },

    Apply_PodFilter(params){

      this.showPodFilter = false;
      let pods_filter = "PODS In (' "+ params.data_chosen +" ')";
      this.Filters_Description = pods_filter;
      this.Filters_Array =[]; // remove all existing filter
      this.Filters_Array = [...this.Filters_Array, pods_filter];
      SaveSettingToLocalStorage("Filters_Description",this.Filters_Description)
      SaveSettingToLocalStorage("podsSelectedForAssignment", JSON.stringify(params.data_chosen))
      SaveSettingToLocalStorage("assignmentFilterByPod",true);
      this.Init();
    },

    Cancel_PodFilter(){
      this.showPodFilter = false;
      this.assignmentFilterByPod = false;
      this.podsSelectedForAssignment="";
      this.Filters_Description ="";
      this.Filters_Array = [];
      this.refreshTimeStamp = Date.now();
      ClearSettingFromLocalStorage("Filters_Description");
      ClearSettingFromLocalStorage("assignmentFilterByPod");
      ClearSettingFromLocalStorage("podsSelectedForAssignment");
      this.Init();
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

    /// Chart Filter Hanlder
    async FilterRecordsFromChart(parameter, value) {
      
      this.analyzed_ds_teams=[];   //initialization
      let filter;
      
      
      this.assignment_teams.forEach(team =>{

        let engineers = GetSettingFromSessionStorage(team.manager).split(",");

        switch (parameter) 
       {
        case "CHANNEL":
         filter = "Channel eq '" + value + "'";
         team.assignments = team.assignments.filter(item => item.casetype.startsWith(value));
         break;

        case "POD":
          filter = "POD like '" + value + "'";
          team.assignments = team.assignments.filter(item => item.support_pod.startsWith(value));
          break;
        case "REGION":
          filter = "Region eq '" + value + "'";         
          team.assignments = team.assignments.filter(item => item.sr_regioncode.startsWith(value));
          break;

        case "SERVICELEVEL":
          filter = "ServiceLevel eq '" + value + "'";
          team.assignments = team.assignments.filter(item => item.servicelevel.startsWith(value));
          break;

        case "PROGRAMTYPE":
          filter = "ProgramType eq '" + value + "'";
          team.assignments = team.assignments.filter(item => item.programType.startsWith(value));
          break;
      }

      this.Generate_Dataset_For_Charts(
          team.assignments,
          team.manager,          
          engineers
        );
        team.assignments.sort((a,b)=> a.casetype.localeCompare(b.casetype))

        let data_point = {
          manager: team.manager,
          assignments:team.assignments,
          team_displayname: team.team_displayname,
          engineers: engineers.length,
          showdetails:this.array_details_enabled_teams.indexOf(team.manager)!==-1,
          numberofChatAssignments:this.numberofChatAssignments,
          numberofResolvedInChat:this.numberofResolvedInChat,
          ResolvedInChat_ratio : this.ResolvedInChat_ratio,
          DSBarAssignment: this.dataset_chart_bar_assignment,
          DSPieBandwidth: this.dataset_chart_pie_by_bandwidth,
          DSPiePod: this.dataset_chart_pie_by_pod,
          DSPieRegion: this.dataset_chart_pie_by_region,
          DSPieAssignmentMethod: this.dataset_chart_pie_by_assignmentmethod,
          DSPieProgramType: this.dataset_chart_pie_by_programtype,
          DSPieCaseType: this.dataset_chart_pie_by_casetype,
          totalAssignment_count: this.assignment_number_after_cleanup,
        };
        this.analyzed_ds_teams = [...this.analyzed_ds_teams, data_point];
        //clean the component data before next round of loop
        this.Clean_Dataset_ForAllCharts();
      })

          
      //avoid insert duplicated condition.
      if (this.Filters_Array.indexOf(filter) == -1)
        this.Filters_Array.push(filter);

      this.Filters_Description = this.Filters_Array.join(" & ");
      this.assignmentFilterByPod = true;
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

      this.messageforloading= "Loading data in progress. Please feel free to enjoy your coffee now  <i class='fas fa-mug-hot'></i> ...";
      let loadingMessageInterval= setInterval(this.setTickWhenLoading,1000)


      this.siteNivBar_expanded =
        GetSettingFromLocalStorage("siteNivBar_expanded") !== null
          ? GetSettingFromLocalStorage("siteNivBar_expanded")
          : "false";

        this.appstylemode =GetAppStyleMode();

        Init_TeamDisplayNames();

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
      
      this.teams = teammanagers_alias; 

      //if teams filter was there, we apply the filter.
      if(GetSettingFromLocalStorage("selected_teams")!==null) {
        teammanagers_alias = GetSettingFromLocalStorage("selected_teams").split(",");
        this.isTeamFilterApplied = true;
      }      
      
      this.userRole = await WebAPI_Helper("get", "currentuserrole", null);

      //initial backlog for each team before we are going to analyze the data;
       this.assignment_teams = [];
       this.Pods=[];
      for (let i = 0; i < teammanagers_alias.length; i++) {
        if (teammanagers_alias[i] === "" || teammanagers_alias[i] === null)
          continue;
        
      
      //retrieve bandwidth from each team;
      let  Bandwidth_Per_Day =1.2;
      let  engineerMode_Enabled = GetSettingFromSessionStorage("EngineerModeEnabled"+"_Of_Team_"+teammanagers_alias[i]) === "false" ||
                                  GetSettingFromSessionStorage("EngineerModeEnabled"+"_Of_Team_"+teammanagers_alias[i])=== undefined?
                                  "false":GetSettingFromSessionStorage("EngineerModeEnabled"+"_Of_Team_"+teammanagers_alias[i]);
      
      
      if(GetSettingFromSessionStorage("Bandwidth_Per_Day"+"_Of_Team_"+teammanagers_alias[i].toLowerCase()) == null){
     
        let teamprofile = await WebAPI_Helper(
          "get",
          "teamprofile/manager/" + teammanagers_alias[i],
          ""
        );

        if(teamprofile === null || teamprofile === undefined)
        continue;
      
        Bandwidth_Per_Day =teamprofile.Bandwidth_Per_Day == undefined|| teamprofile.Bandwidth_Per_Day == null  ? 1.2: teamprofile.Bandwidth_Per_Day;
        engineerMode_Enabled = teamprofile.Enable_Engineer_Mode == undefined|| teamprofile.Enable_Engineer_Mode == null  ? "false": teamprofile.Enable_Engineer_Mode;

        SaveSettingToSessionStorage("Bandwidth_Per_Day"+"_Of_Team_"+teammanagers_alias[i],Bandwidth_Per_Day)
        SaveSettingToSessionStorage("EngineerModeEnabled"+"_Of_Team_"+teammanagers_alias[i],engineerMode_Enabled)
        // if(engineerMode_Enabled === "true") {
        //   SaveSettingToLocalStorage("Displayname"+"_Of_Team_"+teammanagers_alias[i],teamprofile.team_displayname);
        // }
       
      }    

        let data = await this.AssignmentByManager(teammanagers_alias[i], this.retrieveMode);

       const taskexcluded = GetSettingFromLocalStorage("taskexcluded"); 
       this.taskexcluded = taskexcluded !== null? taskexcluded ==='true'||taskexcluded ===true : false;
        //tasks excluded.
        if(this.taskexcluded === true) {
          data = data.filter (assignment => assignment.sr_number.length === 16)
        }

        let team_assignments= {"team":teammanagers_alias[i],"assignments":data};
        this.backup_entire_assignment.push(team_assignments);
        //clean pods.
        
        this.Generate_Pods(data);
        SaveSettingToSessionStorage("AllPods",this.Pods.map(item => item.pod));
        this.assignmentFilterByPod =  GetSettingFromLocalStorage("assignmentFilterByPod") !== null ? GetSettingFromLocalStorage("assignmentFilterByPod") : false;
        if(this.assignmentFilterByPod === true ||this.assignmentFilterByPod === "true"){
          const podsSelectedForAssignment =JSON.parse(GetSettingFromLocalStorage("podsSelectedForAssignment"));
          data = data.filter((item) => item.support_pod !== null && podsSelectedForAssignment !== null && podsSelectedForAssignment.includes(item.support_pod))
        }       

        let item = {
          manager: teammanagers_alias[i],
          team_displayname : engineerMode_Enabled === "false"?teammanagers_alias[i] : GetSettingFromLocalStorage("Displayname"+"_Of_Team_"+teammanagers_alias[i]),
          assignments: data,
        };
        this.assignment_teams.push(item);
        if (teammanagers_alias[i] !== "" && teammanagers_alias[i] !== null) {
          var team_members = await this.getteammembers(teammanagers_alias[i]);
        }
        SaveSettingToSessionStorage(
          teammanagers_alias[i],
          //JSON.stringify(team_members)
          team_members
        );
      }

      //Analyze the assignment of each team
      this.analyzed_ds_teams=[];     
      this.assignment_teams.forEach((team) => {
        let engineers = GetSettingFromSessionStorage(team.manager).split(",");

        //Generate dataset for team, the generate dataset will be stored tempororily by compononent data.
        this.Generate_Dataset_For_Charts(
          team.assignments,
          team.manager,          
          engineers
        );
        team.assignments.sort((a,b)=> a.casetype.localeCompare(b.casetype))
        let data_point = {
          manager: team.manager,
          assignments:team.assignments,
          team_displayname: team.team_displayname,
          engineers: engineers.length,
          showdetails:this.array_details_enabled_teams.indexOf(team.manager)!==-1,
          numberofChatAssignments:this.numberofChatAssignments,
          numberofResolvedInChat:this.numberofResolvedInChat,
          ResolvedInChat_ratio : this.ResolvedInChat_ratio,
          DSBarAssignment: this.dataset_chart_bar_assignment,
          DSPieBandwidth: this.dataset_chart_pie_by_bandwidth,
          DSPiePod: this.dataset_chart_pie_by_pod,
          DSPieRegion: this.dataset_chart_pie_by_region,
          DSPieAssignmentMethod: this.dataset_chart_pie_by_assignmentmethod,
          DSPieProgramType: this.dataset_chart_pie_by_programtype,
          DSPieCaseType: this.dataset_chart_pie_by_casetype,
          totalAssignment_count: this.assignment_number_after_cleanup,
        };

        this.analyzed_ds_teams = [...this.analyzed_ds_teams, data_point];

        //clean the component data before next round of loop
        this.Clean_Dataset_ForAllCharts();
      });

      this.showLoading = false; // hide loading modal once done. 
      clearInterval(loadingMessageInterval); //release interval

      return true;
    },

     //Generate Pods for further filter
     Generate_Pods(assignments) {            
     
      assignments.forEach((assignment) => {
        let pod_index = -1;
        let pod_item = {pod:"",number:0};
        pod_item.pod = assignment.support_pod;
       
        if(pod_item.pod === null)  {
            pod_item.pod = "Unknown";                 
        }

        pod_index = this.Pods.findIndex(function checkValue(element) {
          return element.pod === assignment.support_pod;
        })

        if (pod_index === -1) {
          pod_item.number = 1;
          this.Pods.push(pod_item);
        }
        else {
          this.Pods[pod_index].number +=1;
        }
      });
    },

    async getRefreshTime() {
      this.latestFreshTime = await this.GetFreshTime();
    },

    async GetFreshTime() {
      return await WebAPI_Helper("get", "latestfreshtime/cachetype/assignment/teamoruser/na");
    },

    async RefreshConfirmed() {
      this.showDialog = false;
      this.loaded = false;
      await WebAPI_Helper("get", "cleancache/cachetype/assignment/teamoruser/na", null);
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
      teammembers = GetSettingFromSessionStorage(manager_alias).split(",");

     
      if(this.taskexcluded === true) {
        assignments = assignments.filter(assignment =>
          assignment.sr_number.length === 16
        )
      }
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
          if(assignment.sr_number.length === 16){ // for case, we counted it as 1
            count++;
            item_found.assigned_number += 1;
          }
            else {
              item_found.assigned_number += 0.5; // for task, we counted it as 0.5
              count += 0.5;
            }
          

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
  
    //Generate the background color based on POD name
    Generate_backgroundColors_for_Pods(labels_pod) {
      let backgroundColor_pod = [];
      labels_pod.forEach((pod,index) =>{
        // check if the pod color exists or not.
        if(this.genereated_backgourndcolors_for_pods[pod] !== undefined) { //exists already
          backgroundColor_pod[index] =  this.genereated_backgourndcolors_for_pods[pod];
        } else { // didn't exists , then get a random one
         let pod_color = Shuffle(this.backgroundColor_buffer).slice(0,1)[0];
         backgroundColor_pod[index] =  pod_color;

        
         //update this.genereated_backgourndcolors_for_pods[pod]
         this.genereated_backgourndcolors_for_pods[pod]=pod_color;

         //remove current color from buffer to avoid being selected again.
         this.backgroundColor_buffer = this.backgroundColor_buffer.filter(color =>
            color !== pod_color
         )

        }      
      })

      return  backgroundColor_pod;
      
    },

    Generate_backgroundColors_for_Regions(labels_region) {
      let backgroundColor_region = [];
      labels_region.forEach((region,index) =>{
        // check if the pod color exists or not.
        if(this.genereated_backgourndcolors_for_regions[region] !== undefined) { //exists already
          backgroundColor_region[index] =  this.genereated_backgourndcolors_for_regions[region];
        } else { // didn't exists , then get a random one
         let randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
         backgroundColor_region[index] =  randomColor;

        
         //update this.genereated_backgourndcolors_for_regions[pod]
         this.genereated_backgourndcolors_for_regions[region]=randomColor;        

        }      
      })

      return  backgroundColor_region;
      
    }
    ,
   async Generate_Dataset_For_Charts(assignments, manager_alias, engineers) {
     
      // Variables for piechart by pod
      let labels_pod = [];
      let Number_pod = []; // An array to store the number of each pod

       // Variables for piechart by program
       let labels_programtype = ["S500","ACE","None"];
      let Number_programtype = [0,0,0]; // An array to store the number of each program

       // Variables for piechart by case type
      let labels_casetype = ["Web","Chat"];
      let Number_casetype = [0,0]; // An array to store the number of each program


      //Variables for piechart by region
      let labels_region = [];
      let Number_region = []; // An array to store the number of each region

      //Variables for piechart by assignmentmethod
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
      

      let Bandwidth_Per_Day = parseFloat(GetSettingFromSessionStorage("Bandwidth_Per_Day"+"_Of_Team_"+manager_alias));

      if(this.retrieveMode === 1){

      let total_Bandwidth = engineers.length * Bandwidth_Per_Day;
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

        let total_Bandwidth = engineers.length * Bandwidth_Per_Day * this.days_elapsed;
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

      labels_assignmentmethod = ["Premier","Professional"];  // this is a placement for assignment method.
      Number_assignmentmethod = [0,0];
     

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
        let assignmentmethod = assignment.servicelevel !== null ? assignment.servicelevel
            : "Professional";

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
     let backgroundColor_assignmentmothod = ["#2596be","darkgray"];     
     
      //initial background color for programtype
      let backgroundColor_programtype = [];    
      backgroundColor_programtype = ["green","orange","darkgray"];   

      //initial background color for case type
      let backgroundColor_casetype = [];    
      backgroundColor_casetype = ["#7943e2","darkgray"];   
  

      //Initial stacked dataset.
      let backgroundColor_pod = [];
      // backgroundColor_pod = Shuffle(backgroundColor_buffer).slice(
      //   0,
      //   labels_pod.length
      // );

      backgroundColor_pod = this.Generate_backgroundColors_for_Pods(labels_pod);

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

      this.numberofChatAssignments = assignments_cleanedup.filter(item =>item.casetype ==='Chat').length;
      this.numberofResolvedInChat = assignments_cleanedup.filter(item => item.casetype ==='Chat' && item.convertedToWeb === false).length;
      this.ResolvedInChat_ratio = (100* this.numberofResolvedInChat / this.numberofChatAssignments ).toFixed(2);

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

            if(assignment.sr_number.length === 16) 
              dataset_item.data[index_caseowner] += 1;
            else   dataset_item.data[index_caseowner] += 0.5;
        }

        // stacked dataset end

        //Search the labels of pod, and increase the number if matched.
        let item_pod = assignment.support_pod;
        let temp_index = labels_pod.indexOf(item_pod);
        let pod_index =
          temp_index !== -1 ? temp_index : labels_pod.indexOf("Unknown");
        Number_pod[pod_index] += 1; //increase the number of corresponding pod

         //Search the labels of programtype, and increase the number if matched.
         let item_programtype = assignment.programType;        
        let programtype_index = labels_programtype.indexOf(item_programtype);        
        Number_programtype[programtype_index] += 1; //increase the number of corresponding programtype

         //Search the labels of case type, and increase the number if matched.
         let item_casetype = assignment.casetype;        
        let casetype_index = labels_casetype.indexOf(item_casetype);        
        Number_casetype[casetype_index] += 1; //increase the number of corresponding case type

        //Search the labels of region, and increase the number if matched.
        let item_region = assignment.sr_regioncode;
        temp_index = labels_region.indexOf(item_region);
        let region_index =
          temp_index !== -1 ? temp_index : labels_region.indexOf("Unknown");
        Number_region[region_index] += 1; //increase the number of corresponding region

        let item_assignmentmethod = assignment.servicelevel;
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
        return label.length <= 14 ? label : label.slice(0, 8);
      });

      this.dataset_chart_pie_by_pod.labels = labels_pod_shortened;
      //end

      //generate dataset for pie chart by bandwidth    
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
      // backgroundColor_region = Shuffle(backgroundColor_buffer).slice(
      //   0,
      //   labels_region.length
      // );

      backgroundColor_region = this.Generate_backgroundColors_for_Regions(labels_region);

      let dataitem_region = [];
      let datasets_region = [];

      dataitem_region.data = Number_region;
      dataitem_region.backgroundColor = backgroundColor_region;

      datasets_region = [...datasets_region, dataitem_region];
      this.dataset_chart_pie_by_region.datasets = datasets_region;
      this.dataset_chart_pie_by_region.labels = labels_region;
      //end

      //generate dataset for pie chart by assignmethod    
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

      //generate dataset for pie chart by program type    
      let dataitem_programtype = [];
      let datasets_programtype = [];

      dataitem_programtype.data = Number_programtype;
      dataitem_programtype.backgroundColor =
        backgroundColor_programtype;

      datasets_programtype = [
        ...datasets_programtype,
        dataitem_programtype,
      ];
      this.dataset_chart_pie_by_programtype.datasets =
        datasets_programtype;
      this.dataset_chart_pie_by_programtype.labels =
        labels_programtype;

        
      //generate dataset for pie chart by case  type    
      let dataitem_casetype = [];
      let datasets_casetype = [];

      dataitem_casetype.data = Number_casetype;
      dataitem_casetype.backgroundColor =
        backgroundColor_casetype;

      datasets_casetype = [
        ...datasets_casetype,
        dataitem_casetype,
      ];
      this.dataset_chart_pie_by_casetype.datasets =
        datasets_casetype;
      this.dataset_chart_pie_by_casetype.labels =
        labels_casetype;

       // console.log(datasets_programtype)
      //end
    },

    Clean_Dataset_ForAllCharts() {

      this.numberofChatAssignments = this.numberofResolvedInChat =this.ResolvedInChat_ratio = 0;
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

      //dataset for piechar by programtype
       this.dataset_chart_pie_by_programtype = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };

        //dataset for piechar by programtype
        this.dataset_chart_pie_by_casetype = {
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

.display3045 {
  background: #4a148c;
  color: #fff;
}


.display4560 {
  background: #880e4f;
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


/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch_white {
    color:white
}

.switch_black {
    color:black;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 2px;
  bottom: 2px;
  background-color: white;
}

input:checked + .slider {
  background-color: green;
}

input:focus + .slider {
  box-shadow: 0 0 1px green;
}

input:checked + .slider:before {
  -webkit-transform: translateX(22px);
  -ms-transform: translateX(22px);
  transform: translateX(22px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 25px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>