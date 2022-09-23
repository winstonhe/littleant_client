<template>
  <div
    style="float: left; margin: 2px; width: 100%" 
    @click="OpenTeamProfile(teamprofile)" 
   
  >
    <div
      style="height: 5px; width: 100%; padding: 0px; margin: 0px"
      :class="{
      'premier':mode==='edit',
      'pro': mode==='insert'
      }
      "
    ></div>
   
    <div style="padding: 10px">
      <p style="color: black; font-size: 14px;   text-transform: uppercase;" v-html="Computed_Profile_Name">       
       
      </p> 
    </div>

    
  </div>
</template>


<script>
//import { Process_Country } from "../common.js";

export default {
  name: "TeamProfileCard",
  props: ["teamprofile"],
  components: {},

  data() {
    return {
      
      selected:"",
      mode:"insert",
    };
  },

  created() {
    
  },

  computed: {

    Computed_Profile_Name(){

      let teamprofile = this.$props.teamprofile;
      if(teamprofile.Manager_Nickname === "New") {
      
        return  "<i class='fas fa-plus'></i> New";
      }
      else {
      
        return "<i class='fas fa-address-card'></i>  "+ teamprofile.Manager_Nickname + "  (<i class='fas fa-user-shield'></i>  "+teamprofile.grouplead_alias+"  )";
      }
    },
   
  },

  methods: {

    OpenTeamProfile() {     
      this.$emit("Open-Team-Profile",this.$props.teamprofile);
    }
    
  },
};
</script>

<style scoped>
.premier {
  background-color: green;
}
.pro {
  background-color: darkgoldenrod;
}

.card_default {
    background-color:lightgray
}

.card_over {
background-color:darkgray
}


</style>