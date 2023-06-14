<template>
  <div
    style="float: left; margin: 2px; width: 100%" 
    @click="OpenAccessDelegation(accessdelegation)" 
   
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
      
      <p style="color: black; font-size: 14px; display:inline;text-transform: uppercase;" v-html="Computed_AccessDelegation_Name">  </p> 
      <p style="display:inline;padding:8px"> <i class='far fa-trash-alt' v-if="accessdelegation.alias === selectedAccessDelegation" @click="$emit('showDeleteModal',accessdelegation)" title='Delete this access delegation'></i></p>
    </div> 

    
  </div>
</template>


<script>
//import {  } from "../common.js";

export default {
  name: "AccessDelegationCard",
  props: ["accessdelegation","selectedAccessDelegation"],
  components: {},

  data() {
    return {
      
      selected:"",
      mode:"insert",
    };
  },

  created() {

    console.log("card start");
    
  },

  computed: {

    Computed_AccessDelegation_Name(){

      let accessdelegation = this.$props.accessdelegation;   
      if(accessdelegation=== undefined || accessdelegation === null) return;

      if(accessdelegation.alias === "New Delegation") {
      
        return  "<i class='fas fa-plus'></i> New Delegation";
      } else {          
        return "<i class='fas fa-link'></i>  " + accessdelegation.fullname;
        
      }
    }
  
   
  },

  methods: {

    OpenAccessDelegation() {     
      this.$emit("Open-Access-Delegation",this.$props.accessdelegation);
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