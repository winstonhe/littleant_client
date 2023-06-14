<template>
  <!-- <Dashboard></Dashboard> -->
  <router-view></router-view>
  <!-- <Footer /> -->
</template>

<script>
//import Footer from "./components/layout/Footer";
import { GetAppStyleMode ,WebAPI_Helper } from "./common.js";
// import Dashboard from './components/Dashboard'

export default {
  name: "App",
  components: {
   // Footer,
    //  Dashboard,
  },

  data() {
    return {
      selected: "Home",
      userRole:1,
    };
  },

  async created() {
    document.title = "Little Ant";

    const AppMode = GetAppStyleMode()
    switch(AppMode){
      case "DEFAULT":
        document.body.style.backgroundColor ="#fff";break;
      case "DARK":
        document.body.style.backgroundColor ="#1e1e1e";break;
    }
    
    this.userRole = await WebAPI_Helper("get", "currentuserrole", null);

    if(this.userRole === 8) // deleted user not need to littleant page
        this.$router.push("operationfootprint");
    else if (window.location.href.length < 30) {     
       this.$router.push("dashboard");
    }

     //this.$router.push("dashboard");
    
   
    
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body { 
  font-family: Helvetica, sans-serif;
  background-color: #fff;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 14px;
  color: #2c3e50;
  /* font-family:Segoe UI;
     font-weight:lighter; */
  /* flex-direction: row;
  justify-content: center; */
  /* margin: 20px;  */
}

.btn {
  display: inline-block;
  border: none;
  background: gray;
  color: #fff;
  padding: 7px 20px;
  margin: 2px 2px;
  /* border-radius: 5px; */
  cursor: pointer;
}

.btn:hover {
  background: #666;
}

@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
</style>
