<script setup lang="ts">
// import { storeToRefs } from 'pinia'
// import store from '@/store'
// import { toRaw } from 'vue'

const { activeFuncKey, openFuncKeys, menuList, AsyncComponentMap } = storeToRefs(store.dashboard)
const { removeTab, toggleTab } = store.dashboard

const tabClickHandler = (tabList) => {
  const tab = toRaw(tabList)
  toggleTab(tab.props.name)
}
</script>

<template>
  <el-tabs type="card" closable :model-value="activeFuncKey" @tab-click="tabClickHandler" @tab-remove="removeTab">
    <el-tab-pane v-for="key in openFuncKeys" :key="key"
      :label="menuList.find((item: Func) => item.func_key === key).func_name" :name="key">
      <component :is="AsyncComponentMap[key]"></component>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped>
</style>