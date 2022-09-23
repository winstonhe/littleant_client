<template>
  <div
    style="float: left; background-color: lightgray; margin: 2px; width: 15.5%"
  >
    <div
      style="height: 5px; width: 100%; padding: 0px; margin: 0px"
      :class="{
        resource_offline: bookableresource.valid_now === false,     
        resource_online: bookableresource.valid_now === true 
      }"
    ></div>
  
    <div style="padding: 12px">
      <p style="color: black; font-size: 1.1em; text-transform: uppercase">
     <i :class="{'fas fa-power-off':bookableresource.valid_now === false,'fas fa-user-check':bookableresource.valid_now !==false}"></i>   {{ bookableresource.engineer_alias }}
      </p>
    </div>    
  </div>

</template>


<script>


export default {
  name: "ActionCard",
  props: ["bookableresource"],
  components: {
    
  },
  data() {
    return {
         
    };
  },

  created() {
  
  },



};
</script>

<style scoped>

.resource_online {
  background-color: green;
}

.resource_offline {
  background-color: darkgray
}

a {
  border: none;
  color: black;
  cursor: pointer;
  text-decoration: none;
}
</style>