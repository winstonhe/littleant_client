<template>
  <div id="actioncards_container" style="float: left; width: 100%">
    <div v-bind:key="index" v-for="(action, index) in actions">
      <ActionCard
        :action="action"
        v-on:assign-mce-task="assignMceTask_To_Dashbaord"
      ></ActionCard>
    </div>
  </div>
</template>

<script>
import ActionCard from "../components/ActionCard";

export default {
  name: "ActionCards",
  props: ["actions", "showAllActions"],
  data() {
    return {
      Actions: [],
      currentUser: "",
      issuperuser: false,
    };
  },

  components: {
    ActionCard,
  },

  created() {
    this.currentUser = window.localStorage.getItem("whoami");
    this.issuperuser = window.localStorage.getItem("issuperuser");

  },

  methods: {
    assignMceTask_To_Dashbaord(newreview_cpetask, cpe_taskowner) {
      this.$emit("assign-mce-task", newreview_cpetask, cpe_taskowner);
    },
  },
};
</script>