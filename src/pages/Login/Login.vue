<script setup lang="ts">
import api from '../../api'
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import type { ElForm, FormRules } from "element-plus"// 从element-plus 导入类型

const router = useRouter()

interface Login { user_name: string; user_pwd: string; } // 定义Login 类型
const model = reactive<Login>({ user_name: '', user_pwd: '' })
const rules: FormRules = {
  user_name: [
    { required: true, message: '* 用户名不能为空', trigger: 'blur' },
    { min: 2, max: 16, message: '* 用户名长度为2 - 16', trigger: 'blur' }
  ],
  user_pwd: [
    { required: true, message: '* 密码不能为空', trigger: 'blur' },
    { min: 2, max: 16, message: '* 密码长度为2 - 16', trigger: 'blur' }
  ]
}
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
//使用ref关联表单 表示 InstanceType 的实例对象
const login = async () => {
  await formRef.value?.validate();
  let token: string = ""
  token = await api.user.login(model)
  sessionStorage.setItem('token', token)
  sessionStorage.setItem('name', model.user_name)
  router.replace('/home')
}
</script>

<template>
  <div class="background-video">
    <video autoplay muted loop class="fullscreenvideo">
      <source src="../../../public/media/sdust-bg.mp4" type="video/mp4">
    </video>
  </div>
  <div class="box">
    <h3><img class="xiaohui" src="../../assets/images/xiaohui.png" alt="">山东科技大学教务管理系统</h3>
    <el-form ref="formRef" :rules="rules" status-icon :model="model">
      <el-form-item class="name" prop="user_name">
        <el-input placeholder="请输入用户名··" type="text" v-model.trim="model.user_name">
          <template #prepend>
            <span class="label">用户名</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="user_pwd">
        <el-input placeholder="请输入密码··" type="password" v-model="model.user_pwd" show-password>
          <template #prepend>
            <span class="label">密码</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.box {
  width: 450px;
  padding: 30px 50px;
  box-sizing: border-box;
  position: absolute;
  left: 27%;
  top: 50%;
  transform: translate(50%, -50%);
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.24);
  background-color: rgba(255, 255, 255, 0.8);

  h3 {
    display: flex;
    justify-content: space-evenly;
    color: #666;
    font-size: 24px;
    text-align: center;
    margin: 10px 0 20px;
  }

  .el-input {
    height: 45px;
    margin-bottom: 10px;

    .label {
      display: inline-block;
      width: 40px;
      font-size: 16px;
    }
  }

  .el-button {
    font-size: 16px;
    padding: 20px 80px;
    margin-left: 90px;
  }
}
.background-video{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  object-fit: cover;
}
.fullscreenvideo {
  width: 100%;
  height: 100%;
  object-fit: cover
}
  
.background-video video {
  min-width: 100%;
  min-height: 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.xiaohui {
  height: 33px;
}
</style>

<style>
.el-form-item__error {
  position: absolute;
  top: 100%;
  left: 25%;
}
</style>