<template>
    <div id="loadcontainer" v-show="loaded===false"><p>Little ant is loading. please ...</p></div>
</template>

<script>
export default {
   name:"Loading",
   props:["loaded"],
        
    
}

</script>
<style scoped>

#loacontainer {
    margin: 0 auto;
    padding: 30 px;
    font-size: 1em;
    background-color: gray;
}

</style>
