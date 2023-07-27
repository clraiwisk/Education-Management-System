<template>
  <el-dialog :model-value="isEdit" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"
    title="用户编辑" style="width: 500px;" draggable>
    <template #default>
      <el-form label-width="120px" :rules="rules" :model="model" ref="formRef" status-icon>

        <el-form-item label="用户名：" prop="user_name">
          <el-input placeholder="请输入用户名..." disabled="model.user_name !== 0" v-model.trim="model.user_name"></el-input>
        </el-form-item>

        <el-form-item label="用户密码：" prop="user_pwd">
          <el-input placeholder="请输入密码..." v-model.trim="model.user_pwd"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="saveHandler">确定</el-button>
          <el-button @click="isEdit = false">取消</el-button>
        </el-form-item>
      </el-form>
    </template>

  </el-dialog>
</template>

<script setup lang="ts">

// 关联表单
const formRef = ref<any>(null) //eslint-disable-line
const model = ref<Sysuser>({ role_id: 0, user_name: '', user_pwd: '' }) // 与表单进行双向绑定
const isEdit: Ref<boolean> = ref(false) // 是否开启进入了编辑状态

const rules = { // 表单验证规则（运行中是不会改变的，所以不要加ref/reactive）
  user_name: [{
    //@ts-ignore
    validator: (rule: any, value: string, callback: (error?: Error) => void) => { //eslint-disable-line
      if (value === '') {
        callback(new Error('* 用户名不能为空'))
      } else if (value.length < 2 || value.length > 15) {
        callback(new Error('* 用户名长度 2 - 15'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }],
  user_pwd: [{
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
  }]
}

//@ts-ignore
const emit = defineEmits(['saveSysuser'])
const saveHandler = async (): Promise<void> => {
  await formRef.value?.validate() // 表单验证
  emit('saveSysuser', model.value)
}

defineExpose({ //eslint-disable-line
  beginAdd: (): void => {
    formRef.value?.resetFields() // 重置表单
    model.value = { role_id: 0, user_name: '', user_pwd: '' }
    nextTick(() => { isEdit.value = true })
  },
  beginUpdate: async (modelList: Sysuser): Promise<void> => {
    formRef.value?.resetFields() // 重置表单
    model.value = modelList
    nextTick(() => { isEdit.value = true })
  },
  endEdit: (): void => { isEdit.value = false },
  model
})
</script>

<style lang="sass" scoped>
.el-dialog
  width: 300px
</style>

<style lang="sass">
.el-overlay-dialog 
  position: absolute

.el-overlay 
  position: absolute
</style>
