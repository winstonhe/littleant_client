<template>
   <div class="date">
    {{ shorDate }} <i class="fas fa-clock"></i>{{ comment.sr_age }}
  </div>
  <i class="icon fa fa-home"></i>
  <!-- <i class="fab fa-windows"></i> -->
  <div
    class="content"
    v-bind:class="{
      cpe_low_risk: comment.cpe_assessment === '1',
      cpe_mid_risk: comment.cpe_assessment === '2',
      cpe_high_risk: comment.cpe_assessment === '3',
    }"
  >
    <h2 style="text-align: left ; text-transform:uppercase">
      <i
        v-show="               
            comment.reviewtype === 2            
        "
        class="fas fa-user-friends"
      >
        Peer reviewed by {{ comment.reviewed_by }} &nbsp;
      </i>

      <i
        v-show="comment.reviewtype === 1"
        class="fas fa-user-check"
      >
        Self reviewed by {{ comment.reviewed_by }} &nbsp;
      </i>

    <i
        v-show="comment.reviewtype === 4"
        class="fas fa-phone-volume"
        title="MCE On-going"
        >&nbsp;MCE on-going  &nbsp;</i>

      <i
        v-show="comment.mcedone === true"
        class="fas fa-phone-slash"
        title="MCE Done and waiting for case closure"
        >MCE completed by {{comment.reviewed_by}} &nbsp;</i
      >
      <i
        v-show="
         comment.reviewtype === 6
        "
        class="fas fa-hand-holding-heart"
        title='pre-handling for monitored customer'
      >
        Case pre-handling for monitored customer &nbsp;
      </i>

      <i
        v-show="
        comment.reviewtype === 7
        "
        class="fas fa-bed" title="Case idle"
        > Case idle alert &nbsp;
      </i>

      <i v-show="comment.reviewtype === 8" 
      class="fas fa-chart-line" title="Trending issue">
      Trending reported by {{ comment.reviewed_by }} &nbsp;
      </i>

      <i v-show="comment.reviewtype === 9" 
      class="fas fa-clock" title="SLA Reminder for ACE Customer">
      SLA Reminder for ACE &nbsp;
      </i>

        <i
        v-show="comment.reviewtype === 3"
        class="fas fa-phone-alt"
        title="MCE Requested"
        >MCE requested by {{comment.reviewed_by}}&nbsp;</i>

      <i
        v-show="comment.cpe_assessment === '1'"
        class="fas fa-smile"
        title="Low CPE Risk"
        >&nbsp;</i
      >
      <i
        v-show="comment.cpe_assessment === '2'"
        class="fas fa-meh"
        style="color: orange"
        title="Neutral CPE Risk"
        >&nbsp;</i
      >
      <i
        v-show="comment.cpe_assessment === '3'"
        class="fas fa-frown"
        style="color: darkred"
        title="High CPE Risk"
        >&nbsp;</i
      >
      <i
        class="fas fa-envelope"
        v-show="comment.email_sent === true"
        title="Notification Email Sent"
        >&nbsp;</i
      >
    
    </h2>

    <h2
      v-show="currentUser === comment.reviewed_by || userrole>=3"
      style="position: absolute; right: 90px; top: 30px; cursor: pointer"
      @click="Show_ConfirmDialog"
    >
      <i class="far fa-trash-alt" title="Delete this review comment"></i>
    </h2>
    <h2
      v-show="showConfirmDialog"
      style="position: absolute; right: 80px; top: 30px; cursor: pointer"
    >
      <button
        style="background-color: red"
        @click="DeleteCommentConfirm(comment)"
      >
        <i class="fas fa-check"></i> Confirm
      </button>
      <button style="background-color: gray" @click="DelecelCommentCancel">
        <i class="fas fa-times"></i> Cancel
      </button>
    </h2>

<p style="text-align:left">
  <a v-show="comment.reviewtype ===8 && comment.associatedicm_for_trendingissue!==null&& comment.associatedicm_for_trendingissue.length!==0"
    style="overflow:auto; text-align: left;border: none; color: #000; cursor: pointer; text-decoration: none;" 
    :href="`https://portal.microsofticm.com/imp/v3/incidents/details/${comment.associatedicm_for_trendingissue}/home`"
    target="_blank"     
    > <i class="fab fa-battle-net"></i> https://portal.microsofticm.com/imp/v3/incidents/details/{{comment.associatedicm_for_trendingissue}}<br><br>
    </a>  
</p>
<p style="text-align:left">
    <a v-show="comment.reviewtype ===8 && comment.associatedbug_for_trendingissue!==null&& comment.associatedbug_for_trendingissue.length!==0"
    style="overflow:auto; text-align: left;border: none; color: #000; cursor: pointer; text-decoration: none;" 
    :href="`${comment.associatedbug_for_trendingissue}`"
    target="_blank"     
    > <i class="fas fa-bug"></i><span v-html="comment.associatedbug_for_trendingissue"></span> <br><br>
    </a> 
    </p> 

    <p v-html="comment.comments" style="overflow: auto; text-align: left"></p>
  </div>
</template>

<script>
import {WebAPI_Helper,GetSettingFromSessionStorage} from "../common.js";

export default {
  name: "Comment",
  props: ["comment"],
  data() {
    return {
      showConfirmDialog: false,
      currentUser: "",
    
      userrole: 1,
    };
  },

 async created() {
    this.showConfirmDialog = false;
    this.currentUser = GetSettingFromSessionStorage("whoami");
  
    this.userrole = await WebAPI_Helper("get", "currentuserrole", null);
  },

  computed: {
    shorDate: function () {
      const datestring = this.$props.comment.reviewed_on;
      return datestring.slice(0, 10);
    },
  },

  methods: {
    Show_ConfirmDialog() {
      this.showConfirmDialog = true;
    },

    async DeleteCommentConfirm(comment) {
      this.showConfirmDialog = false;
      this.$emit("Delete_Comment", comment.id);
    },

    DelecelCommentCancel() {
      this.showConfirmDialog = false;
    },
  },
};
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #ffffff;
}

.cpe_high_risk {
  background-color: #bdc1c6;
}

.cpe_mid_risk {
  background-color: lightgray;
}

.cpe_low_risk {
  background-color: #fafafa;
}

button {
  color: white;
  border: none;
  padding: 5px 5px;
  /* border-radius: 50%; */
  cursor: pointer;
  float: center;
  /* font-size: .8rem; */
}

.self_review {
  background-color: #bfada9;
}

.timeline {
  position: relative;
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
  padding: 15px 0;
}

.timeline::after {
  content: "";
  position: absolute;
  width: 2px;
  background: #006e51;
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -1px;
}

.container {
  padding: 15px 30px;
  position: relative;
  background: inherit;
  width: 50%;
}

.container.left {
  left: 0;
}

.container.right {
  left: 50%;
}

.container::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: calc(50% - 8px);
  right: -8px;
  background: #ffffff;
  border: 2px solid #006e51;
  border-radius: 16px;
  z-index: 1;
}

.container.right::after {
  left: -8px;
}

.container::before {
  content: "";
  position: absolute;
  width: 50px;
  height: 2px;
  top: calc(50% - 1px);
  right: 8px;
  background: #006e51;
  z-index: 1;
}

.container.right::before {
  left: 8px;
}

.container .date {
  position: absolute;
  display: inline-block;
  top: calc(50% - 8px);
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #006e51;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 1;
}

.container.left .date {
  right: -140px;
}

.container.right .date {
  left: -140px;
}

.container .icon {
  position: absolute;
  display: inline-block;
  width: 40px;
  height: 40px;
  padding: 9px 0;
  top: calc(50% - 20px);
  background: #f6d155;
  border: 2px solid #006e51;
  border-radius: 40px;
  text-align: center;
  font-size: 18px;
  color: #006e51;
  z-index: 1;
}

.container.left .icon {
  right: 56px;
}

.container.right .icon {
  left: 56px;
}

.container .content {
  padding: 30px 90px 30px 30px;
  /* background: #F6D155; */
  position: relative;
  border-radius: 0 500px 500px 0;
}

.container.right .content {
  padding: 30px 30px 30px 90px;
  border-radius: 500px 0 0 500px;
}

.container .content h2 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: normal;
  color: #006e51;
}

.container .content p {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: #000000;
}

@media (max-width: 767.98px) {
  .timeline::after {
    left: 90px;
  }

  .container {
    width: 100%;
    padding-left: 120px;
    padding-right: 30px;
  }

  .container.right {
    left: 0%;
  }

  .container.left::after,
  .container.right::after {
    left: 82px;
  }

  .container.left::before,
  .container.right::before {
    left: 100px;
    border-color: transparent #006e51 transparent transparent;
  }

  .container.left .date,
  .container.right .date {
    right: auto;
    left: 15px;
  }

  .container.left .icon,
  .container.right .icon {
    right: auto;
    left: 146px;
  }

  .container.left .content,
  .container.right .content {
    padding: 30px 30px 30px 90px;
    border-radius: 500px 0 0 500px;
  }
}
</style>