<template>
  <el-page-header @back="goBack" title="返回上一页" style="margin-bottom: 20px;">
    <template #content>
      <span class="text-large font-600 mr-3" v-text="headerTitle"></span>
    </template>
  </el-page-header>

  <div class="pwd-container">
    <div class="content-main">
      <div class="title">
        密码修改
      </div>
      <el-form inline align="center" :rules="rules" :model="model" label-width="200px" ref="formRef" status-icon>
        <el-form-item style="padding: 0 20px;" prop="oldPwd">
          <el-input placeholder="请输入原密码..." v-model.trim="model.oldPwd" style="width: 300px;" show-password>
            <template #prepend>请输入原密码</template>
          </el-input>
        </el-form-item>

        <el-form-item style="padding: 0 20px;" prop="newPwd">
          <el-input placeholder="请输入新密码..." v-model.trim="model.newPwd" style="width: 300px;" show-password>
            <template #prepend>请输入新密码</template>
          </el-input>
        </el-form-item>

        <el-form-item style="padding: 0 20px;" prop="newPwdConfirm">
          <el-input placeholder="请再次输入密码..." v-model.trim="model.newPwdConfirm" style="width: 300px;" show-password>
            <template #prepend>密码确认</template>
          </el-input>
        </el-form-item>

        <el-form-item style="padding: 0 20px;">
          <el-button @click="savePwd" style="width: 125px; margin-right: 0;">确定</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script setup lang="ts">
import api from '@/api';

// 初始数据
const headerTitle = ref<string>('密码管理')
const router = useRouter()
const goBack = (): void => {
  router.back()
}

const model: Ref<Password> = ref({ oldPwd: '', newPwd: '', newPwdConfirm: '' })

const formRef = ref<any>(null) //eslint-disable-line

const rules = { // 表单验证规则（运行中是不会改变的，所以不要加ref/reactive）
  oldPwd: [{
    //@ts-ignore
    validator: (rule: any, value: string, callback: (error?: Error) => void) => { //eslint-disable-line
      if (value === '') {
        callback(new Error('* 密码不能为空'))
      } else if (value.length < 2 || value.length > 10) {
        callback(new Error('* 密码长度 2 - 10'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }],
  newPwd: [{
    //@ts-ignore
    validator: (rule: any, value: string, callback: (error?: Error) => void) => { //eslint-disable-line
      if (value === '') {
        callback(new Error('* 密码不能为空'))
      } else if (value.length < 2 || value.length > 10) {
        callback(new Error('* 密码长度 2 - 10'))
      } else if (model.value.oldPwd === model.value.newPwd) {
        callback(new Error('* 新密码与旧密码不能相同'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }],
  newPwdConfirm: [{
    //@ts-ignore
    validator: (rule: any, value: string, callback: (error?: Error) => void) => { //eslint-disable-line
      if (value === '') {
        callback(new Error('* 密码不能为空'))
      } else if (value.length < 2 || value.length > 10) {
        callback(new Error('* 密码长度 2 - 10'))
      } else if (model.value.newPwd !== model.value.newPwdConfirm && model.value.newPwd !== '') {
        callback(new Error('* 两次输入密码不一致'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }]
}
const savePwd = async (): Promise<void> => {
  // 表单验证
  await formRef.value?.validate()
  await ElMessageBox.confirm(
    '是否修改密码？',
    '警告',
    {
      confirmButtonText: '修改',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
    }
  )
    .then(async () => {
      console.log(123)
      await api.user.updateUserPwd(model.value)
      ElMessage({
        type: 'success',
        message: '修改密码成功，请重新登录...',
      }),
      router.replace('/login')
      const token: string = ""
      sessionStorage.setItem("token", token)
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '取消修改',
      })
    }
    )
  model.value = { oldPwd: '', newPwd: '', newPwdConfirm: '' }


}
</script>

<style lang="scss" scoped>
.title {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #153C65;
  font-size: 24px;
  margin-bottom: 30px;
  border-radius: 8px;
}
</style>