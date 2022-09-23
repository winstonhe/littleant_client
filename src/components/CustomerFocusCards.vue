<template>
  <div style="text-align: center; width: 100%">
    <div  v-bind:key="index" v-for="(focus, index) in focuses">
      
      <CustomerFocusCard
      
       :class="
          {  
            'selected':  selectedCustomer===focus.Customer+focus.ServiceLevel,        
            'card_default ': hoveredCustomer !== (focus.Customer+focus.ServiceLevel)  && card_Hovered === true ,
            'card_over':  hoveredCustomer === (focus.Customer+focus.ServiceLevel)  && card_Hovered === true ,
            'card_default':card_Hovered === false            
           
          }
          "

        :focus="focus"  
        @open-Cases-List="openCasesList" 
        @mouseover="mouseover(focus)"       
        @mouseleave="mouseleave()"   
      ></CustomerFocusCard>
    </div>
  </div>
</template>

<script>
import CustomerFocusCard from "../components/CustomerFocusCard";

export default {
  name: "CustomerFocusCards",
  props: ["focuses","hovered","card_Hovered"],
  data() {
    return {

          hoveredCustomer:"",
          selectedCustomer:"",
     
    };
  },

  components: {
    CustomerFocusCard,
  },

  created() {
   

  },

  methods: {
    openCasesList(focus){
       this.selectedCustomer = focus.Customer+focus.ServiceLevel;
       this.$emit("open-Cases-List",focus);
    },

    mouseover(focus){
        this.hoveredCustomer = focus.Customer+focus.ServiceLevel;
        this.$emit("CardMouseOver")     

      },

      mouseleave(){
          this.hoveredCustomer="";
          this.$emit("CardMouseLeave")

      },
    
  
  },
};
</script>
<style scoped>
.card_default {
    background-color:lightgray
}

.card_over {
background-color:#f3f2f1;
cursor: pointer;
}

.selected {
background-color:#f3f2f1;
}

.card_leave {
    background-color:lightgray
}
</style>