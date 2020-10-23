<template>
  <div class="search-container">
    <spinner/>
    <search-box/>
    <netarchive-chart/>
  </div>
</template>

<script>
// @ is an alias to /src
import NetarchiveChart from "@/components/NetarchiveChart.vue"
import Spinner from "@/components/Spinner.vue"
import SearchBox from '@/components/SearchBox.vue'
import NavHelper from '@/components/helpers/navHelper'
import {mapActions} from 'vuex'


export default {
  name: "Search",
  mixins: [NavHelper],
  components: {
   NetarchiveChart,
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
