<template>
    <div v-if="loading" class="spinner">
      <div class="spinnerContainer">
          <div class="dot" />
          <div class="dot" /> 
          <div class="dot" /> 
          <div class="dot" />
          <div class="dot" /> 
          <div class="dot" />
          <div class="dot" />
          <div class="dot" /> 
          <div class="dot" /> 
          <div class="dot" />
          <div class="dot" />
          <div class="dot" />
          <div class="dot" /> 
          <div class="dot" /> 
          <div class="dot" />    
        </div>
    </div>
</template>
<script>
import { mapState} from 'vuex'

export default {
  name: 'Spinner',
  computed: {
    ...mapState({
      loading: state => state.loading,
    })
  }
}
</script>
