<template>
    <footer>
        <div id="footer_container">   

        <div class='footer_content'> <img style="display:inline-block;top:10px;vertical-align:middle;" src="../../images/ms.png"/> </div>         
       <div class='footer_content'> <p style="vertical-align:middle; " :class="{ 'default':appstylemode ==='DEFAULT','dark':appstylemode==='DARK'}"> Little Ant By Dynamics APAC Support team </p>  </div> 
           
       </div>
    </footer>
</template>

<script>


export default {
    name:"Footer",
    props:["appstylemode"],
    data(){
        return {
            //appstylemode_c : "DEFAULT"
        }
       
    },

    created(){
        //this.appstylemode_c = this.$props.appstylemode=== null || this.$props.appstylemode === undefined ?  GetAppStyleMode() : this.$props.appstylemode
    }
    
    
}
</script>

<style scoped>

.footer_content {
    
      display: inline-block; 
      margin: 5px; 
     
}

#footer_container {
    padding:20px;
    text-align: center;   
    line-height:0px;
    margin:30px auto
}

.dark {
    background-color:#1e1e1e;
    color:#fff; 
}

.default {
    background-color:#fff;
    color:#1e1e1e; 
}
</style>