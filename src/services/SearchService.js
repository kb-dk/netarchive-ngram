import axios from 'axios'
import Configs from '../config/configs'


export const searchService = {
  search,
}

function search (query) {
  const url = `${Configs.SERVICE_URL}?q=${encodeURIComponent(query)}&startyear=${Configs.START_YEAR}`
  return axios.get(url).then(response => {
    return response.data
  }).catch(error => {
    return Promise.reject(error)
  })
}


