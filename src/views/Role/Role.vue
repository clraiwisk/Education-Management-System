<template>
  <el-row :gutter="12">
    <el-col v-for="item in list" :key="item.role_id" :span="4">
      <el-card shadow="hover">
        <span style="text-align: center;display: inline-block;width: 100%;font-size: 20px;font-weight: 600;">
          {{ item.role_name }}</span>
        <el-button-group style="margin-top: 20px;" class="buttonGrounp">
          <el-button @click="beginUpdate(item)" type="primary" style="width: 100%;border-radius: 5px"><el-icon>
              <Edit />
            </el-icon>编辑</el-button>
          <el-button type="danger" style="width: 100%;border-radius: 5px;margin-top: 10px;"
            @click="delHandler(item.role_id)"><el-icon>
              <Delete />
            </el-icon>删除</el-button>
          <el-button @click="beginRoleFencSetting(item.role_id)"
            style="width: 100%;border-radius: 5px;margin-top: 10px;"><el-icon>
              <Operation />
            </el-icon>功能分配</el-button>
        </el-button-group>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card shadow="hover" @click="beginAdd" style="text-align: center;">
        <span>+添加</span>
      </el-card>
    </el-col>
  </el-row>
  <el-dialog title="角色编辑" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
    :model-value="edit.isEdit">
    <el-form :model="edit.model" :rules="edit.rules" :ref="el => edit.formRef = el">
      <el-form-item prop="role_name" label="角色名：">
        <el-input v-model.trim="edit.model.role_name"></el-input>
      </el-form-item>
      <el-form-item style="display: flex; justify-content: center;">
        <el-button @click="save">确定</el-button>
        <el-button @click="edit.isEdit = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-drawer title="角色功能分配" :model-value="isSetting" :close-on-click-modal="false" :close-on-press-escape="false"
    destroy-on-close :show-close="false">
    <el-container style="height: 100%;">
      <el-main>
        <el-tree ref="treeRef" :data="allFuncTree" class="custom-tree" show-checkbox :props="{ label: 'func_name' }"
          default-expand-all :expand-on-click-node="false" node-key="func_id"
          :default-checked-keys="defaultCheckedKeys"></el-tree>
      </el-main>
      <el-footer>
        <el-button @click="saveRoleFuncSetting">确定</el-button>
        <el-button @click="isSetting = false">取消</el-button>
      </el-footer>
    </el-container>
  </el-drawer>
</template>

<script lang="ts" setup>
import api from '@/api'
import { Operation, Edit, Delete } from '@element-plus/icons'
import { useFuncList } from '@/hooks/useFuncList'

const { list } = storeToRefs(store.role)
const { init, addRole, updateRole } = store.role

const edit = reactive<Edit<Role>>({
  isEdit: false,
  formRef: null,
  model: { role_id: 0, role_name: "" },
  rules: markRaw({
    role_name: [
      {
        //@ts-ignore
        validator: (rule, value: string, callback: any) => {
          if (value.length === 0) callback(new Error('* 角色名不能为空'))
          else if (value.length > 10 || value.length < 2) callback(new Error('* 角色名长度为2—10'))
          else if (list.value.some((item: Role) => item.role_name === value && edit.model.role_id !== item.role_id))
            callback(new Error('* 角色名已存在'))
          else
            callback()
        }
      }
    ]
  })
})
const beginAdd = () => {
  edit.formRef?.resetFields()
  edit.model = { role_id: 0, role_name: "" }
  edit.isEdit = true
};
const beginUpdate = (role: Role) => {
  edit.formRef?.resetFields()
  edit.model = { ...role }
  edit.isEdit = true
}

const save = async () => {
  if (edit.model.role_id === 0)
    await addRole(edit.model)
  else
    await updateRole(edit.model)
  ElMessage.success({ message: '编辑成功', type: 'success' })
  nextTick(() => { edit.isEdit = false })
}

onMounted(() => init())


//角色功能分配
const defaultCheckedKeys = shallowRef<number[]>([])
const { allFuncTree } = useFuncList()
const isSetting = ref<boolean>(false)
const treeRef = ref<any>(null)
const roleId = ref<number>(0)
const beginRoleFencSetting = async (id: number) => {
  roleId.value = id
  // defaultCheckedKeys.value = await api.role.getFuncIds(id)
  const allFunc = await api.func.getAll()
  const fussed = await api.role.getFuncIds(id)

  let ids = fussed.reduce((arr: any[], item: { func_id: number; }) => {
    if (allFunc.some(item2 => item2.func_id === item.func_id && item2.func_key !== "")) arr.push(item.func_id);
    return arr;
  }, []);
  defaultCheckedKeys.value = ids
  //显示抽屉，开始角色功能分配
  isSetting.value = true
}
const saveRoleFuncSetting = async () => {
  //搜集树形控件中 勾选和半勾选的所有节点的key值组成一个数组
  const role_func = [...treeRef.value.getCheckedKeys(), ...treeRef.value.getHalfCheckedKeys()]
  //将数组中的0去掉
  if (role_func.length > 0) role_func.splice(role_func.indexOf(0), 1)
  const role_func_ids = role_func.toString()
  // //调用api发送ajax
  await api.role.setFuncIds({ role_id: roleId.value, role_func_ids })
  ElMessage.success({ message: "添加成功...", type: "success" })
  isSetting.value = false
}


// 删除
const delHandler = async (id: number) => {
  await ElMessageBox.confirm('是否要删除该角色？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });

  await api.role.remove(id);
  init();
}
</script>

<style lang="scss" scoped></style>
