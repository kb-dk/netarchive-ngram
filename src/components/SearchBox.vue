<template>
  <div class="searchBoxContainer">
    <form class="searchForm" @submit.prevent="submitSearch">
      <input id="query"
             v-model="searchQuery"
             type="text"
             autofocus
             placeholder="Enter a search term">
      <button id="querySubmit"
              :disabled="loading"
              title="Search"
              type="submit"
              value="Search">
        <div id="magnifyingGlass" />
      </button>
      <button v-if="searchQuery !== '' || datasets.length !== 0"
              id="clearSubmit"
              title="Clear search and results"
              type="button"
              @click.prevent="resetState()">
        ✕
      </button>
      <div v-show="datasets.length !== 0" class="exportModalTrigger" @click.prevent="toggleExporter()">
        Export graph data
      </div>
      <p>Enter a search term but maximum two words at a time.</p>
    </form>
    
   
    <exporter v-if="showExporter" @close-exporter="toggleExporter()" />
  </div>
</template> 

<script>
import { mapState, mapActions } from 'vuex'
import NavHelper from './helpers/navHelper'
import Exporter from './exporter/ExportData'

export default {
  name: 'SearchBox',
  components: {
      Exporter
  },

  mixins: [NavHelper],
  
 
  data () {
    return {    
        searchQuery:'',
        showExporter:false
    }
  },
  
  computed: {
    ...mapState({
      query: state => state.query,
     loading: state => state.loading,
     datasetQueries: state => state.datasetQueries,
     datasets: state => state.datasets,
     badQueries: state => state.badQueries
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
      doSearch:'doSearch',
      setNotification:'setNotification'
    }),

    submitSearch() {
      if (this.datasetQueries.includes(this.searchQuery.toLowerCase())) {
         this.setNotification({
          	title: `Sorry - you have already searched for ${this.searchQuery}`,
            text: this.searchQuery.toLowerCase() === 'tenebrous horse' ? 'Try a new and exciting one - so many queries out there' : 'Try a new and exciting one like "tenebrous horse"',
            type: 'error',
            timeout: false
          })
          } 
          else if (this.badQueries.includes(this.searchQuery.toLowerCase())) {
              this.setNotification({
          	title: `We get it! - You really want to search for ${this.searchQuery}`,
            text: `Unfortunately it still shall not pass. If you forgot why you can jog your memory be clicking the link below. 
                  <div class="notificationSubText"><a class="notificationLink" href="#/about">Read why your search ended in this mess</a></div>`,
            type: 'error',
            timeout: false
          })
      } else {

        const newQuery = { ...this.$route.query } 
        newQuery['query' + this.datasetQueries.length] = this.searchQuery
        this.$router.push({ path: 'search', query: newQuery})
      }
         },

    resetState() {
      this.$router.push(this.$route.path)
      this.resetSearchState()
    },

    toggleExporter() {
       this.showExporter = !this.showExporter
    }
  }
}

</script>

    