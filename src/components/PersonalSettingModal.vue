<template id="dialog">
  <div class="dialog" v-if="showPersonalSettingDialog">
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
            Pesonal Settings
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
            @click="$emit('Close_Personal_Setting_Modal')"
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

        <div id="setting_container" style="margin: 0px auto">
          <!-- App mode setting -->
              
          <div id="mode_container" style="margin: 20px auto">
            <div class="clr"></div> 
            <div style=" display: inline-block;margin: 10px;padding-left: 30px; float: left;">Application Theme Preference</div>
            <div class="clr"></div>     
            <div
              style="
                display: inline-block;
                margin: 10px;
                padding-left: 30px;
                float: left;
              "
            >
              <label class="container">Colorful Mode 
                <input
                  type="radio"
                  v-model="appstylemode"
                  value="DEFAULT"
                  checked="checked"
                  name="appstylemode"
                />
                <span class="checkmark"></span>
              </label>
            </div>

            <div style="display: inline-block; margin: 10px; float: left">
              <label class="container">Dark Mode 
                <input
                  type="radio"
                  v-model="appstylemode"
                  value="DARK"
                  name="appstylemode"
                />
                <span class="checkmark"></span>
              </label>
            </div>
          </div>
          <!-- App mode setting end -->

          <!-- action card setting -->
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
                v-model="showAllActions"
                :value="true"
                name="showAllActions"
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
              >Show All Action Cards That Is Related To Me</label
            >
          </div>
           <!-- action card setting end-->
        </div>

        <div class="clr"></div>
        <div style="margin: 20px">
          <!-- <input type='submit' class='comment_button' value='SAVE COMMENTS'/> -->
          <button
            type="submit"
            class="applyfilter_button"
            @click="Save_Personal_Settings"
          >
          <i class="fas fa-save"></i> SAVE
          </button>
          <button
            type="button"
            class="cancel_button"
            @click="$emit('Close_Personal_Setting_Modal')"
          >
            <i class="fas fa-times"></i> CANCEL
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { GetAppStyleMode} from "../common.js";

export default {
  name: "PersonalSettingModal",
  props: ["showPersonalSettingDialog", "modalTitle"],
  data() {
    return {
      showAllActions: false,
    };
  },

  async created() {
    this.showAllActions = window.localStorage.getItem("showAllActions");
    this.appstylemode = GetAppStyleMode();
  },

  methods: {
    Save_Personal_Settings() {
      this.$emit("Save_Personal_Settings", this.showAllActions,this.appstylemode);
    },
  },
};
</script>

<style scoped>
input[type="text"],
input[type="password"] {
  width: 200px;
  padding: 4px;
  /* display: inline-block; */
  /*background icon */
  /* background-image: url('../images/searchicon.png');
 background-position: 10px 10px; 
  background-repeat: no-repeat; */
  padding: 5px;
  height: 25px;
  margin-left: 10px;

  border: 1px solid #ccc;
  /* border-radius: 4px; */
  box-sizing: border-box;
  font-size: 1em;
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
  background-color: green;
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
</style>