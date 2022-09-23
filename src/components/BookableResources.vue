<template>
  <div style="float: left; width: 100%">
     
    <div v-bind:key="index" v-for="(bookableresource, index) in bookableresources">
      <BookableResource
        :bookableresource="bookableresource"       
      ></BookableResource>
    </div>
   
  </div>
</template>

<script>
import BookableResource from "./BookableResource.vue";

export default {
  name: "BookableResources",
  props: ["bookableresources"],
  data() {
    return {
    
    };
  },

  components: {
    BookableResource
  },

  created() {
   

  },

  
};
</script>