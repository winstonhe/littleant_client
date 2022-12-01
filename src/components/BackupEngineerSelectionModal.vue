<template>
  <div class="dialog" v-if="showDialog">
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
            Backup Engineer Selection
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
            @click="CloseModal"
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
          v-text="EngineersFilterModalTitle"
        ></div>

        <div id="cpe_container" style="margin: 0px auto">
          <div
            style="
              display: inline-block;
              margin: 5px;
              float: left;
              padding-left: 20px;
            "
            v-bind:key="engineer"
            v-for="engineer in engineers"
          >
            <label
              class="container"
              style="
                text-transform: uppercase;
                display: inline-block;
                width: 205px;"
             
              ><i class="fas fa-user-alt"></i> {{ engineer }} 
              <input
                type="radio"
                v-model="backup_engineer"
                :value="engineer"
                name="backup_engineer"              
              />
              <span class="checkmark"></span>
            </label>
          </div>
          <!-- new line -->
          <div class="clr"></div>
        </div>

        <div style="margin: 30px">
        
          <button
            type="button"
            v-bind:class="{
              applyfilter_button: filter_enabled === true,
              not_yet_filter_button: filter_enabled === false,
            }"
            @click="apply_filter"
          >
            <i class="fas fa-check"></i> Confirm Selection
          </button>
          <button
            type="button"
            class="cancelfilter_button"
            @click="CloseModal"
          >
            <i class="fas fa-eraser"></i> Cancel Selection
          </button>
        </div>
      </div>
    </div>
  </div>

 
</template>

<script>
export default {
  name: "BackupEngineerSelectionModal",
  data() {
    return {
      backup_engineer: "",
      filter_enabled: false,    
    };
  },

  props: ["engineers", "showDialog", "EngineersFilterModalTitle"],

  watch: {
    backup_engineer(new_engineers_chosen) {
      if (new_engineers_chosen != "") this.filter_enabled = true;
      else this.filter_enabled = false;
    },
  },

  created() {   
   
  },

  methods: {
    apply_filter() {
      if (this.backup_engineer!== "") {       
        this.$emit("Choose_Confirmed", this.backup_engineer);
      }
    },  

    CloseModal() {
      this.backup_engineer = null;
      this.$emit("Choose_Canceled");
    },
  },
};
</script>

<style scoped>
.overload {
  color: darkred;
}

.lowload {
  color: gray;
}

.undercontrol {
  background-color: green;
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

.not_yet_filter_button {
  width: 40%;
  background-color: gray;
  height: 40px;
  padding: 5px;
  text-align: center;
  font-size: 14px;
  border: 0px;
  cursor: pointer;
  margin: 10px;
  color: white;
}

.cancelfilter_button {
  width: 40%;
  background-color: orange;
  height: 40px;
  padding: 5px;
  text-align: center;
  font-size: 14px;
  border: 0px;
  cursor: pointer;
  margin: 10px;
  color: white;
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

/*Modal style*/

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
}

.dialog_mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
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
</style>