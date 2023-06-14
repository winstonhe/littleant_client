<template>
  <div
    id="profiles_container"
    style="float: left; width: 100%; margin-bottom: 30px"
  >
    <div
      style="float: left;width:32%;margin:2px;cursor:pointer"
      v-bind:key="index"
      v-for="(dele, index) in accessdelegations"

    >
      <AccessDelegationCard v-if="data_ready"
        :accessdelegation="dele"      
          :class="
          {  
          'selected': selectedAccessDelegation === dele.alias,
         'card_default': selectedAccessDelegation !== dele.alias            
          }
          "

          :selectedAccessDelegation="selectedAccessDelegation"

          @showDeleteModal="showDeleteModal"

        @Open-Access-Delegation="OpenAccessDelegation"
    
      >
      </AccessDelegationCard>
    </div>
    <div style="float: left;width:32%;margin:2px ;cursor:pointer" v-show="userRole>=7">
      <AccessDelegationCard 
      :accessdelegation="newaccessdelegation"     
        :class="{
          selected: selectedAccessDelegation === newaccessdelegation.alias,
          new_card_default:    selectedAccessDelegation !== newaccessdelegation.alias
        
        }"  
         @Open-Access-Delegation="OpenAccessDelegation"
      > </AccessDelegationCard>
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

import AccessDelegationCard from "./AccessDelegationCard";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default {
  name: "AccessDelegations",
  props: ["card_Hovered"],
  data() {
    return {
      //accessdelegations: [],
      newaccessdelegation :{},
     
      selectedAccessDelegation: "",
      userRole:1,

      accessdelegations:[],

      data_ready:false,

      delegationToBeDeleted:null,
      showDeleteDialog:false,//show delete dialog       
    };
  },

  components: {
    AccessDelegationCard,DeleteConfirmationModal
  },


  async created() {
    this.accessdelegations = await WebAPI_Helper("get","accessdelegations","");
    this.data_ready =true;
        
    this.newaccessdelegation.alias = "New Delegation";

    if (this.accessdelegations.length !== 0) {
       this.selectedAccessDelegation =  this.accessdelegations[0].alias
      this.$emit("Load-Default-AccessDelegation", this.accessdelegations[0]);
    }

    this.userRole = await WebAPI_Helper("get", "currentuserrole", null);

  },

  methods: {
   
    showDeleteModal(deletation){
      this.showDeleteDialog = true;
      this.delegationToBeDeleted = deletation;  
     
    },

   async DeleteConfirmed(){
     
      await WebAPI_Helper("get","deleteaccessdelegation/id/"+this.delegationToBeDeleted.accessdelegation_id,null);
      this.delegationToBeDeleted = null;  
      
      //get the refresh data.
      this.accessdelegations = await WebAPI_Helper("get","accessdelegations","");

      //refresh the default profile again.
      if (this.accessdelegations.length !== 0) {
       this.selectedAccessDelegation =  this.accessdelegations[0].alias
      this.$emit("Load-Default-AccessDelegation", this.accessdelegations[0]);
    }

      this.showDeleteDialog = false;


    },

    DeleteCanceled(){
      this.delegationToBeDeleted = null;  
      this.showDeleteDialog = false;

      
      //refresh the default profile again.
      if (this.$props.accessdelegations.length !== 0) {
       this.selectedAccessDelegation =  this.$props.accessdelegations[0].alias;
      this.$emit("Load-Default-AccessDelegation", this.$props.accessdelegations[0]);
    }

      this.showDeleteDialog = false;
    },
        
  OpenAccessDelegation(delegation){     
       this.selectedAccessDelegation = delegation.alias;
       this.$emit("Open-Access-Delegation",delegation);

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