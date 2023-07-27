<script setup lang="ts">
import { arr2tree } from "@/utils/common.js"
// import { FormInstance } from "element-plus"
// import { ref, watch, computed, toRaw, nextTick } from 'vue'
import api from "@/api";

type SysAllFuncMap = {
  [key: string]: string
}
const sysAllFuncMap: SysAllFuncMap = ({
  role: '角色功能管理',
  sysUser: '系统用户管理',
  sysRole: '系统角色管理',
  staff: '教师管理',
  class: '班级管理',
  classroom: '教室管理',
  student: '学生管理',
  password: '密码修改'
});
// TS版本的defineProps
interface PropsType { allFunc: Func[] }
const props = defineProps<PropsType>()
const formRef = ref<FormInstance | null>(null)
const model = ref<Func>({ func_id: 0, func_name: "", func_fid: 0, func_key: '' }) // 与表单进行双向绑定
const isEdit = ref<boolean>(false);  // 是否开启进入了编辑状态
const isLeaf = ref<boolean>(false);  // 标识是否是叶子节点
const rules = {             // 表单验证规则（运行中是不会改变的，所以不要加ref/reactive） 
  func_name: [{
    // @ts-ignore
    validator: (rules: any, value: any, callback: any) => {
      if (value === "")  // 非空验证
        callback(new Error('* 功能名不能为空'))
      else if (value.length < 2 || value.length > 10) // 长度验证
        callback(new Error('* 功能名长度 2 - 10'))
      // @ts-ignore
      else if (props.allFunc.filter(item => item.func_id !== model.value.func_id).some(func => func.func_fid === model.value.func_fid
        && func.func_name === value)) // 同级唯一性验证
        callback(new Error('* 同级兄弟节点不可重名！'))
      else
        callback()
    },
    trigger: 'blur'
  }],
  func_key: [{
    // @ts-ignore
    validator: (rules: any, value: string, callback: any) => {
      if (isLeaf.value && value === '')
        callback(new Error('* 叶子节点必须绑定功能！'));
      else
        callback();
    },
    trigger: 'change'
  }]
}
watch(isLeaf, (newValue) => { if (!newValue) model.value.func_key = '' });
const cascaderValue = computed<number[]>({                // el-cascader需要双向绑定的计算属性
  // @ts-ignore
  get() { return model.value.func_fid },
  set(arr: number[]) { model.value.func_fid = arr[arr.length - 1] },
  writable: true
})
const allFuncTreeWithNoLeaf = computed(() => [{ // el-cascader需要的仅包含非叶子节点的树形数据
  func_id: 0, func_name: 'root', func_fid: -1, func_key: '',
  // @ts-ignore
  children: arr2tree(props.allFunc.filter(item => item.func_key === ''), 'func_id', 'func_fid')
}])

// TS版本的defineEmitsType
interface EmitsType { (name: 'save', func: Func): void; }
const emit = defineEmits<EmitsType>(); // eslint-disable-line

const saveHandler = async () => {
  await formRef.value?.validate() // 表单验证
  emit("save", toRaw(model.value))
}
interface EditRefType {
  beginAdd: (fid: number) => void;
  beginUpdate: (id: number) => void;
  endEdit: () => void;
}
defineExpose<EditRefType>({
  beginAdd: (func_fid: number) => {
    formRef.value?.resetFields(); // 重置表单
    model.value = { func_id: 0, func_name: '', func_fid, func_key: '' };
    isLeaf.value = false;
    nextTick(() => {
      isEdit.value = true;
    });
  },
  beginUpdate: async (id: number) => {
    model.value = await api.func.getModel(id)
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
  <el-dialog center :model-value="isEdit" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"
    title="系统功能编辑" width="500px">
    <template #default>
      <el-form label-width="130px" :rules="rules" :model="model" ref="formRef" status-icon>
        <el-form-item label="功能节点类型：" v-show="model.func_id === 0">
          <el-radio-group v-model="isLeaf">
            <el-radio :label="false">非叶子节点</el-radio>
            <el-radio :label="true">叶子节点</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="节点功能名称：" prop="func_name">
          <el-input placeholder="请输入节点功能名称.." v-model.trim="model.func_name"></el-input>
        </el-form-item>
        <el-form-item label="节点父功能：">
          <el-cascader :disabled="model.func_id === 0" :options="allFuncTreeWithNoLeaf"
            :props="{ label: 'func_name', value: 'func_id', checkStrictly: true }" v-model="cascaderValue"></el-cascader>
        </el-form-item>
        <el-form-item label="绑定功能：" v-show="isLeaf" prop="func_key">
          <el-select v-model="model.func_key" placeholder="--请选择--">
            <el-option v-for="(value, key) in sysAllFuncMap" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="saveHandler">确定</el-button>
      <el-button @click="isEdit = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>