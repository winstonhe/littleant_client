<template id="dialog">
  <div class="dialog" v-if="showCustomerFocusProfileDialog">
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
            Customer Focus Setting
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
            @click="$emit('Close-Profile-Modal')"
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
             <tr>
              <td style="width: 800px">
               
                <label class="container" style="display: inline-block">
                  FetchXML of Customer Focus which is shared among M1 Managers under the same M2 Manager.
                </label>
                <textarea
                  style="height: 300px;margin-top:10px"
                  rows="10"
                  placeholder=" FetchXML of Customer Focus "
                  v-model="FetchXML_CustomerFocus"
                  name="FetchXML_CustomerFocus"
                >
                </textarea>
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
            @click="Save_Profile"
          >
          <i class="fas fa-save"></i> SAVE
          </button>
          <button
            type="button"
            class="cancel_button"
            @click="$emit('Close-Profile-Modal')"
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
  name: "CustomerFocusProfileModal",
  props: ["showCustomerFocusProfileDialog", "modalTitle"],
  data() {
    return {    
 
       userrole:1,    
      FetchXML_CustomerFocus :"",
      profile:{},
    };
  },

  async created() {
   this.userrole= GetSettingFromSessionStorage("userrole") === null?parseInt(await WebAPI_Helper("get","currentuserrole",null)):parseInt(GetSettingFromSessionStorage("userrole")); 
   SaveSettingToSessionStorage("userrole",this.userrole);


    if (this.userrole >= 4) {
      const profile =  await WebAPI_Helper("get","mycustomerfocusprofile",null);   
      if(profile !==null) {
        this.FetchXML_CustomerFocus = profile.FetchXML_CustomerFocus;
      }

      }
    
  },

  methods: {
    Save_Profile() {
      this.profile = {       
        FetchXML_CustomerFocus: this.FetchXML_CustomerFocus 
              
      };

      WebAPI_Helper("post", "upsertcustomerfocusprofile", this.profile);
      Sleep(1000);
      this.$emit("Close-Profile-Modal"); // edit the message parent component to close the modal

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