<template>
  <SiteNav
    @ToggleNavBar="ToggleNavBar"
    :siteNivBar_expanded="siteNivBar_expanded"
  ></SiteNav>
  <div
    :class="{
      NavBarCollapsed: siteNivBar_expanded === 'false',
      NavBarExpanded: siteNivBar_expanded === 'true',
    }"
  >
    <div id="loadingcontainer" v-show="loaded !== true">
      <img src="../images/loading.jpg" />
    </div>
    <Nav
      v-show="loaded === true"
      @Show-Filter="ShowFilterModal"
      @Switch-Chart="SwitchChart"
      :filterApplied="filterApplied"
      :isTeamSwitched="isTeamSwitched"
      :chartEnabled="chartEnabled"
      :showAllActions="showAllActions"
      :chartFilter_Enabled="chartFilter_Enabled"
      :chart_Filters_Description="chart_Filters_Description"
      :showIdleCasesOnly="showIdleCasesOnly"
      @ShowPersonalSettingModal="ShowPersonalSettingModal"
      @ShowSettingModal="ShowSettingModal"
      @ShowFeedbackModal="ShowFeedbackModal"
      @ShowTeamProfileModal="ShowTeamProfileModal"
      @CleanCache="ShowRefreshModal"
      @Switch_Theme="SwitchTheme"
      @Switch-ActionCards="SwitchActionCards"
      @Disable-Chart-Filter="DisableChartFilter"
      @Create-Snapshot="CreateSnapshot"
      @Complete-Backup="CompleteBackup"
      @Switch-Team="SwitchTeam"
      @Show-Idle-Cases="ShowIdleCases"
    ></Nav>
    <SettingModal
      :showSettingDialog="showSettingDialog"
      @Close_Setting_Modal="Close_Setting_Modal"
    ></SettingModal>
    <FeedbackModal
      :showFeedbackDialog="showFeedbackDialog"
      @Close_Feedback_Modal="Close_Feedback_Modal"
    >
    </FeedbackModal>
    <TeamProfilesModal
      :showTeamProfileDialog="showTeamProfileDialog"
      @Close_TeamProfile_Modal="Close_TeamProfile_Modal"
    >
    </TeamProfilesModal>
    <PersonalSettingModal
      :showPersonalSettingDialog="showPersonalSettingDialog"
      @Save_Personal_Settings="SavePersonalSettings"
      @Close_Personal_Setting_Modal="Close_Personal_Setting_Modal"
    ></PersonalSettingModal>

    <div style="margin: 0px auto; width: 100%" v-if="showFilter&& userrole >= 2">
        <EngineerFilterModal
          :engineers="backup_engineers"
          :showDialog="showFilter"
          :EngineersFilterModalTitle="EngineersFilterModalTitle"
          ref="filter_button"
          @ApplyFilter="Apply_Filter"
          @Cancel_Filter="Cancel_Filter"
          @CloseEngineerFilterModal="Close_EngineerFitler_Modal"
        ></EngineerFilterModal>
      </div>

      <div
        style="margin: 0px auto; width: 100%"
        v-if="showTeamFilter & (userrole > 2)"
      >
        <TeamFilterModal
          :teams="teams"
          :showTeamDialog="showTeamFilter"
          @ApplyTeamFilter="Apply_Team_Filter"
          @CancelTeamFilter="Close_Team_Fitler_Modal"
          @CloseTeamFilterModal="Close_Team_Fitler_Modal"
        ></TeamFilterModal>
      </div>

    <div
      id="middle_container"
      style="margin-left: 0px"
      v-show="servicetickets.length > 0 && loaded === true "
    >    

      <RefreshConfirmationModal
        :showDialog="showDialog_Refresh"
        @Refresh_Confirmed="RefreshConfirmed"
        @Refresh_Canceled="RefreshCanceled"
        greetingMessage="Are you sure to refresh the cache to get the live data which could take seconds ?"
      ></RefreshConfirmationModal>

      <SnapshotConfirmationModal
        :showDialog_Snapshot="showDialog_Snapshot"
        @Snapshot-Confirmed="SnapshotConfirmed"
        @Snapshot_Canceled="SnapshotCanceled"
        :message="messageforsnapshot"
        :processing="processingforsnapshot"
      >
      </SnapshotConfirmationModal>

      <Displayboard
        :summary="summary"
        :appstylemode="appstylemode"
      ></Displayboard>

      <ChartPanel
        :DSBubble="dataset_chart_bubble"
        :DSPie="dataset_chart_pie_by_status"
        :DSPieIcM="dataset_chart_pie_by_icm"
        :DSPiePod="dataset_chart_pie_by_pod"
        :DSPieProgramType="dataset_chart_pie_by_programtype"
        :DSPieRegion="dataset_chart_pie_by_region"
        v-show="chartEnabled === 'true'"
        @DownLoad_Chart="DownloadChart"
        :Downloading="downloading"
        @E_FilterServiceTicketsFromChart="FilterServiceTicketsFromChart"
      ></ChartPanel>

      <div style="float: auto"></div>
      <ActionCards
        :actions="actions"
        :showAllActions="showAllActions"
        @assign-mce-task="assignMceTask"
      ></ActionCards>

      <div style="float: auto"></div>

      <Servicetickets
        :servicetickets="servicetickets_60"
        v-show="servicetickets_60.length !== 0"
        :title="title_60"
        @assign-mce-task="assignMceTask"
        @review-serviceticket="reviewServiceTicket"
        :appstylemode="appstylemode"
        :hovered="hovered"
        @MouseOver="Mouse_Over"
        @MouseLeave="Mouse_Leave"
      />
      <Servicetickets
        :servicetickets="servicetickets_45_60"
        v-show="servicetickets_45_60.length !== 0"
        :title="title_4560"
        @assign-mce-task="assignMceTask"
        @review-serviceticket="reviewServiceTicket"
        :appstylemode="appstylemode"
        :hovered="hovered"
        @MouseOver="Mouse_Over"
        @MouseLeave="Mouse_Leave"
      />
      <Servicetickets
        :servicetickets="servicetickets_30_45"
        v-show="servicetickets_30_45.length !== 0"
        :title="title_3045"
        @assign-mce-task="assignMceTask"
        @review-serviceticket="reviewServiceTicket"
        :appstylemode="appstylemode"
        :hovered="hovered"
        @MouseOver="Mouse_Over"
        @MouseLeave="Mouse_Leave"
      />
      <Servicetickets
        :servicetickets="servicetickets_15_30"
        v-show="servicetickets_15_30.length !== 0"
        :title="title_1530"
        @assign-mce-task="assignMceTask"
        @review-serviceticket="reviewServiceTicket"
        :appstylemode="appstylemode"
        :hovered="hovered"
        @MouseOver="Mouse_Over"
        @MouseLeave="Mouse_Leave"
      />
      <Servicetickets
        :servicetickets="servicetickets_15"
        v-show="servicetickets_15.length !== 0"
        :title="title_15"
        @assign-mce-task="assignMceTask"
        @review-serviceticket="reviewServiceTicket"
        :appstylemode="appstylemode"
        :hovered="hovered"
        @MouseOver="Mouse_Over"
        @MouseLeave="Mouse_Leave"
      />
    </div>
  </div>

  <div
    v-show="ErrorRaised"
    style="display: inline-block; margin: 50px; padding-top: 5px"
  >
    <label
      style="top: 5px"
      :class="{
        switch_black: appstylemode === 'DEFAULT',
        switch_white: appstylemode === 'DARK',
      }"
      >Something wrong happened , or you are not a user of little ant!</label
    >
  </div>
  <Footer :appstylemode="appstylemode" />
  <div id="right" style="background-color: #eee"></div>
  <router-view></router-view>
</template>

<script>
import {
  GetAppStyleMode,
  SetAppStyleMode,
  WebAPI_Helper,
  Days_Diff,
  GetSettingFromLocalStorage,
  SaveSettingToLocalStorage,
  GetSettingFromSessionStorage,
  SaveSettingToSessionStorage,
  Sleep,
  ClearSettingFromLocalStorage,
} from "../common.js";

import Servicetickets from "../components/ServiceTickets.vue";
import Displayboard from "../components/Displayboard";
import EngineerFilterModal from "../components/EngineerFilterModal";
import Nav from "../components/Nav";
import ActionCards from "../components/ActionCards.vue";
import SettingModal from "../components/SettingModal";
import PersonalSettingModal from "../components/PersonalSettingModal";
import SnapshotConfirmationModal from "../components/SnapshotConfirmationModal";
import RefreshConfirmationModal from "./RefreshConfirmationModal";
import FeedbackModal from "./FeedbackModal";
import TeamFilterModal from "../components/TeamFilterModal";

import Footer from "../components/layout/Footer";
// import SearchCase from '../components/SearchCase'

import ChartPanel from "../components/ChartPanel.vue";
import TeamProfilesModal from "./TeamProfilesModal";

//site nav
import SiteNav from "../components/SiteNav";

export default {
  name: "Dashboard",
  components: {
    Servicetickets,
    Displayboard,
    EngineerFilterModal,
    TeamFilterModal,
    Nav,
    ActionCards,
    ChartPanel,
    SettingModal,
    PersonalSettingModal,
    SnapshotConfirmationModal,
    RefreshConfirmationModal,
    TeamProfilesModal,

    FeedbackModal,
    Footer,
    SiteNav,
  },
  data() {
    return {
      servicetickets_60: [], // curent service tickets list which age is over 60
      backup_servicetickets_60: [], // the backup of service tickets list which age is over 60

      servicetickets_45_60: [], // current service ticket list which age is within 45 and 60
      backup_servicetickets_45_60: [], // the backup fo service ticket list which age is within 45 and 60

      servicetickets_30_45: [], // current service ticket list which age is within 30 and 45 days
      backup_servicetickets_30_45: [], // the backup service ticket list which age is within 30 and 45 days

      servicetickets_15_30: [], // current service ticekt list which age is within 15 and 30 days
      backup_servicetickets_15_30: [], // the backup service ticekt list which age is within 15 and 40 days

      servicetickets_15: [], // current service ticket list which age is less than 15 days
      backup_servicetickets_15: [], // the backup of service tickets which age is less than 15 days.

      trendingissues_count: 0, // trending issues

      servicetickets: [], //current service ticekt list
      backup_servicetickets: [], // the backup of  all service ticket list

      messageforsnapshot:
        "Are you sure to create team operation snapshot of today now ? To create snapshot, we will clean cache and retrieve the live data which could take seconds.",
      processingforsnapshot: false,

      title_60:
        " <i class='fas fa-exclamation-triangle'></i> MORE THAN 60  DAYS",
      title_4560: "<i class='fas fa-ambulance'></i> 46 - 60 DAYS",
      title_3045: "<i class='fas fa-battery-half'></i> 31 - 45 DAYS",
      title_1530: "<i class='fas fa-gas-pump'></i> 15 - 30 DAYS",
      title_15: " <i class='fas fa-seedling'></i> LESS THAN 15 DAYS",

      summary: {},
      engineers: [], // current engineers list
      teams: [], //teams list
      backup_engineers: [], // the backup of engineers list

      loaded: false, //  a bool to see if the data is loaded completely
      showFilter: false, // a bool to determine if filter modal show or hide

      showDialog_Refresh: false,

      filterApplied: false, // a bool to check if enginer filter is applied or not.

      chartEnabled: "false", // enable chart or now.

      issuperuser: false, // a bool to judge is current user is a super user ( more data will be shown and some config settings will be visiable)

      showIdleCasesOnly: "false", // show idle cases only

      //show all action cards
      showAllActions: "false", // a bool to determin if all action card should be displayed.

      //show setting Modal
      showSettingDialog: false,

      showFeedbackDialog: false,

      //swith team status
      isTeamSwitched: false,

      //show team profile Modal
      showTeamProfileDialog: false,

      //show snapshow modal
      showDialog_Snapshot: false,

      // show personal settign modal
      showPersonalSettingDialog: false,

      //show team filter modal
      showTeamFilter: false,

      // download status for chart;
      downloading: "false",
      //current login user
      currentuser: "",

      // Chart Filtered enabled or not
      chartFilter_Enabled: false,

      //bug count:
      bug_count: 0,
      bug_count_percentage: 0.0,

      // Site Nav Bar status:
      siteNivBar_expanded: "true",

      //chart filter description displayed in NAV:
      chart_Filters_Description: "",

      //chart filter description displayed in NAV:
      chart_Filters_Array: [],
      //actions
      actions: [],

      //setting
      setting: "",

      //profile
      teamprofile: "",

      //application theme
      appstylemode: "DEFAULT",

      //Hovered on cases
      hovered: false,

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
    };
  },

  methods: {
    //behaviour when mouse hover and leave on row starts

    Mouse_Over() {
      this.hovered = true;
      this.appstylemode = GetAppStyleMode();
    },

    Mouse_Leave() {
      this.hovered = false;
      this.appstylemode = GetAppStyleMode();
    },
    //behaviour when mouse hover and leave on row ends

    //Display Filter Engineers Modal
    ShowFilterModal() {
      this.showFilter = true;
    },

    SwitchChart() {
      let chartEnabled = window.localStorage.getItem("chartEnabled"); // this.showAllActions);

      if (chartEnabled === "true" || chartEnabled === null) {
        this.chartEnabled = "false";
      } else this.chartEnabled = "true";

      // persist to cache;
      window.localStorage.setItem("chartEnabled", this.chartEnabled);
    },

    SwitchActionCards() {
      let showAllActions = window.localStorage.getItem("showAllActions"); // this.showAllActions);

      if (showAllActions === "true" || showAllActions === null) {
        this.showAllActions = "false";
      } else this.showAllActions = "true";

      // persist to cache;
      window.localStorage.setItem("showAllActions", this.showAllActions);
      this.Generate_Actions(this.servicetickets);
    },

    //Show | show Nav Bar of left panel
    ToggleNavBar(siteNivBar_expanded) {
      this.siteNivBar_expanded = siteNivBar_expanded;
    },

    // Disaply Settings Modal
    ShowSettingModal() {
      this.showSettingDialog = true;
    },

    // Disaply Team Profile  Modal
    ShowTeamProfileModal() {
      this.showTeamProfileDialog = true;
    },

    // Hide settings Modal
    Close_Setting_Modal() {
      this.showSettingDialog = false;
    },

    // Disaply Settings Modal
    ShowFeedbackModal() {
      this.showFeedbackDialog = true;
    },
    // Hide settings Modal
    Close_Feedback_Modal() {
      this.showFeedbackDialog = false;
    },
    // Hide settings Modal
    Close_TeamProfile_Modal() {
      this.showTeamProfileDialog = false;
    },

    // Hide the set
    SaveSettings() {
      this.showSettingDialog = false; //close the setting modal
    },

    // Display personal setting modal
    ShowPersonalSettingModal() {
      this.showPersonalSettingDialog = true;
    },

    // Hide personal setting modal
    Close_Personal_Setting_Modal() {
      this.showPersonalSettingDialog = false;
    },

    setTickWhenCreatingSnapshot() {
      this.messageforsnapshot += "..";
    },

    ShowIdleCases(){

      let showIdleCasesOnly = GetSettingFromSessionStorage("showIdleCasesOnly")!== null ? GetSettingFromSessionStorage("showIdleCasesOnly") : "false";

      if(showIdleCasesOnly === 'true') {
        this.showIdleCasesOnly = "false"
        
      } else if(showIdleCasesOnly==='false') {
        this.showIdleCasesOnly = 'true';
      }

      //persist current status to session storage;
      SaveSettingToSessionStorage("showIdleCasesOnly",this.showIdleCasesOnly)
 
      // Apply filter
        const engineers_chosen = JSON.parse(
          GetSettingFromLocalStorage("engineers_chosen")
        );
       
       //disable chart filter
       this.DisableChartFitler_UI();

       this.Apply_Filter_Internal(engineers_chosen); 

       //generate chart dataset based on current service ticket list:
      this.Generate_Dataset_For_Charts();

           //refresh action cards
           this.Generate_Actions(this.servicetickets);
    },

    Apply_Team_Filter(team_chosen) {
      // clean engineer filter which was for previous team, and now we switch to another team.
      window.localStorage.removeItem("filterApplied");
      window.localStorage.removeItem("engineers_chosen");
      window.sessionStorage.removeItem("showIdleCasesOnly");

      // the chosen team is not team current user belongs to.
      if (
        team_chosen !==
        GetSettingFromSessionStorage("teammanagers_alias").split(",")[0]
      ) {
        this.isTeamSwitched = true;
      } else {
        this.isTeamSwitched = false;
      }

      SaveSettingToLocalStorage("cachedteamforservicetickets", team_chosen);
      location.reload();
      //this.Init();
    },

    async SnapshotConfirmed() {
      let today = new Date();
      let month = new Date().getMonth() + 1;
      let currentdate = today.getDate();

      let dayofWeek = today.getDay();
      if (dayofWeek === 0 || dayofWeek === 6) {
        // can't create snapshot durign weekend
        this.showDialog_Snapshot = false;
        this.processingforsnapshot = false;
        return;
      }

      this.messageforsnapshot =
        "Creating snapshot in process. Please feel free to enjoy your coffee now  <i class='fas fa-mug-hot'></i> ...";
      let snapshotMessageInterval = setInterval(
        this.setTickWhenCreatingSnapshot,
        1000
      );
      this.processingforsnapshot = true;

      //clean cache
      //await WebAPI_Helper("get", "cleancache(case)", null);

      //  const whoami = GetSettingFromSessionStorage("whoami");
      let manager_alias =
        GetSettingFromLocalStorage("cachedteamforservicetickets") === null
          ? GetSettingFromSessionStorage("teammanagers_alias").split(",")[0]
          : GetSettingFromLocalStorage("cachedteamforservicetickets");

      // retrieve today's assignment
      let assignments = await this.RetrieveAssignment(manager_alias);
      //retrieve service tickets:

      this.backup_servicetickets = await this.fetchServiceTickets(
        manager_alias
      );

      let yearmonthdate_string = today.getFullYear();
      yearmonthdate_string +=
        month.toString().length === 1
          ? "0" + month.toString()
          : month.toString();
      yearmonthdate_string +=
        currentdate.toString().length === 1
          ? "0" + currentdate.toString()
          : currentdate.toString(); //  new Date().toISOString().slice(0, 10).replaceAll('-','');

      let yearmonthdate = parseInt(yearmonthdate_string);
      let yearmonth = parseInt(yearmonthdate_string.slice(0, 6));
      let date = parseInt(yearmonthdate_string.slice(6, 8));

      this.backup_engineers.forEach((engineer) => {
        let temp_list_for_current_engineer = this.backup_servicetickets.filter(
          (item) => item.sr_caseowner == engineer.engineer_name
        );

        let engineer_alias = engineer.engineer_name;

        let backlog = engineer.backlog;

        let lessthan15days = temp_list_for_current_engineer.filter(
          (item) => item.sr_age < 15
        ).length;
        let between1530days = temp_list_for_current_engineer.filter(
          (item) => item.sr_age >= 15 && item.sr_age < 30
        ).length;
        let between3045days = temp_list_for_current_engineer.filter(
          (item) => item.sr_age >= 30 && item.sr_age < 45
        ).length;
        let between4560days = temp_list_for_current_engineer.filter(
          (item) => item.sr_age >= 45 && item.sr_age < 60
        ).length;
        let over60days = temp_list_for_current_engineer.filter(
          (item) => item.sr_age >= 60
        ).length;

        //get the asigned number for current engineer
        let assigned = assignments.filter(
          (assignment) => assignment.sr_caseowner === engineer.engineer_name
        ).length;

        let total =
          lessthan15days +
          between1530days +
          between3045days +
          between4560days +
          over60days;
        let lessthan15days_percent =
          total != 0 ? (100 * (lessthan15days / total)).toFixed(2) : 0;
        let between1530days_percent =
          total != 0 ? (100 * (between1530days / total)).toFixed(2) : 0;
        let between3045days_percent =
          total != 0 ? (100 * (between3045days / total)).toFixed(2) : 0;
        let between4560days_percent =
          total != 0 ? (100 * (between4560days / total)).toFixed(2) : 0;
        let over60days_percent =
          total != 0 ? (100 * (over60days / total)).toFixed(2) : 0;

        let engineerMetricsSnapshot = {
          engineer_alias: engineer_alias,
          manager_alias: manager_alias,
          backlog: backlog,
          assigned: assigned,
          lessthan15days: lessthan15days,
          lessthan15days_percent: lessthan15days_percent,
          between1530days: between1530days,
          between1530days_percent: between1530days_percent,
          between3045days: between3045days,
          between3045days_percent: between3045days_percent,
          between4560days: between4560days,
          between4560days_percent: between4560days_percent,
          over60days: over60days,
          over60days_percent: over60days_percent,
          yearmonthdate: yearmonthdate,
          yearmonth: yearmonth,
          date: date,
        };

        this.AddMetricsSnapshot(engineerMetricsSnapshot);
        Sleep(1000);
      });

      //snapshot completed:
      clearInterval(snapshotMessageInterval); //release interval
      this.showDialog_Snapshot = false;
      this.processingforsnapshot = false;
      this.messageforsnapshot =
        "Are you sure to create team operation snapshot of today now ?  You can create today's snapshot for multiples times within one day.";

      //reload the page
      // location.reload();
    },

    CreateSnapshot() {
      this.showDialog_Snapshot = true;

      //Can't create snapshot during weekend
      let today = new Date();
      let dayofWeek = today.getDay();
      if (dayofWeek === 0 || dayofWeek === 6) {
        this.messageforsnapshot =
          "Creating snapshot during weekend is not allowed, because the overall monthly metrics could be impacted";
      }
    },

    async CompleteBackup() {
      await WebAPI_Helper("get", "completebackup", null);
      location.reload();
    },

    SnapshotCanceled() {
      this.showDialog_Snapshot = false;
    },

    async RetrieveAssignment(manager_alias) {
      return WebAPI_Helper(
        "get",
        "assignments/manager/" + manager_alias + "/mode/1"
      );
    },

    //Persist personal setting to local broswer storage
    SavePersonalSettings(showAllActions, appstylemode) {
      this.showPersonalSettingDialog = false; //close the setting modal
      this.showAllActions = showAllActions;
      // save the setting to cache
      window.localStorage.setItem("showAllActions", this.showAllActions);
      this.appstylemode = appstylemode;
      SetAppStyleMode(appstylemode);

      switch (appstylemode) {
        case "DEFAULT":
          document.body.style.backgroundColor = "#fff";
          break;
        case "DARK":
          document.body.style.backgroundColor = "#1e1e1e";
          break;
      }

      this.Generate_Actions(); // Gerenate action cards based on personal settings
      location.reload();
    },

    // Switch theme based on user's choice
    SwitchTheme(appstylemode) {
      this.appstylemode = appstylemode;

      switch (appstylemode) {
        case "DEFAULT":
          document.body.style.backgroundColor = "#fff";
          break;
        case "DARK":
          document.body.style.backgroundColor = "#1e1e1e";
          break;
      }
      this.hovered = false;
    },

    // clean server side cache of little ant and re-fetch live data from crmglobal
    async CleanCache() {
      let cachedteamforservicetickets;
      if (this.userrole < 2) {
        await WebAPI_Helper(
          "get",
          "cleancache/cachetype/case/teamoruser/" + this.currentuser,
          null
        );
      } else {
        cachedteamforservicetickets =
          GetSettingFromLocalStorage("cachedteamforservicetickets") === null
            ? GetSettingFromSessionStorage("teammanagers_alias").split(",")[0]
            : GetSettingFromLocalStorage("cachedteamforservicetickets");

        await WebAPI_Helper(
          "get",
          "cleancache/cachetype/case/teamoruser/" + cachedteamforservicetickets,
          null
        );
      }
      location.reload();
    },

    RefreshConfirmed() {
      this.showDialog_Refresh = false;
      this.CleanCache();
    },

    RefreshCanceled() {
      this.showDialog_Refresh = false;
    },

    ShowRefreshModal() {
      this.showDialog_Refresh = true;
    },

    async SwitchTeam() {
      this.teams =
        GetSettingFromSessionStorage("teammanagers_alias").split(",");
      this.showTeamFilter = true;
    },

    // Navitate to service ticekt details component to review comments or add new comment
    reviewServiceTicket(serviceticket) {
      this.$router.push({
        path: "/ServiceTicketDetails",
        query: {
          sr_number: serviceticket.sr_number,
        },
      });
    },

    // Judge if current service ticekt belongs to either one who was choosed.
    IsCaseOwner_In_Chosen_List(serviceticket, engineers_chosen) {
      for (let i = 0; i < engineers_chosen.length; i++) {
        if (
          serviceticket.sr_caseowner.toLowerCase() ===
          engineers_chosen[i].toLowerCase()
        )
          return true;
      }

      return false;
    },

    DownloadChart(downloading_status) {
      if (downloading_status === "true") this.downloading = "true";
      else this.downloading = "false";
    },

    Generate_Dataset_For_Charts() {
      // Variables for piechart of icm status
      let Number_IcMRaised = 0;
      let Number_NoIcM = 0;

      // Variables for piechart by pod
      let labels_pod = [];
      let Number_pod = []; // An array to store the number of each pod

      // Variables for piechart by program
      let labels_programtype = ["S500","None"];
      let Number_programtype = [0,0]; // An array to store the number of each program


      // Variables for piechart by status
      let labels_status = [];
      let Number_status = [];

      //Variables for piechart by region
      let labels_region = [];
      let Number_region = []; // An array to store the number of each pod

      //Variabes for bubble chart.
      let dataset_for_bubble_chart = [];

      //Initial labels
      for (let i = 0; i < this.servicetickets.length; i++) {
        let pod =
          this.servicetickets[i].sr_support_pod !== null
            ? this.servicetickets[i].sr_support_pod
            : "Unknown";

        //initial labels for pod
        if (labels_pod.find((element) => element === pod) === undefined) {
          labels_pod = [...labels_pod, pod];
          //initiale  array
          Number_pod.push(0);
        }

        //initial labels for region
        let region =
          this.servicetickets[i].sr_country_code !== null
            ? this.servicetickets[i].sr_country_code
            : "Unknown";

        if (labels_region.find((element) => element === region) === undefined) {
          labels_region = [...labels_region, region];
          //initiale  array
          Number_region.push(0);
        }

        //initial labes for case status
        let status =
          this.servicetickets[i].sr_status !== null
            ? this.servicetickets[i].sr_status
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

      //Generate dataseets from list now.
      for (let i = 0; i < this.servicetickets.length; i++) {
        let serviceticket = this.servicetickets[i];
        let idle_days = serviceticket.sr_idle_days;
        let sr_age = serviceticket.sr_age;
        let sr_owner = serviceticket.sr_caseowner;
        let sr_number = serviceticket.sr_number;
        let sr_region = serviceticket.sr_country_code;
        let sr_customer = serviceticket.primaryAddress;
        let status = serviceticket.sr_status;
        let sr_icm = serviceticket.sr_icm;
        let sr_record_guid = serviceticket.sr_record_guid;
        let programType=serviceticket.programType;

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
          sr_age: sr_age,
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

         //Search the labels of programtype, and increase the number if matched.
         temp_index = labels_programtype.indexOf(programType)
         if (temp_index!== -1) Number_programtype[temp_index] += 1;
        

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
      // background_icm = this.Shuffle(backgroundColor_buffer).slice(
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
      backgroundColor_pod = this.Shuffle(backgroundColor_buffer).slice(
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

      //generate dataset for pie chart by programtype
        //initial background color for programtype
      let backgroundColor_programtype = [];    
      backgroundColor_programtype = ["#873e23","darkgray"];           

      let dataitem_programtype = [];
      let datasets_programtype = [];

      dataitem_programtype.data = Number_programtype;
      dataitem_programtype.backgroundColor = backgroundColor_programtype;

      datasets_programtype = [...datasets_programtype, dataitem_programtype];
      this.dataset_chart_pie_by_programtype.datasets = datasets_programtype;   
      this.dataset_chart_pie_by_programtype.labels = labels_programtype;
      //end

      //generate dataset for pie chart by region
      let backgroundColor_region = [];
      backgroundColor_region = this.Shuffle(backgroundColor_buffer).slice(
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

      //generate dataset for pie chart by region
      // let data = [];
      let backgroundColor_status = [];
      let datasets = [];
      let dataitem = {};

      backgroundColor_status = this.Shuffle(backgroundColor_buffer).slice(
        0,
        labels_status.length
      );
      dataitem.data = Number_status;
      dataitem.backgroundColor = backgroundColor_status;
      datasets = [...datasets, dataitem];
      this.dataset_chart_pie_by_status.datasets = datasets;
      this.dataset_chart_pie_by_status.labels = labels_status;
    },

    //Shuffle the array so that we will get top items randomly
    Shuffle(backgroundColor_Array) {
      for (let i = backgroundColor_Array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [backgroundColor_Array[i], backgroundColor_Array[j]] = [
          backgroundColor_Array[j],
          backgroundColor_Array[i],
        ];
      }
      return backgroundColor_Array;
    },

    Apply_Filter(engineers_chosen) {
      if (this.servicetickets === null) return;

      //disable chart filter
      this.DisableChartFitler_UI();

      //remove showidlecasesonly switch
      window.sessionStorage.removeItem("showIdleCasesOnly");
      this.showIdleCasesOnly = 'false';

      //toggle the filter
      this.showFilter = false; // !this.showFilter;
     
    if(engineers_chosen !==null) {
      SaveSettingToLocalStorage("filterApplied", "true");

      this.filterApplied = "true"; 
      // persist the chosen engineers list to local storage.
      SaveSettingToLocalStorage(
        "engineers_chosen",
        JSON.stringify(engineers_chosen)
      );
    }

      //apply filter to generate the coresponding service ticket list and summary
      this.Apply_Filter_Internal(engineers_chosen);

      //generate chart dataset based on current service ticket list:
      this.Generate_Dataset_For_Charts();

      //refresh action cards
      this.Generate_Actions(this.servicetickets);
    },

    // Apply filter to generate coreponding service ticket lists including total, 60,4560,3045,1530,15.
    Apply_Filter_Internal(engineers_chosen) {
      //current total service ticket list
      this.servicetickets = this.Filter_ServiceTickets(
        this.backup_servicetickets,
        engineers_chosen
      );

      //current service ticket list of 60
      this.servicetickets_60 = this.Filter_ServiceTickets(
        this.backup_servicetickets_60,
        engineers_chosen
      );

      // current service ticekt list of 4560
      this.servicetickets_45_60 = this.Filter_ServiceTickets(
        this.backup_servicetickets_45_60,
        engineers_chosen
      );

      // curent service ticekt list of 3045
      this.servicetickets_30_45 = this.Filter_ServiceTickets(
        this.backup_servicetickets_30_45,
        engineers_chosen
      );

      //current service ticekt list of 1530
      this.servicetickets_15_30 = this.Filter_ServiceTickets(
        this.backup_servicetickets_15_30,
        engineers_chosen
      );

      //current service ticekt list of 15
      this.servicetickets_15 = this.Filter_ServiceTickets(
        this.backup_servicetickets_15,
        engineers_chosen
      );

      //bug
      this.bug_count = this.servicetickets.filter(
        (ticket) => ticket.sr_bugurl !== "" && ticket.sr_bugurl !== null
      ).length;
      this.Refresh_Summary();
    },

    //Generate service ticekt lists from source service ticket lists  which owner belongs to one of engineers_chosen.
    Filter_ServiceTickets(servicetickets, engineers_chosen) {
      let temp_list = [];

      if (servicetickets === null) return null;

      if(engineers_chosen === null) {
        temp_list = servicetickets
      } else {
      for (let i = 0; i < servicetickets.length; i++) {
        if (
          this.IsCaseOwner_In_Chosen_List(servicetickets[i], engineers_chosen)
        ) {
          //check if trendingissueonly switch is on or off
          temp_list = [...temp_list, servicetickets[i]];
        }
      }
    }

      // Just choose idle cases if showidlecasesonly is applied.
      if( GetSettingFromSessionStorage("showIdleCasesOnly") === "true") {
        let idle_threshold =  GetSettingFromSessionStorage("Idle_Threshold_In_Days") !== null? parseInt(GetSettingFromSessionStorage("Idle_Threshold_In_Days")) : 7;       
        
        temp_list= temp_list.filter((item) => item.sr_idle_days > idle_threshold)
        
      }
     
      return temp_list;
    },

    Refresh_Summary() {
      this.summary.count15 = this.servicetickets_15.length;
      this.summary.count1530 = this.servicetickets_15_30.length;
      this.summary.count3045 = this.servicetickets_30_45.length;
      this.summary.count4560 = this.servicetickets_45_60.length;
      this.summary.count60 = this.servicetickets_60.length;
      this.summary.backlog = this.servicetickets.length;
      this.summary.bug_count = this.bug_count;
      this.summary.engineers = this.Refresh_Engieers_Number();
      this.summary.trendingissues_count = this.Refresh_Trending_Issues_Count(
        this.servicetickets
      );

      const total =
        this.summary.count15 +
        this.summary.count1530 +
        this.summary.count3045 +
        this.summary.count4560 +
        this.summary.count60;

      this.summary.bug_count_percentage = 0.0;

      if (total !== 0) {
        this.summary.count15_percentage =
          (100 * (this.summary.count15 / total)).toFixed(1) + "%";
        this.summary.count1530_percentage =
          (100 * (this.summary.count1530 / total)).toFixed(1) + "%";
        this.summary.count3045_percentage =
          (100 * (this.summary.count3045 / total)).toFixed(1) + "%";
        this.summary.count4560_percentage =
          (100 * (this.summary.count4560 / total)).toFixed(1) + "%";
        this.summary.count60_percentage =
          (100 * (this.summary.count60 / total)).toFixed(1) + "%";
        this.summary.trendingissues_count_percentage =
          (100 * (this.summary.trendingissues_count / total)).toFixed(1) + "%";
        //bug statistics
        this.summary.bug_count_percentage =
          (100 * (this.summary.bug_count / total)).toFixed(1) + "%";
      }
    },

    Refresh_Engieers_Number() {
      // filter is not applied, just return the team members length
      if (this.chartFilter_Enabled !== true) {
        if (
          this.filterApplied === "false" ||
          this.filterApplied === false ||
          this.filterApplied === undefined
        ) {
           if(this.showIdleCasesOnly ==='false' || this.showIdleCasesOnly === false) {
             return this.backup_engineers.length;
              }
        }
      }

      this.engineers = [];
      for (let i = 0; i < this.servicetickets.length; i++) {
        let sr_caseowner = this.servicetickets[i].sr_caseowner;

        //for current case, we checked the case owner and see if this curent owner appears in the engineers list.
        // if not, it's a new engineer and put it into engineers list
        if (
          this.engineers.find((element) => element === sr_caseowner) ===
          undefined
        ) {
          this.engineers = [...this.engineers, sr_caseowner];
        }
      }
      // the length of engineers list is just the number of engineers of current service ticekts.
      return this.engineers.length;
    },

    Cancel_Filter() {
      //disable chart filter
      this.DisableChartFitler_UI();

      //set filterAplied status as false
      SaveSettingToLocalStorage("filterApplied", "false");
      this.filterApplied = "false";

      //clean the chosen engineers list so that all service tickets will be loaded.
      ClearSettingFromLocalStorage("engineers_chosen");

      this.showFilter = false; // !this.showFilter;

      this.Refresh_Default_Categarized_ServiceLists();
      this.Generate_Dataset_For_Charts();

      //refersh the acton cards
      this.Generate_Actions(this.backup_servicetickets);
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
    // Generate the categarized service ticket lists from primivate service tickets.
    Refresh_Default_Categarized_ServiceLists() {
      this.servicetickets = this.backup_servicetickets;
      this.servicetickets_60 = this.backup_servicetickets_60 =
        this.servicetickets.filter((ticket) => ticket.sr_age >= 60);
      this.servicetickets_45_60 = this.backup_servicetickets_45_60 =
        this.servicetickets.filter(
          (ticket) => ticket.sr_age < 60 && ticket.sr_age >= 45
        );
      this.servicetickets_30_45 = this.backup_servicetickets_30_45 =
        this.servicetickets.filter(
          (ticket) => ticket.sr_age < 45 && ticket.sr_age >= 30
        );

      this.servicetickets_15_30 = this.backup_servicetickets_15_30 =
        this.servicetickets.filter(
          (ticket) => ticket.sr_age < 30 && ticket.sr_age >= 15
        );
      this.servicetickets_15 = this.backup_servicetickets_15 =
        this.servicetickets.filter((ticket) => ticket.sr_age < 15);

      this.bug_count = this.servicetickets.filter(
        (ticket) => ticket.sr_bugurl !== "" && ticket.sr_bugurl !== null
      ).length;

      this.Refresh_Summary();
    },

    DisableChartFitler_UI() {
      this.chartFilter_Enabled = false;
      this.chart_Filters_Description = "";
      this.chart_Filters_Array = [];
    },

    DisableChartFilter() {
      this.DisableChartFitler_UI();

      //turn off showilecases switch 
     window.sessionStorage.removeItem("showIdleCasesOnly");
      this.showIdleCasesOnly = 'false';

      const engineers_chosen = JSON.parse(
        window.localStorage.getItem("engineers_chosen")
      );

      if (engineers_chosen !== null) {
        this.Apply_Filter_Internal(engineers_chosen);
        this.Refresh_Summary();
      } else {
        this.Refresh_Default_Categarized_ServiceLists();
      }

      //generate chart dataset based on current service ticket list:
      this.Generate_Dataset_For_Charts();

          //refresh action cards
          this.Generate_Actions(this.servicetickets);

      
    },

    FilterServiceTicketsFromChart(parameter, value) {
      this.filtered_ServiceTickets_Backup = this.servicetickets;

      let servicetickets_filteredfromchart = [];
      let filter;
      //console.log(value);
      switch (parameter) {
        case "ICM":
          if (value === "Cases with IcM Raised") {
            filter = "IcM Raised ";

            servicetickets_filteredfromchart = this.servicetickets.filter(
              (ticket) => ticket.sr_icm !== null
            );
          } else {
            filter = "No IcM Raised ";

            servicetickets_filteredfromchart = this.servicetickets.filter(
              (ticket) => ticket.sr_icm === null
            );
          }

          break;
        case "POD":
          filter = "POD like '" + value + "'";

          servicetickets_filteredfromchart = this.servicetickets.filter(
            (ticket) => ticket.sr_support_pod.startsWith(value)
          );

          break;
        case "REGION":
          filter = "Region eq '" + value + "'";

          servicetickets_filteredfromchart = this.servicetickets.filter(
            (ticket) => ticket.sr_country_code.startsWith(value)
          );

          break;
        case "STATUS":
          filter = "Status eq '" + value + "'";

          servicetickets_filteredfromchart = this.servicetickets.filter(
            (ticket) => ticket.sr_status.startsWith(value)
          );
          break;
        
        case "PROGRAMTYPE":
          filter = "programtype eq '" + value + "'";
         

          servicetickets_filteredfromchart = this.servicetickets.filter(
            (ticket) => ticket.programType.startsWith(value)
          );

          break;
      }

      //avoid insert duplicated condition.
      if (this.chart_Filters_Array.indexOf(filter) == -1)
        this.chart_Filters_Array = [...this.chart_Filters_Array, filter];

      this.chart_Filters_Description = this.chart_Filters_Array.join(" & ");

      this.servicetickets = servicetickets_filteredfromchart;

      this.servicetickets_60 = this.servicetickets.filter(
        (ticket) => ticket.sr_age >= 60
      );
      this.servicetickets_45_60 = this.servicetickets.filter(
        (ticket) => ticket.sr_age < 60 && ticket.sr_age >= 45
      );
      this.servicetickets_30_45 = this.servicetickets.filter(
        (ticket) => ticket.sr_age < 45 && ticket.sr_age >= 30
      );

      this.servicetickets_15_30 = this.servicetickets.filter(
        (ticket) => ticket.sr_age < 30 && ticket.sr_age >= 15
      );

      this.servicetickets_15 = this.servicetickets.filter(
        (ticket) => ticket.sr_age < 15
      );

      this.bug_count = this.servicetickets.filter(
        (ticket) => ticket.sr_bugurl !== "" && ticket.sr_bugurl !== null
      ).length;

      this.chartFilter_Enabled = true;

      //refresh the staticis
      this.Refresh_Summary();
      this.Generate_Dataset_For_Charts();

      //refresh action cards
      this.Generate_Actions(this.servicetickets);
    },

    Close_EngineerFitler_Modal() {
      this.showFilter = false;
    },

    Close_Team_Fitler_Modal() {
      this.showTeamFilter = false;
    },

    // Web API Methods
    async addReview(newreview) {
      return await WebAPI_Helper("post", "reviews", newreview);
    },

    async fetchServiceTickets(alias) {
        return await WebAPI_Helper(
        "get",
        "servicetickets/teamoruser/" + alias,
        null
      );
    },

    async reportingm1manager(whoami) {
      return WebAPI_Helper("get", "reportingm1manager(" + whoami + ")");
    },

    async is_superuser() {
      return await WebAPI_Helper("get", "issuperuser", null);
    },

    async isadministrator() {
      return await WebAPI_Helper("get", "isadministrator", null);
    },

    async CurrentUserRole() {
      return await WebAPI_Helper("get", "currentuserrole");
    },

    async fetch_review_history() {
      return await WebAPI_Helper("get", "allreviewhistory", null);
    },

    async getsetting() {
      return await WebAPI_Helper("get", "getsetting", null);
    },

    // async MCE_Approver_List() {
    //   return await WebAPI_Helper("get", "mceapproverlist", null);
    // },

    async fetch_reviewer() {
      return await WebAPI_Helper("get", "whoami", null);
    },

    // CreateSnapshot
    async AddMetricsSnapshot(engineerMetricsSnapshot) {
      WebAPI_Helper("POST", "addsmetricssnapshot", engineerMetricsSnapshot);
    },

    // Assign MCE
    async assignMceTask(newreview_cpetask, cpe_taskowner) {
      WebAPI_Helper("POST", "addreview", newreview_cpetask);
      this.upsert_review_history(newreview_cpetask, cpe_taskowner);
      //send notification email to mce task owner
      this.NotifyEngineer(newreview_cpetask.id);
    },

    async upsert_review_history(newreview, cpe_taskowner) {
      let review_history_data = {
        sr_number: newreview.sr_number,
        id: Math.floor(Math.random() * 65585),
        mce_status: 2,
        latest_cpe_assessment: 100, // 100 means it will get the latest cpe assessment
        mce_task_owner: cpe_taskowner,
      };

      if (newreview.mcedone) review_history_data.mce_status = 3; //3 means mce done;

      WebAPI_Helper("POST", "upsertreviewhistory", review_history_data);
    },

    async NotifyEngineer(commentId) {
      WebAPI_Helper("get", "notifyengineer(" + commentId + ")", null);
    },

    async getteammembers(team_alias) {
      return await WebAPI_Helper(
        "get",
        "teammembers(" + team_alias + ")",
        null
      );
    },

    async pendingaces() {
      return await WebAPI_Helper("get", "pendingaces", null);
    },

    // Web API ends.

    // Generat action card list
    Generate_Actions(servicetickets) {
      //purge the original action card list
      this.actions = [];

      //if (this.backup_servicetickets === null) return;
      if (servicetickets === null || servicetickets === undefined) return;

      for (let i = 0; i < servicetickets.length; i++) {
        let temp = servicetickets[i];

        if (this.showAllActions === "false" || this.showAllActions === false) {
          if (
            (this.currentuser !== temp.sr_caseowner &&
              (temp.mce_status === 0 || temp.mce_status === undefined)) || //not current user's case and mce is not raised, no show
            (temp.mce_status === 1 && this.userrole === 1) || // mce pending and not admin, no show
            (temp.mce_status === 2 &&
              temp.mce_task_owner !== this.currentuser) || // mce assigned and the mce owner is not current user, no show
            (this.currentuser !== temp.sr_caseowner && temp.mce_status == 3) // mce done and good to close. no show
          ) {
            continue; //
          }
        }

        this.Generate_Action(temp);
      }
    },

    //generate a singole action card based on a service ticket
    Generate_Action(formmatted_serviceticket) {
      let temp_serviceticket = formmatted_serviceticket;

      let new_action = {
        sr_number: temp_serviceticket.sr_number,
        sr_idle_days: temp_serviceticket.sr_idle_days,
        sr_age: temp_serviceticket.sr_age,
        sr_caseowner: temp_serviceticket.sr_caseowner,
        sr_record_guid: temp_serviceticket.sr_record_guid,
        sr_country_code: temp_serviceticket.sr_country_code,
      };

      if (temp_serviceticket.mce_status === 1) {
        // create action card of MCE assignment : 1 means pending on MCE

        // create 2 actions for 2 TAs
        new_action.action_type = 2;
        new_action.action_description =
          "MCE from " + temp_serviceticket.sr_caseowner + " Not Assigned";
        new_action.action_label = "ASSIGN MCE";
        new_action.action_owner = "administrator";

        this.actions = [...this.actions, new_action]; // append to actions array
      }

      // create action card of MCE completion : 2 means pending on MCE completion
      else if (temp_serviceticket.mce_status === 2) {
        new_action.action_type = 3;
        new_action.action_description =
          "MCE On-Going By " + temp_serviceticket.mce_task_owner;
        new_action.action_label = "COMPLETE MCE";
        new_action.action_owner = temp_serviceticket.mce_task_owner;

        this.actions = [...this.actions, new_action]; // append to actions array
      }

      // create action card of MCE completion : 3 means mce done
      else if (temp_serviceticket.mce_status === 3) {
        new_action.action_type = 4;
        new_action.action_description = "MCE Done and Waiting For Close";
        new_action.action_label = "CLOSE CASE";
        new_action.action_owner = temp_serviceticket.sr_caseowner;

        this.actions = [...this.actions, new_action]; // append to actions array
      }
      // create action card for aged cases which age  > 60 days
      else if (temp_serviceticket.sr_age >= 60) {
        new_action.action_type = 5;
        new_action.action_description =
          "Long Age Case For " + temp_serviceticket.sr_age + " Days";
        new_action.action_label = "OPEN CASE";
        new_action.action_owner = temp_serviceticket.sr_caseowner;
        this.actions = [...this.actions, new_action]; // append to actions array
      }

      // create action card of idle case notification
      let idle_action = {
        sr_number: temp_serviceticket.sr_number,
        sr_idle_days: temp_serviceticket.sr_idle_days,
        sr_age: temp_serviceticket.sr_age,
        sr_caseowner: temp_serviceticket.sr_caseowner,
        sr_record_guid: temp_serviceticket.sr_record_guid,
        sr_country_code: temp_serviceticket.sr_country_code,
      };

      if (
        this.teamprofile.Idle_Threshold_In_Days !== null &&
        this.teamprofile.Idle_Threshold_In_Days !== "" &&
        temp_serviceticket.sr_idle_days >
          parseInt(this.teamprofile.Idle_Threshold_In_Days)
      ) {
        idle_action.action_type = 1;
        idle_action.action_description =
          "Case Idle For " + temp_serviceticket.sr_idle_days + " Days";
        idle_action.action_label = "OPEN CASE";
        idle_action.action_owner = temp_serviceticket.sr_caseowner;
        this.actions = [...this.actions, idle_action]; // append to actions array
      }

      //create backup action card
      let seperated_action = {
        sr_number: temp_serviceticket.sr_number,
        sr_idle_days: temp_serviceticket.sr_idle_days,
        sr_age: temp_serviceticket.sr_age,
        sr_caseowner: temp_serviceticket.sr_caseowner,
        sr_record_guid: temp_serviceticket.sr_record_guid,
        sr_country_code: temp_serviceticket.sr_country_code,
      };
      if (temp_serviceticket.latest_review_type === 10 && temp_serviceticket.case_backup_owner !==null) {
        seperated_action.action_type = 6;
        seperated_action.action_description =
          "case backup by " + temp_serviceticket.case_backup_owner;
        seperated_action.action_label = "OPEN CASE";
        seperated_action.action_owner = temp_serviceticket.case_backup_owner;
        this.actions = [...this.actions, seperated_action]; // append to actions array
      }
    },

    Refresh_EngineersAndBacklog(teammembers) {
      //Init engineer name and backlog
      for (let i = 0; i < teammembers.length; i++) {
        let engineer = {};
        engineer.engineer_name = teammembers[i];
        engineer.backlog = 0;

        this.engineers = [...this.engineers, engineer];
      }

      //initialize backup_engineers list
      this.backup_engineers = this.engineers;

      if (this.servicetickets !== null) {
        for (let i = 0; i < this.servicetickets.length; i++) {
          let sr_caseowner = this.servicetickets[i].sr_caseowner;

          let index = this.engineers.findIndex(
            (element) =>
              element.engineer_name.toLowerCase() === sr_caseowner.toLowerCase()
          );

          if (index !== -1) {
            this.engineers[index].backlog += 1;
          }
          //} // the engineer is found from the array
        }
      }
    },

    Fillin_ServiceTickets_Basedon_ReviewHistory(allreview_data) {
      if (this.servicetickets !== null) {
        for (let i = 0; i < this.servicetickets.length; i++) {
          let sr_number = this.servicetickets[i].sr_number;

          if (allreview_data === null) continue;

          for (let j = 0; j < allreview_data.length; j++) {
            let sr_number_reviewed = allreview_data[j].sr_number;
            if (sr_number === sr_number_reviewed) {
              this.servicetickets[i].mce_status =
                allreview_data[j].mce_status === null
                  ? 0
                  : allreview_data[j].mce_status; // update mce status of each case
              this.servicetickets[i].latest_cpe_assessment =
                allreview_data[j].latest_cpe_assessment;
              this.servicetickets[i].review_times =
                allreview_data[j].review_times; //===0? 1: allreview_data[j].review_times
              this.servicetickets[i].mce_task_owner =
                allreview_data[j].mce_task_owner;

              this.servicetickets[i].latest_review_type =
                allreview_data[j].latest_review_type;
              this.servicetickets[i].case_backup_owner =
                allreview_data[j].case_backup_owner;

              this.servicetickets[i].is_vip_notification_done =
                allreview_data[j].is_vip_notification_done;

              if (
                allreview_data[j].latest_update_date !== null &&
                allreview_data[j].latest_update_date !== undefined &&
                parseInt(allreview_data[j].latest_review_type) !== 0 // 7 is idle scan notification.
              ) {
                const days_diff = Days_Diff(
                  allreview_data[j].latest_update_date
                );

                const Threshold_Active_Review =
                  this.teamprofile.Threshold_Active_Review === null
                    ? 3
                    : this.teamprofile.Threshold_Active_Review;
                if (
                  days_diff <= parseInt(Threshold_Active_Review) &&
                  allreview_data[j].latest_review_type !== 7 &&
                  allreview_data[j].latest_review_type !== 10 &&
                  allreview_data[j].latest_review_type !== 11
                )
                  //viewtype 7 is idle alert
                  this.servicetickets[i].is_reviewed_today = true;
              }

              //init  is_trending_issue_status
              this.servicetickets[i].is_trending_issue =
                allreview_data[j].is_trending_issue;
              break;
            }
            //For cases not reviewed, set review times as 0
            this.servicetickets[i].review_times = 0;
          }
        }
      }
    },

    // The main function when the page is loaded for the first time, this is a very load function
    async Init() {
      //loaded = false so that the loaing animation will be displayed
      this.loaded = false;

      //Modify the page title
      document.title = this.$route.meta.title;

      //set dashboard menu as selected item
      SaveSettingToSessionStorage("selectedMenu", "1");

      this.siteNivBar_expanded =
        GetSettingFromLocalStorage("siteNivBar_expanded") === null
          ? "false"
          : GetSettingFromLocalStorage("siteNivBar_expanded");

      //Init the app theme
      this.appstylemode = GetAppStyleMode();

    
      //initialize whoami
      if (GetSettingFromSessionStorage("whoami") !== null)
        this.currentuser = GetSettingFromSessionStorage("whoami");
      else {
        const whoami = await this.fetch_reviewer();
        SaveSettingToSessionStorage("whoami", whoami);
        this.currentuser = whoami;
      }

      //When the app is provisoned for the first time, advanced setting modal will show up for initial configuration.
    
      const setting = (this.setting = await this.getsetting());

      this.userrole =
        GetSettingFromSessionStorage("userrole") === null
          ? await WebAPI_Helper("get", "currentuserrole", null)
          : parseInt(GetSettingFromSessionStorage("userrole"));
      SaveSettingToSessionStorage("userrole", this.userrole);

      let cachedteamforservicetickets;
      if (this.userrole >= 2) {
        if (
          GetSettingFromLocalStorage("cachedteamforservicetickets") === null
        ) {
          SaveSettingToSessionStorage(
            "teammanagers_alias",
            setting.teammanagers_alias
          );
          cachedteamforservicetickets =
            setting.teammanagers_alias.split(",")[0];
        } else {
          cachedteamforservicetickets = GetSettingFromLocalStorage(
            "cachedteamforservicetickets"
          );
        }
      } else { 
        cachedteamforservicetickets =await this.reportingm1manager(this.currentuser);
        SaveSettingToLocalStorage(
          "cachedteamforservicetickets",
          cachedteamforservicetickets
        );
      }

      //get team profile
      if (this.userrole >= 4 && setting === null) {
        this.ShowSettingModal();
        this.loaded = true;
        return;
      } else {
        this.teamprofile = await WebAPI_Helper(
          "get",
          "teamprofile/manager/" + cachedteamforservicetickets,
          ""
        );

        if (this.teamprofile === null) {
          // unregister user trying to access, just return;
          // this.ErrorRaised = true;
          this.showFeedbackDialog = true;
          this.loaded = true;
          return;
        }
        SaveSettingToSessionStorage(
          "Idle_Threshold_In_Days",
          this.teamprofile.Idle_Threshold_In_Days
        );
        SaveSettingToSessionStorage(
          "Threshold_High_Backlog",
          this.teamprofile.Threshold_High_Backlog
        );
      }

      //save managers' list to storage
      SaveSettingToSessionStorage(
        "teammanagers_alias",
        this.setting.teammanagers_alias
      );

      //get showAllaction setting from cache
      this.showAllActions =
        GetSettingFromSessionStorage("showAllActions") === null
          ? "true"
          : GetSettingFromSessionStorage("showAllActions");

      //hide the filter
      this.showFilter = false;

      //intial the chart status
      this.chartEnabled =
        GetSettingFromSessionStorage("chartEnabled") === null
          ? "false"
          : GetSettingFromSessionStorage("showAllActions");

      //set issuperuser float for current user
      // this.issuperuser = await this.is_superuser();
      // SaveSettingToSessionStorage("issuperuser", this.issuperuser);

    
      
      this.EngineersFilterModalTitle = "Please select engineers to display";

      // Cache the approver list if it's an admin
      //if (this.userrole >=2)
      {
        const approver_list = this.teamprofile.MCEApproval_List;
        SaveSettingToSessionStorage("approver_list", approver_list);
      }

      //Get the full service tickets list

      if (this.userrole ==1 ) {
        this.servicetickets = await this.fetchServiceTickets(this.currentuser);
      } else {
        this.servicetickets = await this.fetchServiceTickets(
          cachedteamforservicetickets
        );

        //set isTeamSwitched status
        this.isTeamSwitched =
          cachedteamforservicetickets !==
          GetSettingFromSessionStorage("teammanagers_alias").split(",")[0];
     
        }
      //Save the primitive full service ticket to backup, which will be used once engineer filters is removed.
      this.backup_servicetickets = this.servicetickets;

      // Init the team member  list from server
      const teammembers = await this.getteammembers(
        cachedteamforservicetickets
      );

      //Init engineers list  and backlog
      this.Refresh_EngineersAndBacklog(teammembers);
  

      const allreview_data = await this.fetch_review_history();
      this.Fillin_ServiceTickets_Basedon_ReviewHistory(allreview_data);

      //generate action cards:
      this.Generate_Actions(this.servicetickets);

      if (this.servicetickets !== null) {
        this.Refresh_Default_Categarized_ServiceLists();
      }

      //initialize the filterApplied status
      this.filterApplied =
        GetSettingFromLocalStorage("filterApplied") === null
          ? "false"
          : GetSettingFromLocalStorage("filterApplied");

      //Apply the engineers filter if it's applied before.
      if (this.filterApplied === "true") {
        const engineers_chosen = JSON.parse(
          GetSettingFromLocalStorage("engineers_chosen")
        );

        //hide the filter
        this.showFilter = true; // set it as true then apply_filter wil toggle the value as false
        this.Apply_Filter(engineers_chosen);
      }

      //gerenate ds for chart
      this.Generate_Dataset_For_Charts();

      //initialize chartEnabled status
      this.chartEnabled =
        GetSettingFromSessionStorage("chartEnabled") === null
          ? "true"
          : GetSettingFromSessionStorage("chartEnabled");

      // Data Loaded completely, loading image hidden now.
      this.loaded = true;
    },
  },

  async created() {
    this.Init();
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

.filter_applied {
  background-color: orange;
  width: 15%;
  margin: 0px;
  height: 10px;
  text-align: center;
  border: 0px;
  cursor: pointer;
  color: white;
  font-size: 10px;
}

.filter_canceled {
  background-color: green;
  width: 15%;
  margin: 0px;
  height: 10px;
  text-align: center;
  border: 0px;
  cursor: pointer;
  color: white;
  font-size: 10px;
}

input {
  width: 80%;
  height: 30px;
  padding: 10px;
  font-size: 1em;
  margin: 0px;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
  border-color: darkgreen;
  /* font-weight: bold;  */
  /* font-family: Verdana, Arial, Helvetica, sans-serif; */
}

.search_button {
  width: 150px;
  background-color: darkgreen;
  height: 30px;
  padding: 5px;
  text-align: center;
  border: 0px;
  margin: 0px;
  border-color: gray;
  border-bottom: 2px;
  cursor: pointer;
  color: white;
}

.filter_button {
  width: 150px;
  display: inline-block;
  background-color: green;
  height: 40px;
  padding: 5px;
  text-align: center;
  border: 0px;
  cursor: pointer;
  margin: 5px;
  color: white;
}

.search_container {
  /* background-color: gray; */
  margin: 20px auto;
  width: 50%;
  padding: 10px;
}

.wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f8f8;
  margin: 0;
  padding: 20px;
}

.NavBarExpanded {
  margin-left: 12%;
}

.NavBarCollapsed {
  margin-left: 3%;
}

.switch_white {
  color: white;
}

.switch_black {
  color: black;
}
</style>

