<template>
  <div class="dialog" v-if="showDelegationDialog">
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
           Delegations 
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
            @click="$emit('Close_AccessDelegation_Modal')"
          >
            <i class="fas fa-times"></i>
          </p>
        </div>

        
        <AccessDelegations 
        @Load-Default-AccessDelegation="LoadDefaultAccessDelegation" 
        @Open-Access-Delegation="OpenAccessDelegation"   
       
        >
        </AccessDelegations>

        <div
          style="
            font-size: 14px;
            padding: 10px 30px;
            color: black;
            text-align: left;
          "
         
        ></div>

        <table>
          <tr>
            <td style="width: 100%">
                <label class="container" style="display: inline-block;width:12%">
                  Alias
                </label>
                <input style="width: 80%"
                type="text" 
                 
                  v-model="alias"
                  name="alias"
                >
              </td>         
           
          </tr>

          <tr>
            <td style="width: 100%">
                <label class="container" style="display: inline-block;width:12%">
                  Full Name
                </label>
                <input
                  type="text"  style="width: 80%"            
                 
                  v-model="fullname"
                  name="fullname"
                />
              </td>
          </tr>
        </table>
       
        <div
          style="           
            margin: 10px ;
          "
        >
          <p
            style="
              font-size:16px;          
              text-align: left;
              margin:20px;                        
            "
          >   
          Choose teams        
          </p>
        
        </div>


        <div id="cpe_container" style="margin: 0px auto">
          <div
            style="
              display: inline-block;
              margin: 5px;
              float: left;
              padding-left: 20px;
            "
            v-bind:key="team"
            v-for="team in teams"
          >
            <label
              class="container"
              style="
                text-transform: uppercase;
                display: inline-block;
                width: 220px;
              "             
              ><i class="fas fa-user-alt"></i> {{ Get_Team_DisplayName(team) }} 
              <input
                type="checkbox"
                v-model="teams_chosen"
                :value="team"
                name="teams_list"               
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
           @click="Save_Access_Delegation"
          >
          <i class="fas fa-save"></i> Save
          </button>
          <button
            type="button"
            class="cancelfilter_button"
            @click="$emit('Close_AccessDelegation_Modal')"
          >
            <i class="fas fa-times"></i> Cancel 
          </button>
        </div>
      </div>
    </div>
  </div>

 
</template>

<script>
import { WebAPI_Helper, Sleep,GetSettingFromSessionStorage,SaveSettingToLocalStorage,Get_Team_DisplayName} from "../common.js";
import AccessDelegations from "./AccessDelegations.vue";



export default {
  name: "AccessDelegationModal",
  props: ["showDelegationDialog", "modalTitle"],
  components: { AccessDelegations},

  data() {
    return {

      card_Hovered: false,

        userRole: "",
      accessdelegation:"",

      alias:"",
      fullname:"",

      
      accessdelegations:[],
      
      teams_chosen: [],
      teams:[],
      filter_enabled: false,   

      accessdelegation_id:-1,

    };
  },



  async created() {
   
    this.teams =
        GetSettingFromSessionStorage("teammanagers_alias").split(",")!== null ? GetSettingFromSessionStorage("teammanagers_alias"): GetSettingFromSessionStorage("teammanagers_alias").split(",");
      
    let i=0;
    for(i=0 ;i< this.accessdelegations.length; i++){
    
      SaveSettingToLocalStorage("Delegate_FullName"+"_Of_Team_"+this.accessdelegations[i].team_alias,this.accessdelegations[i].team_displayname);
     
    }
   },

   watch: {
    teams_chosen(new_team) {
      if (new_team != "") this.filter_enabled = true;
      else this.filter_enabled = false;
    },
  },

  methods: {

    Get_Team_DisplayName(manager_alias){
      return Get_Team_DisplayName(manager_alias);
    },
    
    LoadDefaultAccessDelegation(accessdelegation) {
     
      this.OpenAccessDelegation(accessdelegation);
    },

   
   async OpenAccessDelegation(accessdelegation){

    this.teams =
        GetSettingFromSessionStorage("teammanagers_alias").split(",");
    
      
      if(accessdelegation.alias === "New Delegation"){
        this.mode = "Insert";
        this.accessdelegation_id =  Math.floor(Math.random() * 65585);
        this.teams_chosen = [];

        this.alias = "";
        this.fullname = "";
      }
      else  {
      this.mode = "Edit";
      this.accessdelegation_id = accessdelegation.accessdelegation_id;
      let delegate = await  WebAPI_Helper("get","accessdelegation/id/" + accessdelegation.accessdelegation_id,"");

      this.alias = delegate.alias;
      this.fullname = delegate.fullname;
      this.teams_chosen = delegate.teams_alias.split(",");
      }      
      
    },

 

   async Save_Access_Delegation() {
      if(this.submit_disable) return;

        this.accessdelegation = {
          accessdelegation_id : this.accessdelegation_id,
          alias : this.alias,
          fullname :this.fullname,
          teams_alias : this.teams_chosen.join(",")
        
        };
        WebAPI_Helper("post", "upsertaccessdelegation", this.accessdelegation);
        Sleep(500);   
        
        //refresh UI
        await WebAPI_Helper("get","accessdelegations","");
       
         this.$emit("Close_AccessDelegation_Modal"); // edit the message parent component to close the modal       
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
  top: 50%;
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