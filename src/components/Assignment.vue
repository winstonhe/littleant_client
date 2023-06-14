<template>

<td>{{ index }}</td>
  <td
    :class="{
      S500_default:
        assignment.programType !== 'None' && assignment.programType === 'S500' && appstylemode === 'DEFAULT',
      S500_dark:
      assignment.programType !== 'None' && assignment.programType === 'S500' && appstylemode === 'DARK',
      ACE_default:
        assignment.programType !== 'None' && assignment.programType === 'ACE' && appstylemode === 'DEFAULT',
      ACE_dark:
      assignment.programType !== 'None' && assignment.programType === 'ACE' && appstylemode === 'DARK'   
     
    }"
  >
    <div v-html="Computed_Program_Type"></div>
  </td>

  <td 
    style="text-align: left;cursor: pointer;"
    @click="copyToClipboard(assignment.sr_number)"
    title="Click to copy case ID"   
  >
    <!-- <a
      :class="{
        a_default: appstylemode === 'DEFAULT',
        a_dark: appstylemode === 'DARK',
      }"
      :href="`https://onesupport.crm.dynamics.com/main.aspx?appid=101acb62-8d00-eb11-a813-000d3a8b3117&forceUCI=1&pagetype=entityrecord&etn=incident&id=${assignment.sr_record_guid}&formid=33fb74b3-86ac-4db6-9904-2ad75648175b`"
      target="_blank" -->
    
      {{ assignment.sr_number }} <i v-show="showTips" class="far fa-copy"></i>
     
    <!-- </a> -->
   
  </td>

  <td>{{ assignment.sr_severityCode }}</td>
  <td style="text-align: left" :title="assignment.servicelevel">
    <i v-if="assignment.servicelevel === 'Premier'" class="far fa-star" ></i><i v-if="assignment.servicelevel === 'Premier'" class="far fa-star" ></i><i v-if="assignment.servicelevel === 'Premier'" class="far fa-star" ></i>
    <i v-if="assignment.servicelevel ==='Professional'" class="fas fa-star-half-alt"></i>
  </td>
  <td style="text-transform: uppercase; text-align: center">
    <i v-show="assignment.casetype =='Chat'" class="far fa-comment-alt" title="Chat support"></i>
    <i v-show="assignment.casetype =='Web'" class="far fa-envelope" title="Email & Phone support"></i>    
  </td> 



  <td style="text-transform: uppercase; text-align: center">
    <div v-html="Computed_Country" :title="assignment.sr_regioncode"></div>
  </td>

  <td style="text-align: left" 
  :title="ComputedCustomerTitle(assignment)"
  :class="{
       'CritsitOnce': assignment.iscritsit === true && assignment.isgoingcritsit === false,
       'CritsitOngoing': assignment.isgoingcritsit === true,       
  }"
    >     
    {{ assignment.sr_customer }} 
   
  </td>

  <td style="text-transform: uppercase; text-align: left">
    {{ assignment.sr_caseowner }}
  </td>
  



  <td style="text-align: center">{{ computed_POD }}</td> 



  <td style="text-align: left">{{ assignment.sr_title }}</td>
  <td  v-show="showChat2WebColumn" style="text-align: center">
          <i v-show="assignment.casetype==='Chat' && assignment.convertedToWeb === true" class="fas fa-times" title="Not resolved in Chat and converted as a web case"></i>        
         <i v-show="assignment.casetype==='Chat' && assignment.convertedToWeb === false" class="fas fa-flag-checkered" title="Solution delivered in chat support"></i>
   
  </td>

  
</template>

<script>
import { Process_Country } from "../common.js";

export default {
  name: "Assignment",
  props: ["assignment", "appstylemode","showChat2WebColumn","index"],

  components: {
   
  },

  data() {
    return {   
        showTips:false,
 
    };
  },

  created() {
  },

  methods: {
    
    ComputedCustomerTitle(assignment){
    
    if(assignment.isgoingcritsit) {
      return  "Critsit Ongoing"
    }

    if(assignment.iscritsit) {
      return "Critsit case once"
    }
    
  },

   copyToClipboard(text) {
      const tempEl = document.createElement("textarea");
      tempEl.value = text ;    
      document.body.appendChild(tempEl);  
      tempEl.select(); 
      document.execCommand("copy");
      document.body.removeChild(tempEl);  

      this.showTips = true;

      setTimeout(() => {
       this.showTips = false
      }, 2000);

      
      }
},

  computed: {  

    Computed_Program_Type: function () {
      const programtype = this.$props.assignment.programType;
      switch (programtype) {
        case "None":
          return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        default:
          return programtype;
      }
    },
 

    Computed_Country: function () {
      const region = this.$props.assignment.sr_regioncode;
      return Process_Country(region);
    },

    Computed_Title: function () {
      const level = this.$props.assignment.servicelevel;
      const programType = this.$props.assignment.programType;
      let title="";
      if(!(level=== "None" || level === null) ){
        switch(level) {
         case "Premier" : 
         case "Prem": title +="Premier;" ; break;
         case "Pro":
         case "Professional": title +="Professional;"; break;
         case "MC": title +="Mission Critical;"; break;
         default:"";
        }
      }    

      if(!(programType ==="None" || programType === null))
      title +="  Progam Type: " + programType;
      return title;
    },


    computed_POD: function () {
      const pod = this.$props.assignment.support_pod;
      if(pod === null) return;
      switch (pod) {
        case "CE Application":
          return "APP";
        // case "CE Power Platform":
        //   return "PP";
        case "CE Clients":
          return "Client";
        case "CE Platform":
          return "Platform";
        case "CE Customizations":
          return "Customization";
        default:
          return pod.slice(0, 13);
      }
    },
  },
};
</script>

<style scoped>


.fa {
  display: inline-block;
  border: none;
  background: #555;
  color: #fff;
  padding: 7px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.fa:hover {
  background: #666;
}

.assignment-item {
  background-color: #f4f4f4;
  padding: 10px;
  width: 30%;
  border-bottom: 1px #ccc solid;
}

.S500_default {
  border-left: 3px green solid;
  background-color: #f2f2f2;
  color: black;
}

.S500_dark {
  border-left: 3px green solid;
  background-color: #444;
  color: #fff;
}

.ACE_default {
  border-left: 3px orange solid;
  background-color: #f2f2f2;
  color: black;
}

.ACE_dark {
  border-left: 3px orange solid;
  background-color: #444;
  color: #fff;
}

.MC_default {
  border-left: 3px orange solid;
  background-color: #f2f2f2;
  color: black;
}



.CritsitOnce {
  border-left: 3px red solid;

}

.CritsitOngoing {
  border-bottom: 1px red solid;
}


.Pro_dark {
  border-left: 3px rgb(153, 113, 132) solid;
  /* background-color: #444; */
  color: #fff;
  }


  .Pro_default {
  border-left: 3px rgb(153, 113, 132) solid;
  background-color: #f2f2f2;
  color: black;
  }

.reviewed {
  border-left: 5px green solid;
}

.high-risk {
  border-left: 4px red solid;
}

.mid-risk {
  border-left: 4px orange solid;
}

.low-risk {
  border-left: 4px green solid;
}

.long_idle_default {
  border-left: 3px red solid;
  background-color: #f2f2f2;
  color: black;
}

.long_idle_dark {
  border-left: 3px red solid;
  background-color: #444;
  color: #fff;
}


.long_idle_solution_delivered_default {
  border-bottom: 3px #A99D00 solid;
  background-color: #f2f2f2;
  color: black;
}

.long_idle_solution_delivered_dark {
  border-bottom: 3px #A99D00  solid;
  background-color: #444;
  color: #fff;
}


.reviewed_today {
  background-color: green;
}

.review {
  background-color: #ccc;
  /* color:#fff; */
  border: none;
  padding: 5px 5px;
  /* border-radius: 50%; */
  cursor: pointer;
  float: center;
  /* font-size: .8rem; */
}

.review:hover {
  background: green;
}

/* label {
    background-color: #43AC6A;
    color: #fff;
    border-radius:50%;
} */

td,
th {
  /* border: 1px solid rgb(190, 190, 190); */
  padding: 0px 3px;
  /* font-size: .8rem; */
}

tr{
height: 36px;
}

td {
  text-align: center;
  padding: 0px 3px;
  height:36px;
}

.a_default {
  border: none;
  color: black;
  cursor: pointer;
  text-decoration: none;
}

.a_dark {
  border: none;
  color: #fff;
  cursor: pointer;
  text-decoration: none;
}

/* a:hover {
  border: none;
  color: black;
  cursor: pointer;
  text-decoration: underline;
} */

/*custom radio button */

/* The container */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 1em;
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
  background-color: #2196f3;
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

.caseclosed {
  text-decoration: line-through;
}

</style>
