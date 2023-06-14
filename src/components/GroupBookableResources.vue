<template>
  <SiteNav @ToggleNavBar="ToggleNavBar" :siteNivBar_expanded="siteNivBar_expanded"></SiteNav>
  <div
    :class="{
      NavBarCollapsed:
        siteNivBar_expanded === 'false' ||
        siteNivBar_expanded === undefined ||
        siteNivBar_expanded === false,
      NavBarExpanded: siteNivBar_expanded === 'true',
    }"
  >
  <LoadingCircle :showLoading="loaded === false" ></LoadingCircle>

    <RefreshConfirmationModal
      :showDialog="showDialog"
      @Refresh_Confirmed="RefreshConfirmed"
      @Refresh_Canceled="RefreshCanceled"
      greetingMessage="Are you sure to refresh the cache to get the live data which could take seconds ?"
    ></RefreshConfirmationModal>

    <TeamFilterModal_MultipleChoose
        :teams="teams"
        :showTeamDialog="showTeamsModal"
        :parameterForSelectedTeam="'selected_teams_resource'"
        @ApplyTeamFilter="Apply_Team_Filter"
        @CancelTeamFilter="Cancel_Team_Fitler_Modal"
        @CloseTeamFilterModal="Close_Team_Fitler_Modal"
    >

    </TeamFilterModal_MultipleChoose>

    <ul v-show="loaded === true">
      <li style="float: left">
        <a>Engineers Availability Center </a>
      </li>

      <li style="float: right; padding-right: 30px" @click="CleanCache">
        <a>
          <i
            class="fas fa-sync-alt"
            title="Clean server-side cache and re-fetch live data"
          ></i>
          &nbsp;{{ latestFreshTime }} UTC
        </a>
      </li>

      <li 
      style="float: right"
      v-bind:class="{
        filter_applied: isTeamFilterApplied === 'true' || isTeamFilterApplied===true,
        filter_canceled:
        isTeamFilterApplied === 'false' ||isTeamFilterApplied === false|| isTeamFilterApplied === undefined,
      }"
      @click="showTeamsModal= true"
    >
      <a>        
        <i class="fas fa-sitemap" title="Choose Teams to filter"></i>
      </a>
    </li>

    </ul>

    <div
      v-show="loaded === true"
      v-for="(data, index) in resources_teams"
      :key="data.manager"
    >
      <div style="clear: both"></div>
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
        ><i class="fas fa-user-friends" :class="{seperator: index!==0 }"></i> {{ Get_Team_DisplayName(data.manager) }}'S TEAM</label
      >
      <div style="clear: both"></div>

      <ChartPieByResource
        :chartData="data.DSPieResource"
        :height="70.99"
      ></ChartPieByResource>
      <div style="display: block; float: left; width: 80%">
        <BookableResources :bookableresources="data.resources">
        </BookableResources>
      </div>
    </div>
    <div style="clear: both"></div>
  </div>
  <Footer :appstylemode="appstylemode" v-if="loaded === true"/>
</template>
<script>
import {
  WebAPI_Helper,
  GetSettingFromSessionStorage,
  SaveSettingToSessionStorage,
  GetSettingFromLocalStorage,
     GetAppStyleMode,
     Get_Team_DisplayName,
     SaveSettingToLocalStorage,
     ClearSettingFromLocalStorage,
} from "../common.js";

import BookableResources from "./BookableResources.vue";
import Footer from "../components/layout/Footer";
import ChartPieByResource from "./ChartPieByResource";
//site nav
import SiteNav from "../components/SiteNav";
import RefreshConfirmationModal from "./RefreshConfirmationModal";
import LoadingCircle from "./LoadingCircle.vue";
import TeamFilterModal_MultipleChoose from "./TeamFilterModal_MultipleChoose"

export default {
  name: "GroupBookableResources",
  components: {
    BookableResources,
    SiteNav,
    Footer,
    ChartPieByResource,
    RefreshConfirmationModal,
    LoadingCircle,
    TeamFilterModal_MultipleChoose,
  },

  data() {
    return {
      siteNivBar_expanded: "false",
      loaded: false,
      showDialog: false, //trigger the refresh modal
      appstylemode: "DEFAULT",
      resources_teams: [],
      latestFreshTime: "",

      //dataset after analysis
      analyzed_ds_teams: [],

      teams:[],
      showTeamsModal:false,
      isTeamFilterApplied:false,
      //team mananger alias
      teammanagers_alias:[],


      //dataset for piechar by region
      dataset_chart_pie_by_resource: {
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

     //set resource status menu as selected item
      SaveSettingToSessionStorage('selectedMenu','5')

    this.siteNivBar_expanded =
      GetSettingFromLocalStorage("siteNivBar_expanded") !== null
        ? GetSettingFromLocalStorage("siteNivBar_expanded")
        : "false";
 
     this.appstylemode =GetAppStyleMode();

   

    this.latestFreshTime = await this.GetFreshTime();

    await this.Init();
   
    this.loaded = true;
  },

  methods: {

    Apply_Team_Filter(teams_chosen){
      SaveSettingToLocalStorage("selected_teams_resource",teams_chosen);
      this.showTeamsModal = false;
      this.isTeamFilterApplied = true;
      this.Init();
      location.reload();
    },
 
    Close_Team_Fitler_Modal(){
      this.showTeamsModal = false;
    },

    Cancel_Team_Fitler_Modal(){     
      ClearSettingFromLocalStorage("selected_teams_resource");
      this.showTeamsModal = false;
      this.isTeamFilterApplied = false;
     
      this.Init();
    },


    async Init() {
      let teammanagers_alias_str =
      GetSettingFromSessionStorage("teammanagers_alias");
      if (teammanagers_alias_str === null) {
      const setting = await this.getsetting();
  
      SaveSettingToSessionStorage(
        "teammanagers_alias",
        setting.teammanagers_alias
      );
    }

    this.teammanagers_alias =
      GetSettingFromSessionStorage("teammanagers_alias").split(",");       
      
    this.teams = this.teammanagers_alias; 
   
       //if teams filter was there, we apply the filter.
   if(GetSettingFromLocalStorage("selected_teams_resource")!==null) {
        this.teammanagers_alias = GetSettingFromLocalStorage("selected_teams_resource").split(",");
        this.isTeamFilterApplied = true;
      }         

    this.userRole = await WebAPI_Helper("get", "currentuserrole", null);
    //initial backlog for each team before we are going to analyze the data;
    for (let i = 0; i < this.teammanagers_alias.length; i++) {
      if (this.teammanagers_alias[i] === "" || this.teammanagers_alias[i] === null)
        continue;

        
      // if (this.userRole <=3 && teammanagers_alias[i] !== GetSettingFromSessionStorage("whoami")) continue;

      const data = await this.BookableResources(this.teammanagers_alias[i]);

      let online = [];
      let offline = [];

      online = data.filter((metrics) => {
        return metrics.valid_now !== false;
      }).length;

      offline = data.length - online;
      this.Generate_Dataset_For_Charts(online, offline);

      const item = {
        manager: this.teammanagers_alias[i],
        resources: data,
        DSPieResource: this.dataset_chart_pie_by_resource,
      };
      this.resources_teams.push(item);
      this.Clean_Dataset_ForAllCharts();
    }


    },


    Clean_Dataset_ForAllCharts() {
      //dataset for piechar by region
      this.dataset_chart_pie_by_resource = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };
    },

    Get_Team_DisplayName(manager_alias) {
      return Get_Team_DisplayName(manager_alias);
    },

    async GetFreshTime() {
      return await WebAPI_Helper("get", "latestfreshtime/cachetype/bookableresource/teamoruser/na");
    },

    Generate_Dataset_For_Charts(online, offline) {
      let labels_resource = ["Online", "Offline"];
      let numbers_resources = [online, offline];
      let background_resources = ["green", "darkgray"];

      let dataitem_resource = {};
      let datasets_resource = [];
      dataitem_resource.data = numbers_resources;
      dataitem_resource.backgroundColor = background_resources;

      datasets_resource.push(dataitem_resource);
      this.dataset_chart_pie_by_resource.datasets = datasets_resource;
      this.dataset_chart_pie_by_resource.labels = labels_resource;
    },

    //Show | show Nav Bar of left panel
    ToggleNavBar(siteNivBar_expanded) {
      this.siteNivBar_expanded = siteNivBar_expanded;
    },

    async BookableResources(manager_alias) {
      const data = WebAPI_Helper(
        "get",
        "bookableresources(" + manager_alias + ")",
        null
      );

      return data;
    },

    async getsetting() {
      return await WebAPI_Helper("get", "getsetting", null);
    },

    CleanCache() {
      this.showDialog = true;
    },

   async RefreshConfirmed() {
      this.showDialog = false;
     await WebAPI_Helper("get", "cleancache/cachetype/bookableresource/teamoruser/na", null);
      location.reload();
    },

    RefreshCanceled() {
      this.showDialog = false;
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

.seperator {
  margin-top: 20px
}

</style>

