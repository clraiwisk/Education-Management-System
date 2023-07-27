<script setup lang="ts">
import { ref, toRaw, nextTick } from 'vue'
import { FormInstance } from "element-plus"

const model = ref<ClassModel>({
  cls_begin: null,
  cls_clsr_id: null,
  cls_dic_id_major: 0,
  cls_end: null,
  cls_id: 0,
  cls_name: "",
  cls_remark: "",
  cls_stf_id_admin: 0,
  cls_stf_id_admin_name: '',
  cls_stf_id_job: 0,
  cls_stf_id_job_name: '',
  cls_stf_id_teacher: 0,
  cls_stf_id_teacher_name: '',
})
const isEdit = ref<boolean>(false);  // 是否开启进入了编辑状态
const formRef = ref<FormInstance | null>(null)
interface PropsType { classList: ClassModel[], staffList: StaffModel[], dictionary: Dic[] }
const props = defineProps<PropsType>()
const rules = { // 表单验证规则（运行中是不会改变的，所以不要加ref/reactive）
  cls_name: [{
    //@ts-ignore
    validator: (rule: any, value: string, callback: (error?: Error) => void) => { //eslint-disable-line
      if (value === '')
        callback(new Error('* 班级名不能为空'))
      else if (value.length < 2 || value.length > 10)
        callback(new Error('* 班级名长度 2 - 6个字符'))
      else if (props.classList.filter(item => item.cls_id !== model.value.cls_id).some(cls => cls.cls_name === value)) // 同级唯一性验证
        callback(new Error('* 与现有班级名重复'))
      else
        callback()
    },
    trigger: 'blur'
  }],
  cls_stf_id_admin: [{
    //@ts-ignore
    validator: (rule: any, value: string | null, callback: (error?: Error) => void) => { //eslint-disable-line
      if (model.value.cls_stf_id_admin === 0) {
        callback(new Error('* 此项必选'))
      } else {
        callback()
      }
    },
    trigger: 'input'
  }],
  cls_dic_id_major: [{
    //@ts-ignore
    validator: (rule: any, value: string | null, callback: (error?: Error) => void) => { //eslint-disable-line
      if (model.value.cls_dic_id_major === 0) {
        callback(new Error('* 此项必选'))
      } else {
        callback()
      }
    },
    trigger: 'input'
  }],
  cls_stf_id_teacher: [{
    //@ts-ignore
    validator: (rule: any, value: string | null, callback: (error?: Error) => void) => { //eslint-disable-line
      if (model.value.cls_stf_id_teacher === 0) {
        callback(new Error('* 此项必选'))
      } else {
        callback()
      }
    },
    trigger: 'input'
  }],
  cls_stf_id_job: [{
    //@ts-ignore
    validator: (rule: any, value: string | null, callback: (error?: Error) => void) => { //eslint-disable-line
      if (model.value.cls_stf_id_job === 0) {
        callback(new Error('* 此项必选'))
      } else {
        callback()
      }
    },
    trigger: 'input'
  }]

}

// TS版本的defineEmitsType
interface EmitsType { (name: 'save', model: ClassModel): void; }
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
    model.value = {
      cls_begin: null,
      cls_clsr_id: null,
      cls_dic_id_major: 0,
      cls_end: null,
      cls_id: 0,
      cls_name: "",
      cls_remark: "",
      cls_stf_id_admin: 0,
      cls_stf_id_admin_name: '',
      cls_stf_id_job: 0,
      cls_stf_id_job_name: '',
      cls_stf_id_teacher: 0,
      cls_stf_id_teacher_name: ''
    }
    nextTick(() => {
      isEdit.value = true;
    });
  },
  beginUpdate: (id: number) => {
    //@ts-ignore
    const mdl: ClassModel = props.classList.find((item: ClassModel) => item.cls_id === id)
    model.value = { ...mdl }
    //将回调函数延迟在下一次dom更新数据后调用
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
  <el-dialog :model-value="isEdit" center title="班级信息编辑" width="500px" :show-close="false" :close-on-press-escape="false"
    :close-on-click-modal="false">
    <template #default>
      <el-form label-width="80px" :model="model" :rules="rules" ref="formRef">
        <el-form-item label="班级名称:" style="line-height: 40px;" prop="cls_name">
          <el-input v-model="model.cls_name" placeholder="请输入班级名称.."></el-input>
        </el-form-item>
        <el-form-item label="班级专业:" prop="cls_dic_id_major">
          <el-select v-model="model.cls_dic_id_major">
            <el-option label="- 请选择 -" :value="0"></el-option>
            <el-option v-for="item in dictionary.filter(edu => edu.dic_group_key === 'class_major')"
              :label="item.dic_name" :value="item.dic_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教学老师:" prop="cls_stf_id_teacher">
          <el-select v-model="model.cls_stf_id_teacher">
            <el-option label="- 请选择 -" :value="0"></el-option>
            <el-option v-for="item in props.staffList.filter(stf => stf.stf_category === 4 && stf.stf_invalid === 1)"
              :label="item.stf_name" :value="item.stf_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教务老师:" prop="cls_stf_id_admin">
          <el-select v-model="model.cls_stf_id_admin">
            <el-option label="- 请选择 -" :value="0"></el-option>
            <el-option v-for="item in props.staffList.filter(stf => stf.stf_category === 5 && stf.stf_invalid === 1)"
              :label="item.stf_name" :value="item.stf_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="就业老师:" prop="cls_stf_id_job">
          <el-select v-model="model.cls_stf_id_job">
            <el-option label="- 请选择 -" :value="0"></el-option>
            <el-option v-for="item in props.staffList.filter(stf => stf.stf_category === 6 && stf.stf_invalid === 1)"
              :label="item.stf_name" :value="item.stf_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="model.cls_remark"></el-input>
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