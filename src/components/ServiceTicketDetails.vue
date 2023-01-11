<template>
  <div class="serviceticket-details card" v-if="no_case === true">
    <p>
      <i
        class="fas fa-exclamation-triangle"
        style="font-size: 3em; color: darkred; margin-top: 20px"
      ></i>
    </p>
    <p
      style="
        font-size: 1em;
        font-color: black;
        text-align: center;
        padding: 20px;
        margin: 20px;
      "
    >
      You are not allowed to review the review history of this case, or no case found with case ID : {{ sr_number }}
    </p>
    <button
      class="button"
      style="background-color: orange; color: white; margin: 20px; width: 35%"
      @click="BackToDashboard"
    >
      <i class="fas fa-arrow-circle-left"></i> BACK TO DASHBOARD
    </button>
  </div>

  <div v-if="no_case !== true">
    <div class="serviceticket-details card" v-show="!comment_enabled">
      <!--hide case details under adding review mode-->

      <img
        v-bind:src="image_url"
        class="card_image"
        style="float: left; margin-right: 20px"
      />
      <!-- <img src="../images/dynamics.jpg" class="card_image" style="float:left; margin-right:20px "/> -->
      <h3 class="card-container" style="text-transform: uppercase">
        <i class="fas fa-align-justify"></i> {{ case_details.sr_number }}
        <i class="far fa-clock"></i> {{ shortDate }}
        <i class="fas fa-history"></i> {{ case_details.sr_age }} DAYS
      </h3>

      <h3 class="card-container" style="text-transform: uppercase">
        <i class="far fa-id-badge"></i> {{ case_details.sr_caseowner }}
        <i class="fas fa-thermometer-quarter"></i> {{ case_details.sr_status }}
      </h3>

      <div class="card-container">
        <i class="fas fa-bullhorn"></i> " {{ case_details.sr_title }} "
      </div>
    </div>
    <button
      class="button"
      v-show="!comment_enabled"
      style="background-color: gray; color: white"
      @click="BackToDashboard"
    >
      <i class="fas fa-arrow-circle-left"></i> BACK TO DASHBOARD
    </button>
    <button
      class="button"
      v-show="!comment_enabled"
      style="background-color: #243a5e; color: white"
      @click="OpenCase"
    >
      <i class="fas fa-arrow-alt-circle-right"></i> OPEN CASE
    </button>

    <button
      class="button"
      v-show="!comment_enabled"
      style="background-color: green; color: white"
      @click="ToggleComment_Modal"
    >
      <i class="fas fa-edit"></i> ADD REVIEW COMMENTS
    </button>

    <AddReview
      v-bind:sr_number="case_details.sr_number"
      :showDialog="showDialog"
      v-bind:sr_owner="case_details.sr_caseowner"
      v-bind:sr_age="case_details.sr_age"
      v-show="comment_enabled"
      v-on:cancel_comment="cancelComment"
      v-on:add-review="addReview"
    />

    <Comments :comments="sortedComments()" />
    <Footer :appstylemode="appstylemode"/>
    
  </div>
</template>

<script>
import { GetSettingFromLocalStorage,GetSettingFromSessionStorage,GetAppStyleMode, WebAPI_Helper } from "../common.js";
import AddReview from "./AddReview.vue";
import Comments from "../components/Comments";

import Footer from "../components/layout/Footer";

export default {
  name: "ServiceTicketDetails",
 
  data() {
    return {
      sr_number: "",
      appstylemode:"DEFAULT",
      case_details: {},
      comments: [],
      image_url: "",
      comment_enabled: false,
      no_case: false,
    
    };
  },
  components: {
    Comments,
    AddReview,
    Footer,
  },



  async created() {

    this.appstylemode = GetAppStyleMode();
    
    document.title = this.$route.meta.title;

    this.case_details.sr_number = this.$route.query.sr_number;

    this.case_details.sr_createdon = "loading...";
    this.case_details.sr_title = "loading...";
    this.case_details.sr_caseowner = "loading...";
    this.case_details.sr_age = "loading...";
    this.case_details.sr_status = "loading...";


    this.case_details = await this.GetCaseDetails();  

    if(this.case_details === undefined ||  this.case_details.sr_number === undefined) {      
      this.sr_number =  this.$route.query.sr_number
      this.no_case = true
      return;  
    }

    //get the comments first
    this.comments = await this.fetch_review_comments(
      this.case_details.sr_number
    );

    //this.image_url = require("../images/" + this.case_details.sr_caseowner + ".jpg");
    
     this.image_url = "../img/" + this.case_details.sr_caseowner + ".jpg";
  },

  computed: {
    shortDate: function () {
      const datestring = this.case_details.sr_createdon;
      return datestring.slice(0, 9);
    },

    
  

  },

  methods: {
    async ToggleComment_Modal() {    
      this.case_details = await this.GetCaseDetails();     
      this.comment_enabled = !this.comment_enabled;
    },

  sortedComments() {
      this.comments.sort((a, b) => {
        return new Date(b.reviewed_on) - new Date(a.reviewed_on);
      });
      return this.comments;
    },

   async GetCaseDetails () {
    //get service ticket
    let  cachedteamforservicetickets =  GetSettingFromLocalStorage("cachedteamforservicetickets") === null? GetSettingFromSessionStorage("teammanagers_alias").split(",")[0]:GetSettingFromLocalStorage("cachedteamforservicetickets"); 
      const returnedCase = await this.fetchServiceTicketByCaseID(this.case_details.sr_number,cachedteamforservicetickets);

    if (returnedCase === null || returnedCase === undefined) {
      this.no_case = true;
      return ;
    } else this.no_case = false;

    return returnedCase;
    },


    cancelComment() {
      this.comment_enabled = false;
    },

    BackToDashboard() {
      document.title = "Little Ant";
      this.$router.push("dashboard");
    },

    OpenCase() {
      window.open(
        "https://onesupport.crm.dynamics.com/main.aspx?appid=101acb62-8d00-eb11-a813-000d3a8b3117&forceUCI=1&pagetype=entityrecord&etn=incident&id=" +
          this.case_details.sr_record_guid +
          "&formid=33fb74b3-86ac-4db6-9904-2ad75648175b"
      );
    },

    async fetchServiceTicketByCaseID(caseId,teamalias) {
      const data = await WebAPI_Helper(
        "get",
        "serviceticket/caseid/" + caseId + "/teamalias/"+teamalias,
        null
      );
      if (data.length > 0) { 
        console.log('return data is ' +  data[0])
        return data[0];
      }
      else return null;
    },

    async NotifyEngineer(commentId) {
      WebAPI_Helper("get", "notifyengineer(" + commentId + ")", null);
    },

    async fetch_review_comments(sr_number) {
      const res = await fetch("api/reviews/sr_number/" + sr_number);
      const data = await res.json();

      return data;
    },

    async upsert_review_history(newreview) {
      let review_history_data = {
        sr_number: newreview.sr_number,
        id: Math.floor(Math.random() * 65585),
        mce_status: newreview.needmce === true ? 1 : 0,
        latest_cpe_assessment: newreview.cpe_assessment,
        latest_review_type:newreview.reviewtype
       

      };

      //update the is_trending_issue of review history
      if(newreview.reviewtype === 8 ) review_history_data.is_trending_issue = true

      //update backup owner
      else if(newreview.reviewtype === 10 ) review_history_data.case_backup_owner = newreview.case_backup_owner

      // set the proper mce status.
      if (newreview.mcedone) review_history_data.mce_status = 3; //2 means mce done;     

      WebAPI_Helper("POST", "upsertreviewhistory", review_history_data);
    },

    async addReview(newreview) {
      await WebAPI_Helper("POST", "addreview", newreview);

      this.upsert_review_history(newreview);
      this.comments = [...this.comments, newreview];
      //Sleep(1000);       
     
      console.log(this.comments);

      if (newreview.needmce || newreview.mcedone) {
        // for mce request, we never track to dfm.
        newreview.track_to_dfm = false;
      }

      if (newreview.email_sent === true) {
        //the feature of tracking to DFM is deprecated, but i will reserve the place holder, so pass tracktoDFM as false alwasys.
       
        this.NotifyEngineer(newreview.id);
        
         
      }

       //toggle the modal window
      this.comment_enabled = !this.comment_enabled;
    },
  },
};
</script>

<style>
.card {
  text-align: center;
  box-sizing: border-box;
  /* box-shadow:0 10px  16px 0 rgba(0,0,0,2), 0 6px 20px 0 rgba(0,0,0,19); */
  width: 42%;
}

.card-container {
  padding: 5px;
  text-align: left;
}

.card_image {
  border-radius: 50%;

  /* border: 5px #333 solid; */
  margin-bottom: 1rem;
  /* border-color: steelblue;
    background-color: steelblue;  */
}

.serviceticket-details {
  background-color: #f4f4f4;
  padding: 10px;
  border-bottom: 1px #ccc solid;
  margin: 40px auto;
  /* border-radius: 5px; */
}

.button {
  width: 15%;
  background-color: orange;
  height: 40px;
  padding: 5px;
  text-align: center;
  border: 0px;
  cursor: pointer;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 5px;
}
</style>
