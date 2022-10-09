<template id="dialog">
  <div class="dialog" v-if="showSettingDialog">
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
            Little Ant Settings
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
            @click="$emit('Close_Setting_Modal')"
          >
            <i class="fas fa-times"></i>
          </p>
        </div>

        <div
          style="
            font-size: 14px;
            padding: 10px 30px;
            color: black;
            text-align: left;
          "
          v-text="modalTitle"
        ></div>

        <div>        

          <table>
             <!-- <tr>
              <td style="width: 800px">
               
                <label class="container" style="display: inline-block">
                  DFM Cookie
                </label>
                <textarea
                  style="height: 100px"
                  rows="10"
                  placeholder=" DFM Cookie"
                  v-model="Dfm_Cookie"
                  name="Dfm_Cookie"
                >
                </textarea>
              </td>
            </tr>          -->

            <tr>
              <td style="width: 100%">
                <label class="container" style="display: inline-block"
                  >Sync Folder of OneDrive for Business</label
                >
                <input
                  type="text"
                  placeholder="Sync Folder of OneDrive for Business For Saving Notification Content"
                  style="width: 98%"
                  v-model="SyncFolder"
                  name="SyncFolder"
                />
              </td>
            </tr>

            <tr>
              <td style="width: 100%">
                <label class="container" style="display: inline-block"
                  >Interval of Bug Sync In Days</label
                >
                <input
                  type="text"                 
                  style="width: 98%"
                  v-model="IntervalofBugSync"
                  name="IntervalofBugSync"
                />
              </td>
            </tr>

            <tr>
              <td style="width:98%">
                <div style="display: inline-block; margin: 5px; float: left">
                  <label class="switch" style="display: inline-block">
                    <input
                      type="checkbox"
                      v-model="Brother_Team_Visible_ToM1"                                  
                    />
                    <span class="slider round"></span>
                  </label>
                </div>

                <div
                  style="display: inline-block; float: left; padding-top: 10px"
                >
                  <label>Data Visible To M1 Managers Who Are Under The Same M2 Manager</label>
                </div>
              </td>
            </tr>   

            <tr>
              <td style="width:98%">
                <div style="display: inline-block; margin: 5px; float: left">
                  <label class="switch" style="display: inline-block">
                    <input
                      type="checkbox"
                      v-model="Brother_Team_Visible_ToTA"                                  
                    />
                    <span class="slider round"></span>
                  </label>
                </div>

                <div
                  style="display: inline-block; float: left; padding-top: 10px"
                >
                  <label>Data Visible To TA whose M1 Managers Are Under The Same M2 Manager</label>
                </div>
              </td>
            </tr>   
          </table>
          <!--SMTP mode end-->
        </div>

        <!-- new line -->
        <div class="clr"></div>
        <div style="margin: 20px">
          <!-- <input type='submit' class='comment_button' value='SAVE COMMENTS'/> -->
          <button
            type="submit"
            class="applyfilter_button"
            @click="Save_Settings"
          >
          <i class="fas fa-save"></i> SAVE
          </button>
          <button
            type="button"
            class="cancel_button"
            @click="$emit('Close_Setting_Modal')"
          >
            <i class="fas fa-times"></i> CANCEL
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { WebAPI_Helper,GetSettingFromSessionStorage,SaveSettingToSessionStorage, Sleep} from "../common.js";

export default {
  name: "SettingModal",
  props: ["showSettingDialog", "modalTitle"],
  data() {
    return {
      setting: null,
 
       userRole:1,
   
      

      isadministrator: "false",

      Enable_SMTP_Mode: false,
      SyncFolder: "",
      Brother_Team_Visible_ToM1:false,    
      Brother_Team_Visible_ToTA:false, 
      Dfm_Cookie: "",  
      IntervalofBugSync:2,    
    };
  },

  async created() {
    // this.isadministrator = await WebAPI_Helper("get", "isadministrator", null);
    this.userrole= GetSettingFromSessionStorage("userrole") === null? await WebAPI_Helper("get","currentuserrole",null):parseInt(GetSettingFromSessionStorage("userrole")); 
   SaveSettingToSessionStorage("userrole",this.userrole);

    if (this.userrole >= 4) {
      this.setting = await WebAPI_Helper("get", "getsetting", null);
       
   
      if (this.setting !== null) {      
      
        this.SyncFolder = this.setting.SyncFolder;
        this.Dfm_Cookie = this.setting.Dfm_Cookie;
        this.Brother_Team_Visible_ToM1 = this.setting.Brother_Team_Visible_ToM1;
        this.Brother_Team_Visible_ToTA = this.setting.Brother_Team_Visible_ToTA;
        this.IntervalofBugSync = this.setting.IntervalofBugSync;

      }
    }
  },

  methods: {
    Save_Settings() {
      this.setting = {
       
        SyncFolder: this.SyncFolder,       
        Dfm_Cookie: this.Dfm_Cookie,
        Brother_Team_Visible_ToM1:this.Brother_Team_Visible_ToM1,
        Brother_Team_Visible_ToTA:this.Brother_Team_Visible_ToTA,
        IntervalofBugSync: this.IntervalofBugSync,
      
      };

      WebAPI_Helper("post", "upsertsetting", this.setting);
      Sleep(1000);
      this.$emit("Close_Setting_Modal"); // edit the message parent component to close the modal
      //ClearSettingFromLocalStorage();

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
  background-color: rgb(128, 0, 32);
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