<template>
  <div style="margin: 5px">
    <form @submit="onSubmit">
      <div style="height: 20px; margin: 0px auto"></div>
      <div
        style="height: 90px; width: 50%; margin: 0px auto"
        :class="{
          bg_default: istrendingissue !== true,
          bg_trendingissue: istrendingissue === true,
        }"
      >
        <p
          v-html="Header_Title"
          style="
            font-size: 50px;
            color: white;
            text-align: center;
            font-family: Segoe UI;
            font-weight: lighter;
          "
        ></p>
      </div>
      <div id="textcontainer">
        <div>
          <textarea
            rows="50"
            cols="60"
            v-model="comments"
            name="comments"
            @change="HandleChange()"
            placeholder="Adding review comment is disabled. To  review the case , please open the DFM case directly and add a review note"
            :readonly="comment_disable"
          ></textarea>
        </div>

        <div id="notifyemail_container" style="margin: 0px auto">
          <!-- <div class="tooltip" style="display: inline-block; margin: 10px; float: left">
            <label class="container"
              > <i class="fas fa-envelope"></i> Send Notification Email
              <input
                type="checkbox"
                v-model="sendemail"
                value="1"
                name="sendemail"
              />
              <span class="checkmark"></span>
              <span class="tooltiptext" style="width:250%;">Send the comment to corresponding recepient for notification purpose</span>
            </label>
          </div> -->

          <!-- new line -->
          <div class="clr"></div>

          <div
            class="tooltip"
            style="display: inline-block; margin: 10px; float: left"
          >
            <table>
              <!--email notificaton-->
              <tr>
                <td style="width: 98%;height:30px">
                  <div style="display: inline-block; float: left">
                    <label class="switch" style="display: inline-block">
                      <input type="checkbox" v-model="sendemail" />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div
                    style="display: inline-block; float: left; padding-top: 5px"
                  >
                    &nbsp; &nbsp;<label>
                      <i class="fas fa-handshake"></i> Send Notification
                      Email</label
                    >
                  </div>
                </td>
              </tr>        


              <tr
                v-if="
                  review_history === null ||
                  review_history.latest_review_type !== 10
                "
              >
                <td style="width: 98%;height:30px">
                  <div style="display: inline-block; float: left">
                    <label class="switch" style="display: inline-block">
                      <input
                        type="checkbox"
                        v-model="backupRequired"
                        @click="BackUpClicked"
                      />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div
                    style="display: inline-block; float: left; padding-top: 5px"
                  >
                    &nbsp; &nbsp;<label>
                      <i class="fas fa-handshake"></i> Need Backup Engineer
                      During My Leave</label
                    >
                  </div>
                </td>
              </tr>

              <tr
                v-if="
                  review_history !== null &&
                  review_history.latest_review_type === 10
                "
              >
                <td style="width: 98%">
                  <div style="display: inline-block; float: left">
                    <label class="switch" style="display: inline-block">
                      <input
                        type="checkbox"
                        v-model="backupCompleted"
                        @click="BackUpCompletedClicked"
                      />
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div
                    style="display: inline-block; float: left; padding-top: 5px"
                  >
                    &nbsp; &nbsp;<label>
                      <i class="fas fa-handshake-slash"></i> Complete Backup
                      Task</label
                    >
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- new line -->
          <div class="clr"></div>

          <div  class="tooltip"  style="display: inline-block; margin-left: 10px; float: left">
            <label class="switch" style="display: inline-block">             
              <input
                type="checkbox"
                v-model="istrendingissue"
                value="0"
                name="istrendingissue"
              />
              <span class="slider round"></span>        
             
            </label>
          </div>
          <div   style="display: inline-block; float: left; padding-top: 5px">
                    &nbsp; &nbsp;<label>
                      <i class="fas fa-chart-line"></i>Report it as trending issue</label>
           </div>

          <div class="input-w" v-show="istrendingissue">
            <label>IcM ID</label
            ><input
              style="width: 15%"
              placeholder="Leave it empty if you don't have"
              type="text"
              v-model="associatedicm_for_trendingissue"
              name="associatedicm_for_trendingissue"
            />
            <label>Bug URL</label
            ><input
              style="width: 40%"
              placeholder="Leave it empty if you don't have"
              v-model="associatedbug_for_trendingissue"
              name="associatedbug_for_trendingissue"
            />
          </div>

          <!-- new line -->
          <div class="clr"></div>
        </div>

        <div id="cpe_container" style="margin: 0px auto">
          <div style="display: inline-block; margin: 10px; float: left">
            <label class="container">
              <i class="fas fa-smile"></i> Low CPE Risk
              <input
                type="radio"
                v-model="cpe_assessment"
                value="1"
                checked="checked"
                name="cpe"
              />
              <span class="checkmark"></span>
            </label>
          </div>

          <div style="display: inline-block; margin: 10px; float: left">
            <label class="container">
              <i class="fas fa-meh"></i> Neutral CPE Risk
              <input
                type="radio"
                v-model="cpe_assessment"
                value="2"
                name="cpe"
              />
              <span class="checkmark"></span>
            </label>
          </div>

          <div style="display: inline-block; margin: 10px; float: left">
            <label class="container">
              <i class="fas fa-frown"></i> High CPE Risk
              <input
                type="radio"
                v-model="cpe_assessment"
                value="3"
                name="cpe"
              />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>

        <!-- new line -->
        <div class="clr"></div>

        <!--need mce-->
        <div
          id="needmce_continer"
          style="margin: 0px auto"
          v-show="
            sr_owner === review_owner &&
            cpe_assessment >= 2 &&
            istrendingissue !== true
          "
        >
          <div style="display: inline-block; margin: 10px; float: left">
            <label class="container">
              <i class="fas fa-phone-alt"></i> Need Customer Recovery Before
              Case Closure
              <input
                type="checkbox"
                v-model="needmce"
                value="1"
                name="needmce"
                @click="ClearJob_Once_NeedMCE"
              />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>

        <!-- new line -->
        <div class="clr"></div>

        <!--mce is done-->
        <div
          id="mcedone_continer"
          style="margin: 0px auto"
          v-show="
            sr_owner !== review_owner && (mce_status === 1 || mce_status === 2)
          "
        >
          <div style="display: inline-block; margin: 10px; float: left">
            <label class="container">
              <i class="fas fa-phone-slash"></i> Customer Recovery Has Been
              Completed
              <input
                type="checkbox"
                v-model="mcedone"
                value="1"
                name="mcedone"
                @click="ClearJob_Once_MCEDone"
              />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>

        <!-- new line -->
        <div class="clr"></div>

        <div>
          <!-- <input type='submit' class='comment_button' value='SAVE COMMENTS'/> -->
          <button
            id="savebutton"
            type="submit"
            class="comment_button"
            v-bind:class="{
              disabled: submit_disable === true,
              enabled: submit_disabled === false,
            }"
          >
            <i class="fas fa-save"></i> {{ button_text }}
          </button>
          <button
            type="button"
            class="cancel_button"
            @click="$emit('cancel_comment')"
          >
            <i class="fas fa-backspace"></i> CANCEL
          </button>
        </div>
      </div>
    </form>

    <div style="margin: 0px auto; width: 100%" v-show="showFilter">
      <BackupEngineerSelectionModal
        :engineers="engineers"
        :showDialog="showFilter"
        :EngineersFilterModalTitle="EngineersFilterModalTitle"
        @Choose_Confirmed="Choose_Confirmed"
        @Choose_Canceled="Choose_Canceled"
      ></BackupEngineerSelectionModal>
    </div>
  </div>
</template>

<script>
import { GetSettingFromSessionStorage, GetSettingFromLocalStorage,WebAPI_Helper } from "../common.js";

import BackupEngineerSelectionModal from "./BackupEngineerSelectionModal";

export default {
  name: "AddReview",
  props: ["sr_number", "sr_owner", "sr_age"],
  components: {
    BackupEngineerSelectionModal,
  },

  data() {
    return {
      comments: "",
      submit_disable: true,
      comment_disable: false,
      cpe_assessment: "1",
      sendemail: false,
      needmce: false,
      review_owner: "",
      mcedone: false,
      mce_status: 0,

      //button Text
      button_text: "SAVE COMMENTS",

      //header text
      header_text: "",
      //trending issue
      istrendingissue: false,

      //backup needed:
      backupRequired: false,

      //backupCompleted
      backupCompleted: false,

      //review history
      review_history: {},

      //backup engineer:
      backupEngineer: "",

      //show backup engineer filter
      showFilter: false,

      //icm for trending issue
      associatedicm_for_trendingissue: "",

      //bug for trending issue
      associatedbug_for_trendingissue: "",
    };
  },

  computed: {
    Header_Title: function () {
      const sr_owner = this.$props.sr_owner;

      if (this.review_owner !== sr_owner && this.istrendingissue === false) {
        return " <i class='fas fa-user-friends'></i> &nbsp;  Peer  Review";
      } else if (
        this.review_owner === sr_owner &&
        this.istrendingissue === false
      ) {
        return " <i class='fas fa-user-check'></i> &nbsp;  Self  Review";
      } else
        return "<i class='fas fa-chart-line'></i> &nbsp;  Trending Issue Report";
    },
  },

  watch: {
    comments(newcomment) {
      if (newcomment != "") this.submit_disable = false;
      else this.submit_disable = true;
    },

    needmce(new_needmce) {
      if (new_needmce == true) {
        this.comments = "Customer recovery is needed";
        this.comment_disable = true;
      } else {
        this.comments = "";
        this.comment_disable = false;
      }
    },

    cpe_assessment(new_cpeassessment) {
      if (new_cpeassessment === "1") {
        // low cpe risk, then enable comments.
        this.comments = "";
        this.comment_disable = false;
        this.needmce = false;
      }
    },

    istrendingissue(new_istrendingissue) {
      if (new_istrendingissue === true) {
        this.comment_disable = false;

        this.header_text = "Trending Issue Report";
        this.button_text = "REPORT TRENDING ISSUE";
        this.comments =
          "Symptom\n=======\n\n\nMitigation | Workaround\n=======\n\n\nCurrent Status\n=======\n\n\n";

        // email track set as true
        this.sendemail = true;
      } else {
        this.comment_disable = true;
        this.comments = this.comments =
          "You have a case review note by " +
          this.review_owner +
          ". Please check your case note to get more review details.";
      }
    },
  },

  async created() {
    this.review_owner = GetSettingFromSessionStorage("whoami");
    console.log("current review is " + this.review_owner);
    this.button_text = "SAVE COMMENTS";
    this.InitButtonandHeader();

    //disable sumbit button
    this.submit_disable = true;

    this.sendemail = false;
    this.mcedone = false;

    // add comment disabled interntinally due to compliance issue.
    this.comment_disable = true;
    this.comments =
      "You have a case review note by " +
      this.review_owner +
      ". Please check your case note to get more review details.";

    //get mce status
    this.review_history = await this.fetch_review_history(
      this.$props.sr_number
    );
    this.mce_status =
      this.review_history === null || this.review_history.mce_status === null
        ? 0
        : this.review_history.mce_status;
  },

  methods: {
    async InitButtonandHeader() {
      this.button_text = "SAVE COMMENTS";
      this.comments = "";
    },

    async fetch_review_history(sr_number) {
      const res = await fetch("api/reviewhistory/sr_number/" + sr_number);
      const review_history = await res.json();
      if (review_history !== null) return review_history[0];
      else return null;
    },

    async ToggleTrendingIssue() {
      console.log(this.istrendingissue);
      if (this.istrendingissue === false) {
        this.header_text = "Trending Issue Report";
        this.button_text = "REPORT TRENDING ISSUE";
        this.comments =
          "Symptom\n=======\n\n\nMitigation | Workaround\n=======\n\n\nCurrent Status\n=======\n\n\n";

        // email track set as true
        this.sendemail = true;
      } else this.InitButtonandHeader();
    },

    async reportingm1manager(whoami) {
      return WebAPI_Helper("get", "reportingm1manager(" + whoami + ")");
    },

 

    async BackUpClicked() {
      if (this.backupRequired === false) {
        //before click it's false;
        let cachedteamforservicetickets;
      if (this.userrole >= 2) {        
          cachedteamforservicetickets = GetSettingFromLocalStorage(
            "cachedteamforservicetickets"
          );
        }
       else {
        cachedteamforservicetickets = await this.reportingm1manager(
          GetSettingFromSessionStorage("whoami")
        );      
      }
        this.engineers = await WebAPI_Helper("get", "teammembers("+cachedteamforservicetickets+")", null);
        this.showFilter = true;
      }
    },

    BackUpCompletedClicked() {
      this.comments = "Case Backup Completed by " + this.review_owner;
      this.backupCompleted = true;
    },

    Choose_Confirmed(backup_engineer_chosen) {
      this.backupEngineer = backup_engineer_chosen;
      this.comments =
        "Case will be backup by " +
        this.backupEngineer +
        " requested by " +
        this.review_owner;
      this.showFilter = false;
    },

    Choose_Canceled() {
      this.showFilter = false;
    },

    ClearJob_Once_NeedMCE() {
      //this.needmce is the status before he click the checkbox
      if (!this.needmce) {
        // if Need MCE is set, then we never track to dfm

        this.sendemail = true;
      }
    },

    ClearJob_Once_MCEDone() {
      if (!this.mcedone) {
        this.comments = "customer recovery completed.";
        this.comment_disable = true;
        this.sendemail = true;
      } else {
        this.comment_disable = false;
      }
    },

    HandleChange() {
      if (this.comments === "") this.submit_disable = true;
      else this.submit_disable = false;
    },

    BackToCase() {
      this.$router.go(-1);
    },

    onSubmit(e) {
      e.preventDefault();

      if (this.comments == "") return;

      this.review_owner = GetSettingFromSessionStorage("whoami");
      console.log(this.review_owner);

      let emailstatus = this.sendemail === true ? true : false;

      let newreview = {
        id: Math.floor(Math.random() * 65585),
        comments: this.comments, //.replaceAll("\n","<br>"),
        sr_number: this.$props.sr_number,
        reviewed_on: new Date().toISOString(),
        reviewed_by: this.review_owner,
        cpe_assessment: this.cpe_assessment,
        email_sent: emailstatus,
        sr_owner: this.$props.sr_owner,
        needmce: this.cpe_assessment === "1" ? false : this.needmce,
        mcedone: this.mcedone,
        sr_age: this.$props.sr_age,
        case_backup_owner: this.backupEngineer,
        istrendingissue: this.istrendingissue,
        associatedicm_for_trendingissue:
          this.associatedicm_for_trendingissue.trim(),
        associatedbug_for_trendingissue:
          this.associatedbug_for_trendingissue.trim(),
      };

      if (this.istrendingissue === true) {
        newreview.reviewtype = 8; // type 8 is for trending issue reporting.
      } else if (this.backupRequired === true) {
        // backup request
        newreview.reviewtype = 10;
      } else if (this.backupCompleted === true) {
        // backup completed
        newreview.reviewtype = 11;
      } else if (this.review_owner === this.sr_owner) {
        if (newreview.needmce === false)
          // MCE is not choose, then it's normal self review
          newreview.reviewtype = 1;
        else newreview.reviewtype = 3; // MCE request
      } else if (this.review_owner !== this.sr_owner) {
        if (newreview.mcedone === true) newreview.reviewtype = 5;
        // MCE done
        else newreview.reviewtype = 2; // Peer Review
      }

      //send up to parent
      this.$emit("add-review", newreview);
      this.comments = "";
    },
  },
};
</script>

<style scoped>
#textcontainer {
  background-color: lightgray;
  margin: 0px auto;
  width: 50%;
  padding: 10px;
}

.input-w label {
  float: none;
  display: inline-block;
  vertical-align: middle;
  padding: 5px;
  font-size: 14px;
}

.input-w input {
  float: none;
  display: inline-block;
  vertical-align: middle;
  height: 30px;
  margin-left: 5px;
  margin-left: 10px;
  padding: 5px;
  font-size: 14px;
  /* width:30% */
}

.clr {
  clear: both;
}

.bg_default {
  background-color: #064522;
}

.bg_trendingissue {
  background-color: darkred;
}

.comment_button {
  width: 40%;
  background-color: green;
  height: 40px;
  padding: 5px;
  text-align: center;
  border: 0px;
  cursor: pointer;
  margin: 5px;
  color: white;
}

.disabled {
  background-color: gray;
}

.enabled {
  background-color: green;
}

.cancel_button {
  width: 40%;
  background-color: gray;
  height: 40px;
  padding: 5px;
  text-align: center;
  border: 0px;
  cursor: pointer;
  margin: 5px;
  color: white;
}

textarea {
  width: 100%;
  height: 200px;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  border: 1px solid black;
  padding: 5px;
}

/*custom radio button */

/* The container */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 1em;
  text-align: left;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default radio button */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 50%;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196f3;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container .checkmark:after {
  top: 9px;
  left: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

/*tooltip*/

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: rgb(131, 136, 131);
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
  border-color: transparent rgb(147, 155, 147) transparent transparent;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
}

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 0px dotted rgb(131, 136, 131);
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  animation: 2s fadeIn;
}

/* style fo radio button */

/*Modal style*/
.dialog_mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
}

.dialog_container {
  background: #fff;
  /* width: 300px;
    height: 120px;
    position: absolute;
    border-radius: 10px;
    margin: 0 auto; */

  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  animation: 0.5s fadeIn;
}

.dialog_content {
  text-align: center;
  /* padding-top: 30px; */
}

.dialog_btn {
  margin-top: 20px;
}

.dialog_btn a {
  background: yellow;
  padding: 2px 30px;
  border-radius: 5px;
  color: #fff;
  text-decoration: none;
  width: 50px;
  display: inline-block;
}

.dialog_btn a:nth-child(2) {
  margin-left: 20px;
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
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
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