<script setup lang="ts">
import { Menu, Promotion } from '@element-plus/icons'

const props = defineProps(['data'])// eslint-disable-line
</script>

<template>
  <template v-for="item in props.data" :key="item.func_id">
    <el-sub-menu v-if="item.func_key === ''" :index="item.func_id.toString()">
      <template #title>
        <el-icon>
          <Menu />
        </el-icon>
        <span class="title" v-text="item.func_name"></span>
      </template>
      <HomeMenuContent v-if="item.children" :data="item.children"></HomeMenuContent>
    </el-sub-menu>
    <el-menu-item v-else :index='`/home/${item.func_key}`'>
      <el-icon>
        <Promotion />
      </el-icon>
      {{ item.func_name }}
    </el-menu-item>
  </template>
</template>

<style lang="scss">
div.el-sub-menu__title {
  font-size: 16px !important;
}

div.el-sub-menu__title:hover {
  background-color: rgba(12, 34, 58, 1);
}

li.el-sub-menu {
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.5s;

  span.title {
    color: #fff;
  }
}

li.el-sub-menu.is-opened {
  background-color: rgba(12, 34, 58, 1);
  border-radius: 10px;
  overflow: hidden;
}

ul.el-menu .el-menu--inline {
  background-color: transparent;

  li {
    color: #fff;
  }

  li:hover {

    background-color: rgb(22, 44, 68);
  }

  li.is-active {
    background-color: rgb(22, 44, 68);
  }
}

.el-sub-menu i {
  color: #fff;
  font-size: 16px !important;
}
</style>