<template>
  <div id="displaycontiner">
    <div
      id="availableengineers"
      :class="{
        'displayboard availableengineers': appstylemode === 'DEFAULT',
        'displayboard dark': appstylemode === 'DARK',
      }"
    >
      <p
        :class="{
          'title title_default': appstylemode === 'DEFAULT',
          'title title_dark': appstylemode === 'DARK',
        }"
      >
        <i class="fas fa-user-friends"></i> ENGINEERS
      </p>
      <p class="boardcontent">{{ Compueted_Engineers }}</p>
      <p class="boardcontent_sub"></p>
      <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
    </div>

    <div
      id="displaybacklog"
      :class="{
        'displayboard displaybacklog': appstylemode === 'DEFAULT',
        'displayboard dark': appstylemode === 'DARK',
      }"
    >
      <p
        :class="{
          'title title_default': appstylemode === 'DEFAULT',
          'title title_dark': appstylemode === 'DARK',
        }"
      >
        <i class="fas fa-clipboard-list"></i> BACKLOG
      </p>
      <p class="boardcontent">{{ Compueted_Backlog }}</p>
      <p class="boardcontent_sub"></p>
      <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
    </div>

    <div
      id="display60"
      :class="{
        'displayboard trending': appstylemode === 'DEFAULT',
        'displayboard dark': appstylemode === 'DARK',
      }"
    >
      <p
        :class="{
          'title title_default': appstylemode === 'DEFAULT',
          'title title_dark': appstylemode === 'DARK',
        }"
      >
        <i class="fas fa-chart-line"></i> TRENDINGS
      </p>
      <p class="boardcontent">{{ Compueted_trendingissues_count }}</p>
      <p class="boardcontent_sub">
        &nbsp;{{ Compueted_trendingissues_count_percentage }}
      </p>
      <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
    </div>

    <div
      id="display60"
      :class="{
        'displayboard trending': appstylemode === 'DEFAULT',
        'displayboard dark': appstylemode === 'DARK',
      }"
    >
      <p
        :class="{
          'title title_default': appstylemode === 'DEFAULT',
          'title title_dark': appstylemode === 'DARK',
        }"
      >
        <i class="fas fa-bug"></i> BUG
      </p>
      <p class="boardcontent">{{ Compueted_bug_count }}</p>
      <p class="boardcontent_sub">
        &nbsp;{{ Compueted_bug_count_percentage }}
      </p>
      <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
    </div>

    <div
      id="display15"
      :class="{
        'displayboard display15': appstylemode === 'DEFAULT',
        'displayboard dark': appstylemode === 'DARK',
      }"
    >
      <p
        :class="{
          'title title_default': appstylemode === 'DEFAULT',
          'title title_dark': appstylemode === 'DARK',
        }"
      >
        <i class="fas fa-seedling"></i> &lt; 15 DAYS
      </p>
      <p class="boardcontent">{{ Compueted_count15 }}</p>
      <p class="boardcontent_sub">&nbsp;{{ Compueted_count15_percentage }}</p>
      <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
    </div>

    <div
      id="display1530"
      :class="{
        'displayboard display1530': appstylemode === 'DEFAULT',
        'displayboard dark': appstylemode === 'DARK',
      }"
    >
      <p
        :class="{
          'title title_default': appstylemode === 'DEFAULT',
          'title title_dark': appstylemode === 'DARK',
        }"
      >
        <i class="fas fa-gas-pump"></i> 15 - 30 DAYS
      </p>
      <p class="boardcontent">{{ Compueted_count1530 }}</p>
      <p class="boardcontent_sub">&nbsp;{{ Compueted_count1530_percentage }}</p>
      <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
    </div>

    <div
      id="display3045"
      :class="{
        'displayboard display3045': appstylemode === 'DEFAULT',
        'displayboard dark': appstylemode === 'DARK',
      }"
    >
      <p
        :class="{
          'title title_default': appstylemode === 'DEFAULT',
          'title title_dark': appstylemode === 'DARK',
        }"
      >
        <i class="fas fa-battery-half"></i> 31 - 45 DAYS
      </p>
      <p class="boardcontent">{{ Compueted_count3045 }}</p>
      <p class="boardcontent_sub">&nbsp;{{ Compueted_count3045_percentage }}</p>
      <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
    </div>

    <div
      id="display4560"
      :class="{
        'displayboard display4560': appstylemode === 'DEFAULT',
        'displayboard dark': appstylemode === 'DARK',
      }"
    >
      <p
        :class="{
          'title title_default': appstylemode === 'DEFAULT',
          'title title_dark': appstylemode === 'DARK',
        }"
      >
        <i class="fas fa-ambulance"></i> 46 - 60 DAYS
      </p>
      <p class="boardcontent">{{ Compueted_count4560 }}</p>
      <p class="boardcontent_sub">&nbsp;{{ Compueted_count4560_percentage }}</p>
      <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
    </div>

    <div
      id="display60"
      :class="{
        'displayboard display60': appstylemode === 'DEFAULT',
        'displayboard dark': appstylemode === 'DARK',
      }"
    >
      <p
        :class="{
          'title title_default': appstylemode === 'DEFAULT',
          'title title_dark': appstylemode === 'DARK',
        }"
      >
        <i class="fas fa-exclamation-triangle"></i> &gt; 60 DAYS
      </p>
      <p class="boardcontent">{{ Compueted_count60 }}</p>
      <p class="boardcontent_sub">&nbsp;{{ Compueted_count60_percentage }}</p>
      <!-- <div v-show="appstylemode === 'DARK'" style="background:gray;height:2px;width:100%;margin-bottom:0px" ></div> -->
    </div>
  </div>
</template>

<script>
//import {GetAppStyleMode} from "../common.js"

export default {
  name: "Displayboard",
  props: ["summary", "appstylemode"],
  date() {
    return {
      //appstylemode:"DEFAULT",
    };
  },

  computed: {
    Compueted_Engineers() {
      if (this.$props.summary != null) return this.$props.summary.engineers;
      else return "...";
    },

    Compueted_Backlog() {
      if (this.$props.summary != null) return this.$props.summary.backlog;
      else return "...";
    },

    Compueted_trendingissues_count() {
      if (this.$props.summary != null)
        return this.$props.summary.trendingissues_count;
      else return "...";
    },

    Compueted_trendingissues_count_percentage() {
      if (this.$props.summary != null)
        return this.$props.summary.trendingissues_count_percentage;
      else return "...";
    },

    Compueted_bug_count() {
      if (this.$props.summary != null)
        return this.$props.summary.bug_count;
      else return "...";
    },

    Compueted_bug_count_percentage() {
      if (this.$props.summary != null)
        return this.$props.summary.bug_count_percentage;
      else return "...";
    },

    Compueted_count15() {
      if (this.$props.summary != null) return this.$props.summary.count15;
      else return "...";
    },

    Compueted_count15_percentage() {
      if (this.$props.summary != null)
        return this.$props.summary.count15_percentage;
      else return "...";
    },

    Compueted_count1530() {
      if (this.$props.summary != null) return this.$props.summary.count1530;
      else return "...";
    },
    Compueted_count1530_percentage() {
      if (this.$props.summary != null)
        return this.$props.summary.count1530_percentage;
      else return "...";
    },

    Compueted_count3045() {
      if (this.$props.summary != null) return this.$props.summary.count3045;
      else return "...";
    },
    Compueted_count3045_percentage() {
      if (this.$props.summary != null)
        return this.$props.summary.count3045_percentage;
      else return "...";
    },

    Compueted_count4560() {
      if (this.$props.summary != null) return this.$props.summary.count4560;
      else return "...";
    },
    Compueted_count4560_percentage() {
      if (this.$props.summary != null)
        return this.$props.summary.count4560_percentage;
      else return "...";
    },

    Compueted_count60() {
      if (this.$props.summary != null) return this.$props.summary.count60;
      else return "...";
    },
    Compueted_count60_percentage() {
      if (this.$props.summary != null)
        return this.$props.summary.count60_percentage;
      else return "...";
    },
  },

  created() {
    //this.appstylemode = GetAppStyleMode()
  },
};
</script>

<style scoped>
#displaycointer {
  background: gray;
  padding: 20px;
  text-align: center;

  line-height: 0px;
  margin: 10px auto;
}

.title {
  padding: 15px;
  width: 100%;
  font-size: 16px;
  color: white;
  border-left: 4px solid orange;
}

.title_default {
  background: olive;
  color: #fff;
}

.title_dark {
  background: #000;
  color: #fff;
}

.displayboard {
  width: 11.1%;
  height: 100px;
  display: inline-block;
}

.dark {
  background: #252527;
  color: #fff;
}

.display15 {
  background: #01579b;
  color: #fff;
}

.display1530 {
  background: #311b92;
  color: #fff;
}

.display3045 {
  background: #4a148c;
  color: #fff;
}

.display4560 {
  background: #880e4f;
  color: #fff;
}

.display60 {
  background: #b71c1c;
  color: #fff;
}

.trending {
  background: rgb(59, 103, 145);
  color: #fff;
}

.displaybacklog {
  background: #607d8b;
  color: #fff;
}

.availableengineers {
  background: #004d40;
  color: #fff;
}

.boardcontent {
  font-size: 30px;
  text-align: center;
  font-family: Segoe UI;
  font-weight: lighter;
  display: inline-block;
}

.boardcontent_sub {
  font-size: 20px;
  text-align: center;
  font-family: Segoe UI;
  font-weight: lighter;
  display: inline-block;
}
</style>