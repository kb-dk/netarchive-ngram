import Vue from 'vue'
import Vuex from 'vuex'
import {searchService} from '../services/SearchService'
import MessageHelper from '../components/helpers/messageHelper'
import Utils from '../components/helpers/utils'

Vue.use(Vuex)

// Global search state.

const initialState = () => ({
  query: '',
  loading:false,
  // cache for current query in case server rejects it
  attemptedQuery:'',
  yearCountPercent: [],
  yearCountsTotal: [],
  datasetQueries:[],
  datasets:[],
  notifications: [],
  badQueries:[] 
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
    //console.log('router', params.router)
   commit('setLoadingStatus', true)
   commit('updateAttemptedQuery', params.query)
   

   searchService.search(params.query)
   .then(results => {this.dispatch('updateQuery', params.query), commit('doSearchSuccess', results)}, error =>
   /**Yes I know it looks funky with injection of the router in the action payload 
      but I couldn't find another way and this 'hack' was suggested by Mr. Vue himself
      https://github.com/vuejs/vue-hackernews-2.0/issues/171 */ 
   commit('doSearchError', {error:error, router:params.router}))
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
      })
    state.loading = false
  },

  doSearchError(state, message) {
    
    
   if (message.error.response.data.startsWith('Netarchive freetext syntax not accepted') && message.error.response.status === 400) {
    this.dispatch('setNotification', 
      MessageHelper.$_getNotifierContentObject(state.attemptedQuery, message.error, true)
    )
    if (!state.badQueries.includes(state.attemptedQuery.toLowerCase())){
    state.badQueries.push(state.attemptedQuery)
    }

    } else {
      this.dispatch('setNotification', 
      MessageHelper.$_getNotifierContentObject(state.attemptedQuery, message.error, false)
    )
  }
  /** We have to correct the URL param here because we use the push to trigger 
   search and we need server respons to know something went wrong*/
  Utils.$_removeQueryParamFromRoute(state.attemptedQuery, message.router)
  
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

