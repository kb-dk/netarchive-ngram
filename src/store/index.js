import Vue from "vue";
import Vuex from "vuex";
import {searchService} from '../services/SearchService'

Vue.use(Vuex);

// Global search state.

const initialState = () => ({
  query: '',
  results: {},
  loading:false,
  yearCountPercent: [],
  yearCountsTotal: [],
  datasetQueries:[],
  datasets:[],
  emptyResult: false 
})

const state = initialState()

const actions = {
  setLoadingStatus( {commit}, param) {
    commit('setLoadingStatus', param)
  },
  updateQuery ( {commit}, param) {
    commit('updateQuerySuccess', param)
  },
  doSearch ({ commit }, params) {
   commit('setLoadingStatus', true)
   searchService.search(params)
   .then(results => {this.dispatch('updateQuery', params), commit('doSearchSuccess', results)}, error =>
   commit('doSearchError', error))
  },
  resetState({ commit }) {
    commit('resetState')
  },
  removeDataset({ commit }) {
    commit('removeDataset')
  },
  addDataset({ commit }) {
    commit('addDataset')
  }
}

const mutations = {
  updateQuerySuccess(state, param) {
    state.query = param
  },
  addDataset(state, param) {
    state.query = param
  },
  removeDataset(state) {
    state.datasetQueries.pop()
      state.datasets.pop()
  },
  doSearchSuccess(state, results) {
      state.yearCountPercent = results.yearCountPercent
      state.yearCountsTotal = results.yearCountsTotal
      state.emptyResult = results.emptyResult
      state.datasetQueries.push(state.query)
      state.datasets.push({
        query: state.query,
        count: state.yearCountsTotal.map(yearCountTotal => yearCountTotal.count),
        total: state.yearCountsTotal.map(yearCountTotal => yearCountTotal.total),
        percent: state.yearCountPercent
      });
    state.results = results
    state.loading = false
  },
  doSearchError(state, message) {
   console.log(state, message)
  },
  setLoadingStatus(state, status) {
    state.loading = status
  },
  resetState(state) {
    const newState = initialState()
    Object.keys(newState).forEach(key => {
          state[key] = newState[key]
    })
  },

}

export default new Vuex.Store({
  namespaced: true,
  state,
  actions,
  mutations
})

