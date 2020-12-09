/**
 * Utils
 * 
 */


 export default {
// Helper to remove query param from route - not a real mixin as it is used in store 
$_removeQueryParamFromRoute(queryVal, router) {
  let queryParams = { ...router.history.current.query } 
  
  Object.keys(queryParams).map(function (index) {
    console.log(router.history.current.query[index])
    if (queryParams[index] === queryVal) {
         delete queryParams[index] 
    }
  })
  
  router.replace({query: queryParams })
  }
}