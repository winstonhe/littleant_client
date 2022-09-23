<template>
  <div
    id="profiles_container"
    style="float: left; width: 100%; margin-bottom: 30px"
  >
    <div
      style="float: left;width:32%;margin:2px;cursor:pointer"
      v-bind:key="index"
      v-for="(profile, index) in profiles"

    >
      <TeamProfileCard
        :teamprofile="profile"      
          :class="
          {  
          'selected': selectedProfile === profile.Manager_Nickname,
         'card_default': selectedProfile !== profile.Manager_Nickname            
          }
          "

        @Open-Team-Profile="OpenTeamProfile"
    
      >
      </TeamProfileCard>
    </div>
    <div style="float: left;width:32%;margin:2px ;cursor:pointer" v-show="userRole>=5">
      <TeamProfileCard 
      :teamprofile="newprofile"     
        :class="{
          selected: selectedProfile === newprofile.Manager_Nickname,
          new_card_default:    selectedProfile !== newprofile.Manager_Nickname
        
        }"  
        @Open-Team-Profile="OpenTeamProfile" 
      > </TeamProfileCard>
    </div>
  </div>
</template>

<script>
import {
  WebAPI_Helper,
  //   GetSettingFromSessionStorage,
  //   SaveSettingToLocalStorage,
  //   SaveSettingToSessionStorage,
  //   GetAppStyleMode,
  //   Shuffle,
} from "../common.js";

import TeamProfileCard from "./TeamProfileCard";

export default {
  name: "TeamProfiles",
  props: ["card_Hovered"],
  data() {
    return {
      profiles: [],
      newprofile: {},
     
      selectedProfile: "",
      userRole:1,
    };
  },

  components: {
    TeamProfileCard,
  },

  async created() {
    this.profiles = await this.teamprofiles();
    this.newprofile.Manager_Nickname = "New";

    if (this.profiles.length !== 0) {
       this.selectedProfile =  this.profiles[0].Manager_Nickname
      this.$emit("Load-Default-Profile", this.profiles[0]);
    }

    this.userRole = await WebAPI_Helper("get", "currentuserrole", null);

  },

  methods: {
    async teamprofiles() {
      return await WebAPI_Helper("get", "teamprofiles", "");
    },

    
  OpenTeamProfile(teamprofile){     
       this.selectedProfile = teamprofile.Manager_Nickname;
       this.$emit("Open-Team-Profile",teamprofile);

  },


  },

};
</script>

<style scoped>
.card_default {
    background-color:lightgray
}

.new_card_default {
    background-color:darkgoldenrod
}



.selected {
background-color:#f3f2f1;
}


</style>