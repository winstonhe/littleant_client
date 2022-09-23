<template id="dialog">
  <div class="dialog" v-if="showDialog">
    <div class="dialog_mask"></div>
    <div class="dialog_container">
      <div class="dialog_content">
        <div
          style="
            background-color: darkgray;
            height: 60px;
            width: 100%;
            margin: 0px auto;
          "
        >
          <p
            style="
              font-size: 40px;
              color: white;
              text-align: center;
              font-family: Segoe UI;
              font-weight: lighter;
            "
          >
            MCE Task Assignment
          </p>
          <p
            style="
              font-size: 15px;
              color: white;
              font-family: Segoe UI;
              font-weight: lighter;
              position: absolute;
              right: 20px;
              top: 25px;
              cursor: pointer;
            "
            @click="$emit('CloseAssignModal')"
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

        <div id="cpe_container" style="margin: 0px auto">
          <div
            style="
              display: inline-block;
              margin: 5px;
              float: left;
              padding-left: 30px;
            "
            v-bind:key="approver"
            v-for="approver in approver_list"
          >
            <label
              class="container"
              style="
                text-transform: uppercase;
                display: inline-block;
                width: 205px;
                color : #000;
              "
              ><i class="fas fa-user-alt"></i> {{ approver }}
              <input
                type="radio"
                v-model="cpe_taskowner"
                :value="approver"
                name="CPE_Approver"
              />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>

        <!-- new line -->
        <div class="clr"></div>
        <div style="margin: 30px">
          <!-- <input type='submit' class='comment_button' value='SAVE COMMENTS'/> -->
          <button
            type="submit"
            v-bind:class="{
              comment_button: is_engineer_selected === true,
              cancel_button: is_engineer_selected === false,
            }"
            @click="Assign_MCE_Task"
          >
            <i class="fas fa-check"></i> OK
          </button>
          <button
            type="button"
            class="cancel_button"
            @click="$emit('cancel-mce-assign')"
          >
            <i class="fas fa-times"></i> CANCEL
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetSettingFromSessionStorage } from '../common';
export default {
  name: "AssignMCEModal",
  props: ["showDialog", "sr_number", "sr_caseowner", "sr_age", "modalTitle"],
  data() {
    return {
      approver_list: [],
      cpe_taskowner: "",
      review_owner: "",
      is_engineer_selected: false,
    };
  },

  created() {
    this.approver_list = 
      GetSettingFromSessionStorage("approver_list").split(",");
   
    this.review_owner = GetSettingFromSessionStorage("whoami");
  },

  watch: {
    cpe_taskowner(new_cpe_taskowner) {
      if (new_cpe_taskowner != "") this.is_engineer_selected = true;
      else this.is_engineer_selected = false;
    },
  },

  methods: {
    Assign_MCE_Task: function () {
      const newreview_cpetask = {
        id: Math.floor(Math.random() * 65585),
        comments:
          this.$props.sr_caseowner.toUpperCase() +
          "'s MCE Request has been assigned to " +
          this.cpe_taskowner +
          " by " +
          this.review_owner,
        sr_number: this.$props.sr_number,
        reviewed_on: new Date().toISOString(),
        reviewed_by: this.review_owner,
        cpe_assessment: null,
        email_sent: true,
        tracktodfm: false,
        sr_owner: this.$props.sr_caseowner,
        needmce: true,
        mcedone: false,
        sr_age: this.$props.sr_age,
        reviewtype: 4,
      };

      if (this.cpe_taskowner === null || this.cpe_taskowner === "") return;
      //send up to parent
      this.$emit("assign-mce-task", newreview_cpetask, this.cpe_taskowner);
    },
  },
};
</script>

<style scoped>
.clr {
  clear: both;
}

.comment_button {
  width: 40%;
  background-color: green;
  height: 40px;
  padding: 5px;
  text-align: center;
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
  width: 55%;
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

/*custom radio button */

/* The container */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 14px;
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
</style>