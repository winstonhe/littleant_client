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
    <div id="loadingcontainer" v-show="loaded !== true">
      <img src="../images/loading.jpg" />
    </div>

    

    <CustomerFocusFilterModal
      :pods="pods"
      :showDialog="showFilter"
      :PodsFilterModalTitle="PodsFilterModalTitle"
      @ApplyFilter="ApplyFilter"
      @Cancel_Filter="CancelFilter"
      @CloseEngineerFilterModal="showFilter = false"
    ></CustomerFocusFilterModal>

    <RefreshConfirmationModal
      :showDialog="showDialog"
      @Refresh_Confirmed="RefreshConfirmed"
      @Refresh_Canceled="RefreshCanceled"
    ></RefreshConfirmationModal>

    <CustomerFocusProfileModal
    :showCustomerFocusProfileDialog="showCustomerFocusProfileDialog"
    @Close-Profile-Modal="CloseCustomerFucosProfileModal"

    >
    </CustomerFocusProfileModal>

      <LoadingModal
        :showLoading="showLoading"      
        :message="messageforloading"       
      >
      </LoadingModal>

    <ul v-show="loaded === true">
      <li style="float: left">
        <a>Customer Focus Center {{ title }}</a>
      </li>

    <li   v-if="userrole >=4"
      style="float: right"
      @click="ShowCustomerFucosProfileModal"
    >
       <a><i class="fas fa-cog"></i></a>
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

      <li
        style="float: right;"
        v-bind:class="{
          filter_applied: filterApplied === true,
          filter_canceled: filterApplied === false,
        }"
        @click="showFilter = true"
      >
        <a><i class="fas fa-filter" title="Filter PODs"></i> </a>
      </li>

      <li   v-show="filterApplied"  
      style="float: right"
     class=cahrtfilter_applied
      @click="CancelFilter"
    >
      <a>[{{pod_Filters_Description}}]    <i class="fas fa-eraser"></i></a>
    </li>  
    </ul>
  
<div v-show="ErrorRaised"
            style="
              display: inline-block;
              margin: 50px;            
              padding-top: 5px;

            "
          >
            <label style="top: 5px" 
            :class="{
        switch_black: appstylemode === 'DEFAULT',
        switch_white: appstylemode === 'DARK',
      }"
              >Your customer focus profile is not configured. Please click the setting to configure the customer focus profile </label
            >
          </div>
  <!-- action card setting -->
  <div style="background-color:black" v-show="loaded === true && ErrorRaised !== true">
          <div class="clr"></div>
          <div
            style="
              display: inline-block;
              margin: 5px;
              float: left;
              padding-left: 30px;
            "
          >
            <label class="switch">
              <input
                type="checkbox"
                v-model="professionalCustomerEnabled"
                :value="true"
                name="professionalCustomerEnabled"
                @click="SwitchCustomers"
              />
              <span class="slider round"></span>
            </label>
          </div>

          <div
            style="
              display: inline-block;
              margin: 5px;
              float: left;
              padding-top: 5px;
            "
          >
            <label style="top: 5px" 
            :class="{
        switch_black: appstylemode === 'DEFAULT',
        switch_white: appstylemode === 'DARK',
      }"
              >PROFESSIONAL FOCUSED CUSTOMERS</label
            >
          </div>
           <!-- action card setting end-->
    </div>
    <div style="clear: both"></div>

    <CustomerFocusCards 
      v-show="loaded === true"
      :focuses="focuses"
      @open-Cases-List="openCaseList"
      :card_Hovered="card_Hovered"
      @CardMouseOver="Card_Mouse_Over"
      @CardMouseLeave="Card_Mouse_Leave"
    ></CustomerFocusCards>
    <div style="clear: both"></div>
    <div v-show="showChart" style="margin-top: 5px">
      <ChartStackedBarByEngineer
        :chartData="dataset_chart_bar_assignment"
        :height="146.5"
      ></ChartStackedBarByEngineer>
      <ChartPieByPod
        :chartData="dataset_chart_pie_by_pod"
        :height="70.99"
      ></ChartPieByPod>
      <ChartPieByStatus
        :chartData="dataset_chart_pie_by_status"
        :height="70.99"
      ></ChartPieByStatus>
      <ChartPieByIcM
        :chartData="dataset_chart_pie_by_icm"
        :height="70.99"
      ></ChartPieByIcM>

      <div style="clear: both"></div>
      <Servicetickets
        style="margin-top: 5px"
        v-show="serviceTickets.length !== 0"
        :servicetickets="serviceTickets"
        :title="title_serviceTickets"
        :appstylemode="appstylemode"
        :hovered="hovered"
        @MouseOver="Mouse_Over"
        @MouseLeave="Mouse_Leave"
      />
    </div>
  </div>
  <div style="clear: both"></div>
  <Footer :appstylemode="appstylemode" />
</template>
<script>
import {
  WebAPI_Helper,
  GetSettingFromLocalStorage,
  SaveSettingToLocalStorage,
  SaveSettingToSessionStorage,
  GetSettingFromSessionStorage,
  GetAppStyleMode,
  Shuffle,
  
} from "../common.js";

import CustomerFocusCards from "./CustomerFocusCards.vue";
import Footer from "../components/layout/Footer";

//site nav
import SiteNav from "../components/SiteNav";
import RefreshConfirmationModal from "./RefreshConfirmationModal";
import Servicetickets from "../components/ServiceTickets.vue";

import ChartPieByStatus from "./ChartPieByStatus.vue";
import ChartPieByIcM from "./ChartPieByIcM.vue";
import ChartPieByPod from "./ChartPieByPod.vue";
import ChartStackedBarByEngineer from "./ChartStackedBarByEngineer";

import CustomerFocusFilterModal from "./CustomerFocusFilterModal";
import LoadingModal from "./LoadingModal";
import CustomerFocusProfileModal from "./CustomerFocusProfileModal"

import { Buffer } from "buffer";

export default {
  name: "CustomerFocusCenter",
  components: {
    CustomerFocusCards,
    SiteNav,
    Footer,
    // ChartPieByResource,
    RefreshConfirmationModal,
    Servicetickets,
    ChartPieByStatus,
    ChartPieByIcM,
    ChartPieByPod,
    ChartStackedBarByEngineer,
    CustomerFocusFilterModal,
    LoadingModal,
    CustomerFocusProfileModal,
  },

  data() {
    return {
      siteNivBar_expanded: "false",
      loaded: false,
      appstylemode: "DEFAULT",
      focuses: [],
      backup_focuses:[],
      latestFreshTime: "",
      serviceTickets: [],
      title_serviceTickets: "",
      showChart: false,

      showLoading:false,

      showDialog: false,
      chartLoaded: false,
      userrole:1,

      showCustomerFocusProfileDialog:false,

     
      showFilter: false,
      filterApplied: false,

      pod_Filters_Description:"",

      professionalCustomerEnabled:"false",

      //Hovered on cases
      hovered: false,
      card_Hovered: false,

      profile:{},

      title: "",

      messageforloading:"",

      pods_chosen: "All",

      //dataset for piechar by region
      dataset_chart_pie_by_status: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

      //dataset for piechar by status
      dataset_chart_pie_by_pod: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

      //dataset for piechar by icm
      dataset_chart_pie_by_icm: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },

      //dataset for barchat of backlog by engineer
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

      //dataset for stacked barchat of assignment
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
    };
  },

  async created() {
    this.loaded = false;
    this.showChart = false;

      this.userrole= GetSettingFromSessionStorage("userrole") === null? await WebAPI_Helper("get","currentuserrole",null):parseInt(GetSettingFromSessionStorage("userrole")); 
   SaveSettingToSessionStorage("userrole",this.userrole);


    //set resource status menu as selected item
    SaveSettingToSessionStorage("selectedMenu", "7");

    this.siteNivBar_expanded =
      GetSettingFromLocalStorage("siteNivBar_expanded") !== null
        ? GetSettingFromLocalStorage("siteNivBar_expanded")
        : "false";
    this.appstylemode =
      GetSettingFromLocalStorage("AppMode") === null
        ? "DARK"
        : GetSettingFromLocalStorage("AppMode");


   this.profile = await WebAPI_Helper("get","mycustomerfocusprofile",null);
    if(this.profile === null) {
      this.ErrorRaised = true;   
      this.loaded = true;
      return;
    }

    this.latestFreshTime = await this.GetFreshTime();

    const pods_chosen_forcustomerfocus = JSON.parse(
      GetSettingFromLocalStorage("pods_chosen_forcustomerfocus")
    );

   

    if (pods_chosen_forcustomerfocus !== null) {
      this.filterApplied = true;     
      this.ApplyFilter(pods_chosen_forcustomerfocus);
    } else {
      this.backup_focuses =  await this.CustomerFocuses();
      this.focuses = this.backup_focuses.filter( focus => focus.ServiceLevel ==='Premier');

    }
    this.pods = await this.podsofcustomerfocuses();

    const professionalCustomerEnabled = GetSettingFromLocalStorage("professionalCustomerEnabled"); 
    this.professionalCustomerEnabled = professionalCustomerEnabled !== null?  professionalCustomerEnabled ==='true'||professionalCustomerEnabled ===true : false;

    this.ServiceLevelFitler_Initial_Load();

    this.loaded = true;
  },

  methods: {
    Mouse_Over() {
      this.hovered = true;
      this.appstylemode = GetAppStyleMode();
    },

    Mouse_Leave() {
      this.hovered = false;
      this.appstylemode = GetAppStyleMode();
    },

    Card_Mouse_Over() {
      this.card_Hovered = true;
    },

    Card_Mouse_Leave() {
      this.card_Hovered = false;
    },

      setTickWhenLoading() {
      this.messageforloading +="..";
    },

    ShowCustomerFucosProfileModal() { 
    
      this.showCustomerFocusProfileDialog = true;
    },

   CloseCustomerFucosProfileModal(){   
    this.showCustomerFocusProfileDialog = false;
    },

 
    ServiceLevelFitler_Initial_Load(){
      if(this.professionalCustomerEnabled)
      this.focuses = this.backup_focuses.filter( focus => focus.ServiceLevel ==='Professional');     
    else
      this.focuses = this.backup_focuses.filter( focus => focus.ServiceLevel ==='Premier');    
    },

    SwitchCustomers() {
        if(this.professionalCustomerEnabled === true) {
            this.focuses = this.backup_focuses.filter( focus => focus.ServiceLevel ==='Premier');
            SaveSettingToLocalStorage("professionalCustomerEnabled","false");
        } else {
            this.focuses = this.backup_focuses.filter( focus => focus.ServiceLevel ==='Professional');
            SaveSettingToLocalStorage("professionalCustomerEnabled","true");
        }

        this.showChart = false;

    },

    async GetFreshTime() {
      return await WebAPI_Helper("get", "latestfreshtime(customerfocus)");
    },

    async serviceticketsoffocus(focus) {
      return await WebAPI_Helper(
        "get",
        "serviceticketsoffocus/customer/" +
          Buffer.from(focus.Customer) +
          "/servicelevel/" +
          focus.ServiceLevel +
          "/pods/" +
          this.pods_chosen
      );
    },

    async podsofcustomerfocuses() {
      return await WebAPI_Helper("get", "podsofcustomerfocuses");
    },

   async CloseFilterModal() {     
      this.showFilter = false;
    },

    async CancelFilter() {
      window.localStorage.removeItem("pods_chosen_forcustomerfocus");

      this.focuses = this.backup_focuses= await this.CustomerFocuses();
      this.showFilter = false;
      this.filterApplied = false;
      this.showChart = false;
      this.pods_chosen = "All";
      this.pod_Filters_Description = "";
      this.ServiceLevelFitler_Initial_Load();
    },

    async ApplyFilter(pods_chosen) {
      this.pods_chosen = pods_chosen;
      SaveSettingToLocalStorage(
        "pods_chosen_forcustomerfocus",
        JSON.stringify(pods_chosen)
      );
      this.backup_focuses = await this.CustomerFocusesForPods(pods_chosen);  
     this.ServiceLevelFitler_Initial_Load();

      this.showFilter = false;
      this.filterApplied = true;
      this.pod_Filters_Description = "PODS In (' "+ pods_chosen +" ')";
      this.showChart = false;
    },

    async openCaseList(focus) {
      this.showLoading = true ;// show loading modal
      this.messageforloading= "Loading data in process. Please feel free to enjoy your coffee now  <i class='fas fa-mug-hot'></i> ...";
      let loadingMessageInterval= setInterval(this.setTickWhenLoading,1000)

      this.showChart = false;
      this.title = " [ " + focus.Customer + " ]";
      this.serviceTickets = await this.serviceticketsoffocus(focus);
      this.title_serviceTickets =
        " SERVICE TICKETS WITHIN PAST 7 DAYS RAISED BY " + focus.Customer;

      this.Generate_Dataset_For_Charts();
      this.showChart = true;
      this.showLoading = false; // hide loading modal once done. 
      clearInterval(loadingMessageInterval); //release interval
    },

    // calculate how many cases assigned for each engineeer
    Prehandling_Assignment(assignments) {
      let engineers_assignment_array = [];

      let count = 0;
      let labels_pod = [];
      let Number_pod = [];

      assignments.forEach((assignment) => {
        let sr_caseowner = assignment.sr_caseowner;
        let item_found = undefined;
        item_found = engineers_assignment_array.find(
          (item) => item.sr_caseowner === sr_caseowner
        );

        //initial labels for pod
        let pod = assignment.sr_support_pod;

        //insert to labels_pod
        if (labels_pod.find((element) => element === pod) === undefined) {
          labels_pod = [...labels_pod, pod];
          Number_pod.push(0);
        }

        // find an existing item
        if (item_found !== undefined) {
          item_found.assigned_number += 1;
          count++;
        }
        //didn't find an item from engineers_assignment_array
        else {
          let item = { sr_caseowner: sr_caseowner, assigned_number: 1 };
          engineers_assignment_array.push(item);
        }
      });

      //rank it

      engineers_assignment_array = engineers_assignment_array.sort(
        (a, b) => a.assigned_number - b.assigned_number
      );

      this.assignment_number_after_cleanup = count;
      return {
        enginees_assignment_statistics: engineers_assignment_array,
        pods_of_assignment: labels_pod,
        Number_pod: Number_pod,
      };
    },

    Generate_Dataset_For_Charts() {
      const servicetickets = this.serviceTickets;
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

      // Variables for piechart of icm status
      let Number_IcMRaised = 0;
      let Number_NoIcM = 0;

      // Variables for piechart by pod
      let labels_pod = [];
      let Number_pod = []; // An array to store the number of each pod

      // Variables for piechart by status
      let labels_status = [];
      let Number_status = [];
   
      //Generate assignment statiscis before generating stacked dataset
      let labels_assignment_alias = []; // the labels of assignment, which should be engineers alias
      let engineers_assignment_statistics = []; // The assignment statistics after cleanup.

      //The purpose of this API is to summarize the assignment count per each engineer , then we sort it by count in ascend.
      let assignment_statistics = this.Prehandling_Assignment(servicetickets);

      engineers_assignment_statistics =
        assignment_statistics.enginees_assignment_statistics;
      labels_pod = assignment_statistics.pods_of_assignment; // Labels of POD after cleanup
      Number_pod = assignment_statistics.Number_pod; // Number of Pod after cleanup.

      // engineers_assignment_statistics is the statistics order by assigned number.
      engineers_assignment_statistics.forEach((assignment_statistics) => {
        let sr_caseowner = assignment_statistics.sr_caseowner;
        labels_assignment_alias.push(sr_caseowner); // We generate the alias lable order by assigned cases ascend.
      });

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
      servicetickets.forEach((assignment) => {
        //generated the stacked dataset for assignment based on pod
        let pod = assignment.sr_support_pod;
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
      });

      this.dataset_chart_bar_assignment.labels = labels_assignment_alias;
      this.dataset_chart_bar_assignment.datasets = stacked_dataset_chart_bar;

      // stacked dataset end

      for (let i = 0; i < servicetickets.length; i++) {
        //Initial labels for pod

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


      for (let i = 0; i < servicetickets.length; i++) {
        let serviceticket = servicetickets[i];
        // let sr_owner = serviceticket.sr_caseowner;
        // let sr_number = serviceticket.sr_number;
        let status = serviceticket.sr_status;
        let sr_icm = serviceticket.sr_icm;
        // let sr_record_guid = serviceticket.sr_record_guid;

        let temp_index;


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

        //end
      }

      //generate dataset for piechart by icm raised or not
      let data_icm = [];
      let background_icm = [];
      let datasets_icm = [];
      let dataitem_icm = {};

      this.dataset_chart_pie_by_icm.labels = [
        "Cases with IcM Raised",
        "Cases without IcM",
      ];

      data_icm = [Number_IcMRaised, Number_NoIcM];
      background_icm = ["#880e4f", "darkgray"];

      dataitem_icm.data = data_icm;
      dataitem_icm.backgroundColor = background_icm;
      datasets_icm = [...datasets_icm, dataitem_icm];

      this.dataset_chart_pie_by_icm.datasets = datasets_icm;
      //end

      //generate dataset for pie chart by pod 
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

    async CustomerFocuses() {
      const data = WebAPI_Helper("get", "customerfocuses", null);

      return data;
    },

    async getsetting() {
      return await WebAPI_Helper("get", "getsetting", null);
    },

    async CustomerFocusesForPods(pods_chosen) {
      return await WebAPI_Helper(
        "get",
        "customerfocusesforpods/pods/" + pods_chosen,
        null
      );
    },

    CleanCache() {
      this.showDialog = true;
    },

    RefreshConfirmed() {
      this.showDialog = false;
      WebAPI_Helper("get", "cleancache(customerfocus)", null);
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
  margin-top: 20px;
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

