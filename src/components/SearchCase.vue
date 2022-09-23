<template>
  <div class="clr"></div>
  <div id="search_container" style="margin: 1px auto; width: 500px">
    <div style="margin: 0px auto; width: 100%">
      <div>
        <!-- <img src='../images/ant.png' style="margin-right:20px;padding-top:10px"/>  -->
        <input
          type="text"
          v-model="sr_number"
          placeholder="Type service ticket number.."
          v-on:keyup.enter="searchServiceTicket"
        />
        <!-- <button value="Search" @click="searchServiceTicket" class='search_button' v-bind:class="{'enabled': search_enabled === true, 'disabled': search_enabled === false}"> <i class="fas fa-search"></i></button> -->
      </div>
    </div>
  </div>
  <div class="clr"></div>
</template>

<script>
export default {
  name: "SearchCase",
  data() {
    return {
      sr_number: "",
      search_enabled: false,
    };
  },

  created() {
    this.search_enabled = false;
  },

  watch: {
    sr_number(new_no) {
      if (new_no.trim() != "") this.search_enabled = true;
      else this.search_enabled = false;
    },
  },

  methods: {
    searchServiceTicket() {
      if (this.sr_number.trim() === "") return;

      this.$router.push({
        path: "/ServiceTicketDetails",
        query: {
          sr_number: this.sr_number.trim(),
        },
      });
    },
  },
};
</script>

<style scoped>
input[type="text"] {
  width: 98%;
  padding: 12px 20px;
  /* display: inline-block; */
  /*background icon */
  background-image: url("../images/searchicon.png");
  background-position: 10px 10px;
  background-repeat: no-repeat;
  padding: 12px 20px 12px 40px;
  height: 100%;

  border: 1px solid #ccc;
  /* border-radius: 4px; */
  box-sizing: border-box;
  font-size: 1em;
}

input:focus {
  outline: none;
}

.search_button {
  width: 50px;
  background-color: green;
  height: 44px;
  padding: 5px;

  text-align: center;
  border: 0px;
  cursor: pointer;
  color: white;
  font-size: 1em;
}

.enabled {
  background-color: green;
}

.disabled {
  background-color: gray;
}
</style>