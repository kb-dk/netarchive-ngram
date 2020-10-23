<template>
  <div>
  <div class="small">
    <line-chart v-if="datasets.length > 0" :chart-data="datacollection" :options="options"></line-chart>
  </div>
  </div>
</template>

<script>
  
  import LineChart from './chartsCore/chartEngines/LineChart'
  import ChartHelpers from './chartsCore/chartHelpers'
  import {mapState} from 'vuex'

  export default {
    name: 'NetarchiveChart',
    components: {
      LineChart
    },

    computed: {
    ...mapState({
      query: state => state.query,
     datasets: state => state.datasets
    })
  },

   data () {
      return {
        datacollection: {},
        options: ChartHelpers.getChartOptions()
       }
    },

    watch: {
    datasets: function (newVal) {
      this.fillData(newVal)
      }
    },
    
    methods: {
      fillData () {
        this.datacollection = {
          labels: ChartHelpers.getChartLabels(),
          datasets: ChartHelpers.getChartDataSet(this.datasets)
        }
      }
    }
  }
</script>



