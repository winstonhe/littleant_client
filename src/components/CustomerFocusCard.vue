<template>
  <div
    style="float: left; margin: 2px; width: 24.7%"  :class="dynamicsCSS" :title="Computed_title"
    @click="OpenCasesList(focus)" 
   
  >
    <div
      style="height: 5px; width: 100%; padding: 0px; margin: 0px"
      :class="{
        premier: focus.ServiceLevel === 'Premier' ,
        pro: focus.ServiceLevel === 'Professional'  
      }"
    ></div>

    <div id="container_for_customer_focus">
      <p
        style="
          color: black;
          font-size: 1em;
          padding: 5px;  
          text-transform: uppercase;       
        "
      >      
        <span
          style="display: inline-block; top: 2px; vertical-align: middle;height:24px;weight:24px"
          v-html="Computed_Country"
        ></span>
                
          {{ Computed_Customer }}     
        
        
      </p>
    </div>
    <div style="padding: 10px">
      <p style="color: black; font-size: 2em; ">
        {{ focus.CasesCount }}
      </p>
    </div>
  </div>
</template>


<script>
import { Process_Country } from "../common.js";

export default {
  name: "CustomerFocus",
  props: ["focus","dynamicsCSS"],
  components: {},

  data() {
    return {      
      selected:"",
    };
  },

  created() {
    console.log("card called");
  },

  computed: {
    Computed_Country: function () {
      const region = this.$props.focus.Region;
      return Process_Country(region);
    },

    Computed_Customer: function() {

        const customer = this.$props.focus.Customer;
        if(customer.length>=25)
        return  customer.slice(0,25)+"...";
        else return customer;

    },

    Computed_title:function (){
         const focus = this.$props.focus;
         return focus.ServiceLevel + " customer: " + focus.Customer + " raised "+ focus.CasesCount + " cases within past 7 days. Click to get more..."
    }
  },

  methods: {

      OpenCasesList(focus) {         
       this.$emit('open-Cases-List',focus)
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