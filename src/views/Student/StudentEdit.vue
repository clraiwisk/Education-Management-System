<script setup lang="ts">
// import { toRaw, nextTick, reactive, markRaw } from 'vue'

interface PropsType { studentList: StudentModel[], dictionary: Dic[] }
const props = defineProps<PropsType>()

const edit = reactive<Edit<StudentModel>>({
  isEdit: false,
  formRef: null,
  model: {
    stu_address: "", stu_avatar: "", stu_born: "", stu_cls_id: null, stu_id: 0, stu_name: "", stu_major: "",
    stu_phone: "", stu_phone2: "", stu_qualification: 0, stu_remark: "", stu_school: "", stu_sex: 1
  },
  rules: markRaw({
    stu_name: [
      {
        //@ts-ignore
        validator: (rule, value: string, callback: any) => {
          if (value.length === 0) callback(new Error('* 学生名不能为空'))
          else if (value.length > 10 || value.length < 2) callback(new Error('* 学生名长度为2—10'))
          else if (props.studentList.some((item: StudentModel) => item.stu_name === value && edit.model.stu_id !== item.stu_id))
            callback(new Error('* 学生名已存在'))
          else
            callback()
        }
      }
    ],
    stu_phone: [
      {
        //@ts-ignore
        validator: (rule, value: string, callback: any) => {
          if (value.length === 0) callback(new Error('* 电话号码不能为空'))
          else if (value.length !== 11) callback(new Error('* 请输入11位电话号码'))
          else
            callback()
        }
      },
    ]
  })
})

// TS版本的defineEmitsType
interface EmitsType { (name: 'save', model: StudentModel): void; }
const emit = defineEmits<EmitsType>()

const saveHandler = async () => {
  await edit.formRef?.validate() // 表单验证
  if (edit.model.stu_qualification === 0) {
    // 学历未选择
    ElMessage.warning('请选择学历');
    return;
  }
  emit("save", toRaw(edit.model))
}
interface EditRefType {
  beginAdd: () => void;
  beginUpdate: (id: number) => void;
  endEdit: () => void;
}
defineExpose<EditRefType>({
  beginAdd: () => {
    edit.formRef?.resetFields(); // 重置表单
    edit.model = {
      stu_address: "", stu_avatar: null, stu_born: "", stu_cls_id: null, stu_id: 0, stu_name: "", stu_major: "",
      stu_phone: "", stu_phone2: "", stu_qualification: 0, stu_remark: "", stu_school: "", stu_sex: 1
    }
    nextTick(() => {
      edit.isEdit = true;
    });
  },
  beginUpdate: (id: number) => {
    // @ts-ignore
    const mdl: StudentModel = props.studentList.find(item => item.stu_id === id)
    edit.model = { ...mdl }
    nextTick(() => {
      edit.isEdit = true;
    });
  },
  endEdit: () => {
    edit.isEdit = false;
  },
});
</script>

<template>
  <el-dialog :model-value="edit.isEdit" center title="学生信息编辑" width="600px" :show-close="false"
    :close-on-press-escape="false" :close-on-click-modal="false">
    <template #default>
      <el-form label-width="120px" :model="edit.model" :rules="edit.rules" :ref="el => edit.formRef = el">
        <el-form-item label="学生姓名:" style="line-height: 40px;" prop="stu_name">
          <el-input v-model="edit.model.stu_name" placeholder="请输入学生姓名..."></el-input>
        </el-form-item>
        <el-form-item label="性别:" style="line-height: 40px;">
          <el-radio-group v-model="edit.model.stu_sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话:" prop="stu_phone">
          <el-input v-model="edit.model.stu_phone" placeholder="请输入联系电话..." maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="备用电话:">
          <el-input v-model="edit.model.stu_phone2" placeholder="请输入备用电话..." maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="生日日期:">
          <el-date-picker v-model="edit.model.stu_born" type="date" value-format="YYYY-MM-DD"
            placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="学历:" required>
          <el-select v-model="edit.model.stu_qualification">
            <el-option label="--请选择--" :value="0"></el-option>
            <el-option v-for=" item in dictionary.filter(edu => edu.dic_group_key === 'qualification') "
              :label="item.dic_name" :value="item.dic_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在读/毕业学校:">
          <el-input v-model="edit.model.stu_school" placeholder="请输入毕业学校(选填)"></el-input>
        </el-form-item>
        <el-form-item label="在读/毕业学校:">
          <el-input v-model="edit.model.stu_major" placeholder="请输入在校学习专业(选填)"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址:">
          <el-input v-model="edit.model.stu_address" placeholder="请输入家庭住址..."></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="edit.model.stu_remark"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="saveHandler" type="primary" plain>保存</el-button>
      <el-button @click="edit.isEdit = false" type="warning" plain>取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="ts">

</style>