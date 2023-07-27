<script setup lang="ts">
// import { ref, toRaw, nextTick } from 'vue'
// import { FormInstance } from "element-plus"

const model = ref<StaffModel>({ stf_id: 0, stf_name: '', stf_remark: '', stf_category: 0, stf_invalid: 1 })
const isEdit = ref<boolean>(false);  // 是否开启进入了编辑状态
const formRef = ref<FormInstance | null>(null)
interface PropsType { staffList: StaffModel[], dictionary: Dic[] }
const props = defineProps<PropsType>()
const rules = { // 表单验证规则（运行中是不会改变的，所以不要加ref/reactive）
  stf_name: [{
    //@ts-ignore
    validator: (rule: any, value: string, callback: (error?: Error) => void) => { //eslint-disable-line
      if (value === '')
        callback(new Error('* 教师名不能为空'))
      else if (value.length < 2 || value.length > 10)
        callback(new Error('* 教师名长度 2 - 10'))
      else if(props.staffList.filter(item => item.stf_id !== model.value.stf_id).some(stf => stf.stf_name === value)) // 同级唯一性验证
        callback(new Error('* 教师名不可重名'))
      else
        callback()
    },
    trigger: 'blur'
  }],
  stf_category: [{
    //@ts-ignore
    validator: (rule: any, value: string | null, callback: (error?: Error) => void) => { //eslint-disable-line
      if (model.value.stf_category === 0) {
        callback(new Error('* 必须绑定教师类型'))
      } else {
        callback()
      }
    },
    trigger: 'input'
  }]

}

// TS版本的defineEmitsType
interface EmitsType { (name: 'save', model: StaffModel): void; }
const emit = defineEmits<EmitsType>()

const saveHandler = async () => {
  await formRef.value?.validate() // 表单验证
  emit("save", toRaw(model.value))
}
interface EditRefType {
  beginAdd: () => void;
  beginUpdate: (id: number) => void;
  endEdit: () => void;
}
defineExpose<EditRefType>({
  beginAdd: () => {
    formRef.value?.resetFields(); // 重置表单
    model.value = { stf_id: 0, stf_name: '', stf_remark: '', stf_category: 0, stf_invalid: 1 }
    nextTick(() => {
      isEdit.value = true;
    });
  },
  beginUpdate:  (id: number) => {
    // @ts-ignore
    const mdl: StaffModel = props.staffList.find(item => item.stf_id === id)
    model.value = { ...mdl }
    nextTick(() => {
      isEdit.value = true;
    });
  },
  endEdit: () => {
    isEdit.value = false;
  },
});
</script>

<template>
  <el-dialog :model-value="isEdit" center title="教师信息编辑" width="500px" :show-close="false" :close-on-press-escape="false"
    :close-on-click-modal="false">
    <template #default>
      <el-form label-width="80px" :model="model" :rules="rules" ref="formRef">
        <el-form-item label="教师姓名:" style="line-height: 40px;" prop="stf_name">
          <el-input v-model="model.stf_name" placeholder="请输入教师名称.."></el-input>
        </el-form-item>
        <el-form-item label="教师类型:" prop="stf_category">
          <el-select v-model="model.stf_category">
            <el-option label="- 请选择 -" :value="0"></el-option>
            <el-option 
          v-for="item in dictionary.filter(edu => edu.dic_group_key === 'staff_category')" 
          :label="item.dic_name" :value="item.dic_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="model.stf_remark"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="saveHandler" type="primary" plain>保存</el-button>
      <el-button @click="isEdit = false" type="danger" plain>取消</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>