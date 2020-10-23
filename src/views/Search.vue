<template>
  <div class="search-container">
    <spinner/>
    <search-box/>
    <smurf-chart/>
  </div>
</template>

<script>
// @ is an alias to /src
import SmurfChart from "@/components/SmurfChart.vue"
import Spinner from "@/components/Spinner.vue"
import SearchBox from '@/components/SearchBox.vue'
import NavHelper from '@/components/helpers/navHelper'
import {mapActions} from 'vuex'


export default {
  name: "Search",
  mixins: [NavHelper],
  components: {
   SmurfChart,
   Spinner, 
   SearchBox
  },

  methods: {
   ...mapActions({
      resetSearchState:'resetState'
    })
  }, 

  beforeRouteUpdate (to, from, next) {
    this.$_handleRouteUpdates(to, from)
    next()
  },

  beforeRouteLeave (to, from, next) {
    this.$_handleRouteLeave(to)
    next()
  }
};
</script>
