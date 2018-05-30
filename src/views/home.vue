<template>
  <div class="wrapper">
    <fj-Header></fj-Header>
    <fj-Sidebar></fj-Sidebar>
    <div class="content">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
    import fjHeader from './common/Header.vue'
    import fjSidebar from './common/Sidebar.vue'

    export default {
      components: {
        fjHeader, fjSidebar
      }
    }
</script>
