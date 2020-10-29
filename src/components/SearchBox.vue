<template>
  <div class="searchBoxContainer">
    <form class="searchForm" @submit.prevent="submitSearch">
      <input id="query"
             v-model="searchQuery"
             type="text"
             autofocus
             placeholder="Enter a search term but maksimum two words at a time, sorry">
      <input id="querySubmit"
             title="Search"
             type="submit"
             value="Search">
      <button v-if="searchQuery !== '' || Object.keys(results).length !== 0"
              id="clearSubmit"
              title="Clear search and results"
              type="button"
              @click.prevent="resetState()">
        X
      </button>
    </form>
  </div>
</template> 

<script>
import { mapState, mapActions } from 'vuex'
import NavHelper from './helpers/navHelper'

export default {
  name: 'SearchBox',
  mixins: [NavHelper],
 
  data () {
    return {    
        searchQuery:''
    }
  },
  
  computed: {
    ...mapState({
      query: state => state.query,
     results: state => state.results,
     loading: state => state.loading,
     datasetQueries: state => state.datasetQueries
    })
  },
  
  watch: {
    query: function (val) {
      this.searchQuery  = val
    },
  },
  
  mounted () {
     // Gather query params from URL
    const currentURLParams  = this.$router.history.current.query 
    this.$_doSearchFromQueryParams(currentURLParams)
  },
  
  methods: {
    ...mapActions({
      resetSearchState:'resetState',
      doSearch:'doSearch'
    }),

    submitSearch() {
      const newQuery = { ...this.$route.query } 
      newQuery['query' + this.datasetQueries.length] = this.searchQuery
      this.$router.push({ path: 'search', query: newQuery})
    },

    resetState() {
      this.$router.push(this.$route.path)
      this.resetSearchState()
    }
  }
}

</script>

    