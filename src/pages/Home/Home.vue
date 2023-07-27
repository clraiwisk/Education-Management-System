<script setup lang="ts">
import HomeMenu from './HomeMenu.vue'
import store from '@/store'
import { useRouter } from 'vue-router';
import { onMounted } from 'vue'

const { getDictionary } = store.dashboard
onMounted(getDictionary)
const router = useRouter()
const logout = async () => {
  await ElMessageBox.confirm('退出登录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  router.replace('/login')
  const token: string = ""
  sessionStorage.setItem("token", token)
}
</script>

<template>
  <el-container>
    <el-aside width="250px">
      <div class="log">
        <div>
          <img class="xiaohui" src="@/assets/images/xiaohui.png" alt="">
        </div>
        <br>
        <h3>山东科技大学管理系统</h3>
      </div>
      <HomeMenu />
    </el-aside>
    <el-container>
      <el-header class="header" height="80px">教务管理系统v.1.0
        <img class="SDUSTLogo" src="../../assets/images/SDUSTLogo.png" alt="">
        <div class="user">
          <img class="touxiang" src="../../assets/images/user.png" alt="">
          <text class="username">admin</text>
          <el-button @click="logout">退出登录</el-button>
        </div>

      </el-header>

      <el-main>
        <div class="content"><router-view /></div>
      </el-main>
      <el-footer class="footer" height="30px">©2023 山东科技大学 版权所有: 2303H5</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 850px;

  .el-aside {
    background-color: rgb(21, 60, 101);
    padding: 0 10px;

    .log {
      width: 100%;
      text-align: center;
      padding-bottom: 20px;
      margin-top: 20px;

      h3 {
        color: white;
      }
    }
  }

  .el-header {
    background-color: white;
  }

  .el-main {
    // background-color: #eee;
    position: relative;

    .content {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 20px;

      // background-color: #fff;

    }
  }

  img.xiaohui {
    height: 40%;
    width: 40%;
  }

  .el-footer {
    background-color: white;
    text-align: center;
  }
}

.header {
  display: flex;
  font-size: 30px;
  font-weight: 800;
  line-height: 80px;
  color: #153C65;
  border-bottom: 1px solid rgb(178, 168, 168);
  justify-content: space-between;
  align-items: center;
}

.SDUSTLogo {
  height: 80px;
}

.footer {
  font-size: 12px;
  border-top: 1px solid rgb(178, 168, 168);
  line-height: 30px;
}

.user text {
  font: normal;
  font-size: 20px;
}

.user {
  display: flex;
  align-items: center;
}

.touxiang {
  width: 70px;
  border-radius: 100px;
  margin-right: 20px;
}

.username {
  margin-right: 20px;
}
</style>