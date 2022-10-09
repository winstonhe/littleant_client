<template id="dialog">


  <div class="dialog" v-if="showTeamProfileDialog">
    <div class="dialog_mask"></div>
    <div class="dialog_container">
      <div class="dialog_content">
        <div
          style="
            background-color: darkgray;
            height: 50px;
            width: 100%;
            margin: 0px auto;
          "
        >
          <p
            style="
              font-size: 30px;
              color: white;
              text-align: center;
              font-family: Segoe UI;
              font-weight: lighter;
            "
          >
            Team Profiles
          </p>
          <p
            style="
              font-size: 15px;
              color: white;
              font-family: Segoe UI;
              font-weight: lighter;
              position: absolute;
              right: 20px;
              top: 10px;
              cursor: pointer;
            "
            @click="$emit('Close_TeamProfile_Modal')"
          >
            <i class="fas fa-times"></i>
          </p>
        </div>

        <TeamProfiles 
        @Load-Default-Profile="LoadDefaultProfile" 
        @Open-Team-Profile="OpenTeamProfile" 
        :lastUpdatedtoProfiles="lastUpdatedtoProfiles" 
      
        >
        </TeamProfiles>
        <div>
           

          <table>
           <tr>
              <td style="width: 50%">
                <label class="container" style="display: inline-block">
                  Team Manager Alias
                </label>
                <input
                  type="text"               
                 
                  v-model="Manager_Nickname"
                  name="Manager_Nickname"
                />
              </td>

              

               <td>
                <label class="container" style="display: inline-block">
                  Group Lead Alias</label
                >
                <input
                  type="text"                 
                  v-model="grouplead_alias"
                  name="grouplead_alias"
                />
              </td>
             </tr>


            <tr>
              <td style="width: 50%">
                <label class="container" style="display: inline-block">
                  Technical Advisors List
                </label>
                <input
                  type="text"
                
                  v-model="TA_list"
                  name="TA_list"
                />
              </td>
              <td style="width: 50%">
                <label class="container" style="display: inline-block">
                  BCC List
                </label>
                <input
                  type="text"
               
                  v-model="Bcc_list"
                  name="Bcc_list"
                />
              </td>
            </tr>

            <tr>
              <td>
                <label class="container" style="display: inline-block">
                  MCE Approver List</label
                >
                <input
                  type="text"
                 
                  v-model="MCEApproval_List"
                  name="MCEApproval_List"
                />
              </td>

              <td>
                <label class="container" style="display: inline-block">
                 Threshold of Case Idle  In Days
                  </label
                >
                <input
                  type="text"
                
                  v-model="Idle_Threshold_In_Days"
                  name="Idle_Threshold_In_Days"
                />
              </td>
            </tr>

            <tr>
              <td>
                <label class="container" style="display: inline-block">
                  Interval of Idle Notification In Days
                </label>
                <input
                  type="text"
                
                  v-model="Interval_Idle_Notification_In_Days"
                  name="Interval_Idle_Notification_In_Days"
                />
              </td>
              <td>
                <label class="container" style="display: inline-block">
                  Threshold of High Case Backlog</label
                >
                <input
                  type="text"
                
                  v-model="Threshold_High_Backlog"
                  name="Threshold_High_Backlog"
                />
              </td>
            </tr>

            <tr>
              <td>
                <label class="container" style="display: inline-block">
                  Manager's Timezone Offset</label
                >
                <input
                  type="text"
                  placeholder="Eg: Just type -8 if manager's timezone if UTC - 8:00"
                  v-model="timezone_offset"
                  name="timezone_offset"                  
                />
              </td>
              <td>
                <label class="container" style="display: inline-block">
                  Threshold of Active Review Flag</label
                >
                <input
                  type="text"
                
                  v-model="Threshold_Active_Review"
                  name="Threshold_Active_Review"
                />
              </td>
            </tr>

            
            <tr>
              <td>
                <label class="container" style="display: inline-block">
                  Distribution Group For Trending Issue Notification</label
                >
                <input
                  type="text"
                  placeholder="Seperated by , for multiple DL"
                  v-model="DistributionGroupForTrendingIssue"
                  name="DistributionGroupForTrendingIssue"
                />
              </td>
             
            </tr>

         
          </table>

          

          <table>               
 <!--Engineer mode-->
            <tr>
              <td style="width:98%">
                <div style="display: inline-block; margin: 5px; float: left">
                  <label class="switch" style="display: inline-block">
                    <input
                      type="checkbox"
                      v-model="Enable_Engineer_Mode"
                      :value="true"
                    />
                    <span class="slider round"></span>
                  </label>
                </div>

                <div
                  style="display: inline-block; float: left; padding-top: 10px"
                >
                  <label>Enable Engineer Mode </label>
                </div>
              </td>
            </tr>   

            <tr v-show="
                Enable_Engineer_Mode === true || Enable_Engineer_Mode === 'true'
              ">
               <td style="width: 98%"  >
                <label class="container" style="display: inline-block"
                  >Engineers List
                </label>
                <input
                  type="text" 
                  style="width: 97.5%;"                    
                  v-model="Engineers_List"
                  name="Engineers_List"
                />
              </td>   
            </tr>    
  <!--Engineer mode end-->
          </table>
       

      
        
        </div>

        <!-- new line -->
        <div class="clr"></div>
        <div style="margin: 20px">
          <!-- <input type='submit' class='comment_button' value='SAVE COMMENTS'/> -->
          <button
            type="submit"
            class="applyfilter_button"
            @click="Save_Team_Profile"
             v-bind:class="{
              disabled: submit_disable === true,
              enabled: submit_disable === false,
            }"
          >
          <i class="fas fa-save"></i> SAVE
          </button>
          <button
            type="button"
            class="cancel_button"
            @click="$emit('Close_TeamProfile_Modal')"
          >
            <i class="fas fa-times"></i> CANCEL
          </button>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import { WebAPI_Helper, Sleep} from "../common.js";
import TeamProfiles from "./TeamProfiles.vue";



export default {
  name: "TeamProfilesModal",
  props: ["showTeamProfileDialog", "modalTitle"],
  components: { TeamProfiles},

  data() {
    return {

      card_Hovered: false,

      TA_list: null, // TA list for this team profile
      Bcc_list: null, //BCC list which will be BCC for notificaiton email like idle , mce
      MCEApproval_List: null, // MCE approver list for this team

      Engineers_List: null, // engineers list once engineer_mode is enaled.
      Enable_Engineer_Mode: false, // switch to enable engineer mode or not
      Manager_Nickname: null,

      Idle_Threshold_In_Days: "", // threshold for case idle

      Interval_Idle_Notification_In_Days: "", // interval for sending idle notification in days

      Threshold_High_Backlog: "", // threshold of high backlog

      DistributionGroupForTrendingIssue: "", // DL for trending issue

      Threshold_Active_Review: "", // threshold for active review

      timezone_offset:"", //timezone_offset

      grouplead_alias:"", // group lead alias
      

      userRole: "",
      teamprofile:"",
      submit_disable:true,
    };
  },

  async created() {
   
  },

  watch: {
 Manager_Nickname(new_Manager_Nickname) {
      if (new_Manager_Nickname !== "") this.submit_disable = false;
      else this.submit_disable = true;
    },

grouplead_alias(new_group) {
   if (new_group != "") this.submit_disable = false;
      else this.submit_disable = true;
}
  },



  methods: {
    LoadDefaultProfile(teamprofile) {
      this.OpenTeamProfile(teamprofile);
    },

    OpenTeamProfile(teamprofile){
      this.TA_list = teamprofile.TA_list;
      this.Bcc_list = teamprofile.Bcc_list;
      this.MCEApproval_List = teamprofile.MCEApproval_List;
      this.Engineers_List = teamprofile.Engineers_List;
      this.Enable_Engineer_Mode = teamprofile.Enable_Engineer_Mode;
      this.Manager_Nickname = teamprofile.Manager_Nickname === "New"?"":teamprofile.Manager_Nickname;
      this.Idle_Threshold_In_Days = teamprofile.Idle_Threshold_In_Days;
      this.Interval_Idle_Notification_In_Days = teamprofile.Interval_Idle_Notification_In_Days;
      this.Threshold_High_Backlog = teamprofile.Threshold_High_Backlog;
      this.DistributionGroupForTrendingIssue = teamprofile.DistributionGroupForTrendingIssue;
      this.Threshold_Active_Review = teamprofile.Threshold_Active_Review;
      this.grouplead_alias = teamprofile.grouplead_alias;
      this.timezone_offset = teamprofile.timezone_offset;
    },

 

    Save_Team_Profile() {
      if(this.submit_disable) return;

        this.teamprofile = {
          TA_list: this.TA_list,
          Bcc_list: this.Bcc_list,
          MCEApproval_List: this.MCEApproval_List,      
          Engineers_List: this.Engineers_List,
          Enable_Engineer_Mode: this.Enable_Engineer_Mode,     
          Manager_Nickname: this.Manager_Nickname,    
          Idle_Threshold_In_Days: this.Idle_Threshold_In_Days,
          Interval_Idle_Notification_In_Days:  this.Interval_Idle_Notification_In_Days,         
          Threshold_High_Backlog: this.Threshold_High_Backlog,
          Team_Name: this.Team_Name,
          DistributionGroupForTrendingIssue: this.DistributionGroupForTrendingIssue,
          Threshold_Active_Review: this.Threshold_Active_Review,   
          grouplead_alias: this.grouplead_alias, 
          timezone_offset: this.timezone_offset,
        };
        WebAPI_Helper("post", "upsertprofile", this.teamprofile);
        Sleep(500);
        this.lastUpdatedtoProfiles= Date.now();

      
        //reset value
          this.TA_list="";
          this.Bcc_list="";
          this.MCEApproval_List="";     
          this.Engineers_List="";
          this.Enable_Engineer_Mode=false;    
          this.Manager_Nickname="";   
          this.Idle_Threshold_In_Days="";
          this.Interval_Idle_Notification_In_Days="";        
          this.Threshold_High_Backlog="";
          this.Team_Name="";
          this.DistributionGroupForTrendingIssue="";
           this.Threshold_Active_Review="";
         this.grouplead_alias=""; 
         this.timezone_offset="";
        //this.$emit("Close_TeamProfile_Modal"); // edit the message parent component to close the modal       
    },

  },
};
</script>

<style scoped>
table {
  width: 100%;
}
td {
  text-align: left;
  padding-left: 30px;
}

input[type="text"],
input[type="password"] {
  width: 95%;
  padding: 4px;
  padding: 5px;
  height: 30px;
  font-family: Verdana, Arial, Helvetica, sans-serif;
  margin: 5px 15px 5px 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 1em;
}

textarea {
  width: 98%;
  font-family: Verdana, Arial, Helvetica, sans-serif;
  font-size: 1em;
  border: 1px solid #ccc;
  padding: 5px;
  resize: none;
}

textarea:focus {
  outline-color: #ccc;
  outline-style: none;
}

input:focus {
  outline: none;
}

.clr {
  clear: both;
}

.applyfilter_button {
  width: 40%;
  background-color: green;
  height: 40px;
  padding: 5px;
  text-align: center;
  font-size: 14px;
  border: 0px;
  cursor: pointer;
  margin: 10px;
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
  margin: 10px;
  color: white;
}

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
  top: 50%;
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