/**
 * Helpers for sending error notifications
 * 
 */

 export default {
  $_getNotifierContentObject(attemptedQuery, message, termSearchError) {
  if (termSearchError) {
    return {
      title: 'We know it\'s all about searching',
      text: `However, your query <span class="queryNotification">'${attemptedQuery}'</span> shall not pass. 
      <div class="notificationSubText"><a href="#/about">Read why your search ended in this mess</a></div>`,
      type: 'error',
      timeout: false
   }
  } else {
    return {
      title: 'We are so sorry!',
      text: `Something went wrong with your search '${attemptedQuery}'  - please try again`,
      srvMessage: message.response.data,
      type: 'error',
      timeout: false
   }
} 
}
  }