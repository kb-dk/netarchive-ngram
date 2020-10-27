import Vue from "vue";
import Vuex from "vuex";
import {searchService} from '../services/SearchService'
import MessageHelper from '../components/helpers/messageHelper'

Vue.use(Vuex);

// Global search state.

const initialState = () => ({
  query: '',
  // cache for current query in case server rejects it
  attemptedQuery:'',
  results: {},
  loading:false,
  yearCountPercent: [],
  yearCountsTotal: [],
  datasetQueries:[],
  datasets:[],
  emptyResult: false,
  notifications: [], 
})

const state = initialState()

const actions = {
  setLoadingStatus( {commit}, param) {
    commit('setLoadingStatus', param)
  },
  updateQuery ( {commit}, param) {
    commit('updateQuerySuccess', param)
  },
  updateAttemptedQuery ( {commit}, param) {
    commit('updateAttemptedQuery', param)
  },
  doSearch ({ commit }, params) {
   commit('setLoadingStatus', true)
   commit('updateAttemptedQuery', params)
   

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
  },

  /*Notification stuff - lets split this out later*/
  setNotification( {commit}, notification) {
    commit('setNotification', notification)
  },
  dismissNotification ( {commit}, notification) {
    commit('dismissNotification', notification)
  }

}

const mutations = {
  updateQuerySuccess(state, param) {
    state.query = param
  },
  updateAttemptedQuery(state, param) {
    state.attemptedQuery = param
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
   if (message.response.data.startsWith("Netarchive freetext syntax not accepted") && message.response.status === 400) {
    this.dispatch('setNotification', 
      MessageHelper.$_getNotifierContentObject(state.attemptedQuery, message, true)
    )
    } else {
      this.dispatch('setNotification', 
      MessageHelper.$_getNotifierContentObject(state.attemptedQuery, message, false)
    )
  }
  state.loading = false
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

  /*Notification stuff - lets split this out later*/
  setNotification(state, notification) {
    console.log('setting notification')
    state.notifications.push(notification)
  },

  dismissNotification(state, notification) {
    Vue.delete(state.notifications, notification.__ob__.vmCount)
    this.dispatch('setLoadingStatus', false)
  }

}

export default new Vuex.Store({
  namespaced: true,
  state,
  actions,
  mutations
})

