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

          :selectedProfile="selectedProfile"

          @showDeleteModal="showDeleteModal"

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

  <DeleteConfirmationModal
  :showDeleteDialog="showDeleteDialog"
   @Delete_Confirmed="DeleteConfirmed"
   @Delete_Canceled="DeleteCanceled"
  >
  </DeleteConfirmationModal>

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
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default {
  name: "TeamProfiles",
  props: ["card_Hovered","lastUpdatedtoProfiles"],
  data() {
    return {
      profiles: [],
      newprofile: {},
     
      selectedProfile: "",
      userRole:1,

      profileToBeDeleted:null,
      showDeleteDialog:false,//show delete dialog       
    };
  },

  components: {
    TeamProfileCard,DeleteConfirmationModal
  },

 async updated() {
   this.profiles = await this.teamprofiles();
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

    showDeleteModal(teamprofile){
      this.showDeleteDialog = true;
      this.profileToBeDeleted = teamprofile;  
     
    },

   async DeleteConfirmed(){
     
      await WebAPI_Helper("get","deleteteamprofile/manager/"+this.profileToBeDeleted.Manager_Nickname,null);
      this.profileToBeDeleted = null;  
      this.profiles = await this.teamprofiles();

      //refresh the default profile again.
      if (this.profiles.length !== 0) {
       this.selectedProfile =  this.profiles[0].Manager_Nickname
      this.$emit("Load-Default-Profile", this.profiles[0]);
    }

      this.showDeleteDialog = false;
    },

    DeleteCanceled(){
      this.profileToBeDeleted = null;  
      this.showDeleteDialog = false;
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