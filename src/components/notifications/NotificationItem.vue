<template>
  <div class="notification"
       :class="current === true ? notification.type : notification.type + ' collapsed'">
    <button class="notificationCloseBtn"
            type="button"
            @click="doDismiss(notification)">
      ✕
    </button>
    <h2 v-if="notification.title">
      {{ notification.title }}
    </h2>
    <p v-html="notification.text" />
    <br>
    <p v-if="notification.srvMessage">
      <span>server message: </span>{{ notification.srvMessage }}
    </p>
  </div>
</template>

<script>
import { mapState} from 'vuex'

export default {
  name: 'NotificationItem',
 
  props: {
    notification: {
      type: Object,
      required: true,
      validator: function (obj) {
      return 'type' in obj &&
            'title' in obj &&
            'text' in obj
      }
    },
    current: {
      type:Boolean,
      required:true
    }
  },

  computed: {
    ...mapState({
      notifications: state => state.notifications
    }),
  },

  mounted () {
    let timeout = Object.prototype.hasOwnProperty.call(this.notification, 'timeout') ? this.notification.timeout : true
        if (timeout) {
  	        let delay = this.notification.delay || 5000
            this.timer = setTimeout(() => {
            this.doDismiss(this.notification)
        }, delay)
    }
  },
 
  methods: {
     doDismiss: function (notification) {
    	clearTimeout(this.timer)
      this.$emit('dismiss-notification', notification)
    }
  }
}

</script>

    
