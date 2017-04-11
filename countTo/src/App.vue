<template>
  <div id="app">
    <div>

    </div>
    <countTo class='apple' ref="countTo" :startVal='100' :decimals=1 :endVal='1000' @callback='callback'></countTo>
    <countTo class='apple' ref="countTo2" :startVal='5000' :decimals=1 :endVal='0' @mountedCallback="mountedCallback" @callback='callback'></countTo>
    <div @click='start'>开始</div>
    <template v-if='started'>
      <div v-show='!paused' @click='pause'>暂停</div>
      <div v-show='paused' @click='resume'>恢复</div>
    </template>
     <div  @click='reset'>reset</div>
  </div>
</template>

<script>
import countTo from './component/vue-countTo.vue';
export default {
  name: 'app',
  components: { countTo },
  data() {
    return {
      started: false,
      paused: false,
      reseted: false
    }
  },
  methods: {
    callback() {
      console.log('callback')
    },
    start() {
      this.started = true;
      this.$refs.countTo.start();
    },
    pause() {
      this.paused = true;
      this.$refs.countTo.pause();
    },
    resume() {
      this.paused = false;
      this.$refs.countTo.resume();
    },
    reset() {
      this.$refs.countTo.reset();
    },
    mountedCallback() {
      // this.$refs.countTo2.start();
    }
  }
}
</script>

<style>

</style>
