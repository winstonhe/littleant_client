<template>
<ul :class="{'ul_expanded':siteNivBar_expanded === 'true','ul_collapsed':siteNivBar_expanded !=='true'}">
  <li  style="height:40px;color:white;font-size:14px;  padding: 10px 16px;text-align:left"><p v-html="app_name"/></li> 
  <li  @click="ToggleNavigationBar" style="margin-left:10px;padding:10px;font-size:16px;text-align: left;color:white"><i class="fas fa-bars"></i></li> 
  <div :class="{'hide_nav':siteNivBar_expanded!=='true', 'show_nav':siteNivBar_expanded ==='true'}">
  <li @click="GetSettingFromSessionStorage('selectedMenu','1')" v-show="userrole!=5 && userrole!=6"><a href="#dashboard" style="margin-left:10px;padding:10px;font-size:14px;" :class="{'selected':GetSettingFromSessionStorage('selectedMenu')==='1','unselected':GetSettingFromSessionStorage('selectedMenu')!=='1'}" > <i class="fas fa-braille"></i> My Little Ant</a></li>
  <li  @click="GetSettingFromSessionStorage('selectedMenu','6')" v-show="userrole>=3 "><a href="#operationfootprint" style="margin-left:10px;padding:10px;font-size:14px;"  :class="{'selected':GetSettingFromSessionStorage('selectedMenu')==='6','unselected':GetSettingFromSessionStorage('selectedMenu')!=='6'}"> <i class="fas fa-fingerprint"></i> Operation Footprint</a></li>
  <li @click="GetSettingFromSessionStorage('selectedMenu','4')" v-show="userrole>=3 "><a href="#groupassignment" :class="{'selected':GetSettingFromSessionStorage('selectedMenu')==='4','unselected':GetSettingFromSessionStorage('selectedMenu')!=='4'}" style="margin-left:10px;padding:10px;font-size:14px;">  <i class="fas fa-tasks"></i> Case Assignment</a></li>
  <li  @click="GetSettingFromSessionStorage('selectedMenu','2')" v-show="userrole>=5 "><a href="#groupdashboard" :class="{'selected':GetSettingFromSessionStorage('selectedMenu')==='2','unselected':GetSettingFromSessionStorage('selectedMenu')!=='2'}" style="margin-left:10px;padding:10px;font-size:14px;"  > <i class="fas fa-tachometer-alt"></i> Active Cases Dashboard </a></li>
  <li  @click="GetSettingFromSessionStorage('selectedMenu','3')" v-show="userrole>=3 "><a href="#groupmonthlymetrics" :class="{'selected':GetSettingFromSessionStorage('selectedMenu')==='3','unselected':GetSettingFromSessionStorage('selectedMenu')!=='3'}" style="margin-left:10px;padding:10px;font-size:14px;"> <i class="fas fa-chart-bar"></i> Monthly Metrics</a></li>
  <li @click="GetSettingFromSessionStorage('selectedMenu','5')" v-show="userrole>=3 "><a href="#groupresourcestatus"  :class="{'selected':GetSettingFromSessionStorage('selectedMenu')==='5','unselected':GetSettingFromSessionStorage('selectedMenu')!=='5'}" style="margin-left:10px;padding:10px;font-size:14px;">  <i class="fas fa-address-book"></i> Engineers Availability </a></li>
  <li @click="GetSettingFromSessionStorage('selectedMenu','7')" v-show="userrole>=3 "><a href="#customerfocus"  :class="{'selected':GetSettingFromSessionStorage('selectedMenu')==='7','unselected':GetSettingFromSessionStorage('selectedMenu')!=='7'}" style="margin-left:10px;padding:10px;font-size:14px;">  <i class="fas fa-bullseye"></i> Customer Focus Center</a></li>
  
  </div>
</ul>
    
</template>
<script>

import { GetSettingFromLocalStorage,SaveSettingToLocalStorage,GetSettingFromSessionStorage, SaveSettingToSessionStorage, WebAPI_Helper} from "../common.js";

export default {
    name:"SiteNav",
    props:["siteNivBar_expanded"],

    data(){
         return {
             current_siteNivBar_expanded:"false",
             userrole:1,
             app_name:"",
             selected:"",
             selectedMenu:100,
             isadministrator: "false",
         }
    },

    // updated(){
    //     this.siteNivBar_expanded = GetSettingFromSessionStorage("siteNivBar_expanded")!==null? GetSettingFromSessionStorage("siteNivBar_expanded") :"false";
    //     console.log("site expaned:" +  this.siteNivBar_expanded );
    // },

   async created() {
       
    
       this.userrole= GetSettingFromSessionStorage("userrole") === null? await WebAPI_Helper("get","currentuserrole",null):parseInt(GetSettingFromSessionStorage("userrole")); 
   SaveSettingToSessionStorage("userrole",this.userrole);

        this.current_siteNivBar_expanded = GetSettingFromLocalStorage("siteNivBar_expanded")!==null? GetSettingFromLocalStorage("siteNivBar_expanded") :"false";      

        
    },

    methods: {

   SaveSettingToLocalStorage(setting,value){
     SaveSettingToLocalStorage(setting,value)
   },

 
  GetSettingFromSessionStorage(setting){

     return GetSettingFromSessionStorage(setting);
   },

   GetSettingFromLocalStorage(setting){

     return GetSettingFromLocalStorage(setting);
   },

    ToggleNavigationBar () {

       let new_status = this.current_siteNivBar_expanded === 'true' ? "false": "true";

       if(new_status === 'true') {
           this.app_name="";
       } else this.app_name="<i class='fab fa-autoprefixer'></i>";


       SaveSettingToLocalStorage("siteNivBar_expanded",new_status);
       this.current_siteNivBar_expanded = new_status;

       this.$emit("ToggleNavBar",new_status);


    },

    },


};
</script>

<style scoped>
.hide_nav {
    display: none;
}

.show_nav {
    display: block;
}

.ul_expanded {
     width: 12%;
}

.ul_collapsed {
     width: 3%;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 12%;
  background-color: #333;
  position: fixed;
  height: 100%;
  overflow: auto;
}

li a {
  display: block;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  text-align: left;
}

li a.active {
  background-color: #04AA6D;
  color: white;

}

li a:hover:not(.active) {
  background-color: #555;
  color: white;
   border-left :green 4px solid;
}

.selected {
  background-color: #555;
  color: white;
   border-left :green 4px solid;
}

.unselected {
    background-color: #333;
    color: white;
}

</style>