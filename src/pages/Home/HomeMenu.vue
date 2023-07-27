<script setup lang="ts">
import HomeMenuContent from './HomeMenuContent.vue'
// import store from '@/store'
// import { storeToRefs } from 'pinia'

const { menuTree } = storeToRefs(store.dashboard)
</script>

<template>
  <el-menu router unique-opened collapse-transition>
    <HomeMenuContent :data="menuTree"></HomeMenuContent>
  </el-menu>
</template>

<style lang="scss" scoped>
.el-menu {
  background-color: #153c65;
  border: none;
}
</style>