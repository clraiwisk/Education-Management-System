<template>
  <el-page-header @back="goBack" title="返回上一页" style="margin-bottom: 20px;">
    <template #content>
      <span class="text-large font-600 mr-3" v-text="headerTitle"></span>
    </template>
  </el-page-header>

  <div>
    <el-form inline align="left" class="formlist" style="position: relative; margin-bottom: 20px;">
      <el-header style="height: 40px;">

        <el-form-item label="用户姓名：" class="divlist">
          <el-input @change="currentPage = 1" placeholder="请输入搜索内容..." clearable v-model="search.user_name">
          </el-input>
        </el-form-item>

        <el-form-item label="用户角色：">
          <el-select @change="currentPage = 1" v-model="search.role_id">
            <el-option label="- 全部用户 -" :value="-1"></el-option>
            <el-option label="- 无角色 -" :value="0"></el-option>
            <el-option v-for="(item, id) in roleList" :key="id" :label="item.role_name" :value="item.role_id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="success" plain @click="sysuserEditRef?.beginAdd">
            <el-icon style="margin-right: 5px;">
              <Plus />
            </el-icon>
            新增</el-button>
        </el-form-item>

      </el-header>
    </el-form>


    <el-table :data="list" style="border-top: 1px solid #eee;">
      <el-table-column type="index" width="60" align="center" label="序号"></el-table-column>
      <el-table-column label="用户名" width="150" align="center">
        <template #default="{ row }">
          <span v-text="row.user_name"></span>
        </template>
      </el-table-column>

      <el-table-column label="用户密码" width="180" align="center">
        <template #default="{ row }">

          <el-tooltip trigger="click" placement="right" effect="light">
            <template #content>
              <div v-text="'密码'" style="width: 100px; margin-bottom: 10px;"></div>
              <span v-text="row.user_pwd"></span>
            </template>
            <el-button type="primary" link>
              <el-icon style="margin-right: 5px;">
                <View />
              </el-icon>
              预览</el-button>
          </el-tooltip>

          <!-- <span v-text="dictionary.find((item: Dictionary) => item.dic_id === row.stf_category).dic_name"></span> -->
        </template>
      </el-table-column>

      <el-table-column label="角色" width="150" align="center">
        <template #default="{ row }">
          <span v-if="row.role_id === null" style="color: #ddd;">无角色</span>
          <span v-else v-text="roleList.find((item: Role) => item.role_id === row.role_id)?.role_name"></span>
          <!-- <span v-text="dictionary.find((item: Dictionary) => item.dic_id === row.stf_category).dic_name"></span> -->
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="300" align="left">
        <template #default="{ row }">
          <el-button type="warning" plain
            @click="sysuserEditRef?.beginUpdate({ ...list.find((item: Sysuser) => item.role_id === row.role_id) })">
            <el-icon style="margin-right: 5px;">
              <Edit />
            </el-icon>
            修改</el-button>

          <el-button type="danger" plain @click="delHandler(row.user_name)">
            <el-icon style="margin-right: 5px;">
              <Delete />
            </el-icon> 删除</el-button>

          <el-tooltip trigger="contextmenu" placement="right" effect="light" :visible="row.visibleTooltip">
            <template #content>
              <div style="width: 355px; margin-bottom: 15px; font-size: 16px;">
                <span v-text="row.user_name"></span> -
                <span>角色分配</span>
              </div>

              <el-form inline align="left" :rules="rules" :model="model" ref="formRef" status-icon>
                <el-form-item label="用户角色：" prop="role_id">
                  <el-select placeholder="- 请选择 -" v-model="model.role_id" @change="row.visibleTooltip = true">
                    <el-option label="- 无角色 -" :value="0"></el-option>
                    <el-option v-for="item in roleList" :key="item.role_id" :label="item.role_name"
                      :value="item.role_id"></el-option>
                  </el-select>
                </el-form-item>

                <el-button style="vertical-align: top;" type="primary"
                  @click="divideRoleHandler({ ...model, user_name: row.user_name, user_pwd: row.user_pwd, visibleTooltip: model.visibleTooltip })">分配
                </el-button>
              </el-form>

            </template>

            <el-button plain type="primary" @click="showTooltip(row)">
              <el-icon style="margin-right: 5px;">
                <Setting />
              </el-icon>
              角色分配
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination align="left" v-model:current-page="currentPage" :page-sizes="[1, 3, 5, 7, 9]"
      v-model:page-size="search.pageSize" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
      @size-change="currentPage = 1" @current-change="(value: number) => currentPage = value">
    </el-pagination>

    <SysuserEdit ref="sysuserEditRef" @saveSysuser="saveHandler" />
  </div>
</template>

<script setup lang="ts">
import { Delete, Plus, Edit, View, Setting } from '@element-plus/icons'
// import { ElMessageBox } from 'element-plus'
// import { onMounted, ref, toRaw, Ref } from 'vue'
// import store from '@/store'
// import { storeToRefs } from 'pinia'
import { useSysuser } from '@/hooks/useSysuser'
import SysuserEdit from './SysUserEdit.vue'
import api from '@/api'

const sysuserEditRef = ref<typeof SysuserEdit | null>(null)
const { goBack, getData, search, list, total, currentPage } = useSysuser()
// @ts-ignore
const { dictionary } = storeToRefs(store.dashboard)
const roleList: Ref<Role[]> = ref([])
onMounted(async () => {
  getData();
  roleList.value = await api.role.getAll()
})
const headerTitle = ref<string>('系统用户管理')

// const detailFrom: Ref<Staff[]> = ref(DetailForm.value)

const saveHandler = async (model: Sysuser): Promise<void> => {
  if (model.role_id === 0) {
    await api.user.add(model) // 新增
  } else {
    await api.user.updatePwd(toRaw(sysuserEditRef.value?.model))
  }
  await getData() // 重新加载所有功能
  sysuserEditRef.value?.endEdit() // 结束编辑状态
}
const delHandler = async (user_name: string): Promise<void> => {
  await ElMessageBox.confirm('确定要删除该用户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  //删除

  await api.user.del(user_name)
  await getData() // 重新加载所有功能
  ElMessage.success({
    message: "删除成功...",
    type: "success",
  })
}

// 角色功能分配的数据集
const formRef = ref<any>(null) //eslint-disable-line
const model = ref<SysuserDivide>({ role_id: null, user_name: '', user_pwd: '' }) // 与表单进行双向绑定
const rules = { // 表单验证规则（运行中是不会改变的，所以不要加ref/reactive）
  role_id: [{
    //@ts-ignore
    validator: (rule: any, value: string | null, callback: (error?: Error) => void) => { //eslint-disable-line
      if (value === null) {
        callback(new Error("* 必须选择角色类型！"))
      } else {
        callback()
      }
    },
    trigger: 'input'
  }]
}

const showTooltip = (row: SysuserDivide) => {
  list.value.forEach((item: SysuserDivide) => {
    if (item.role_id === row.role_id && item.user_name === row.user_name) item.visibleTooltip = !item.visibleTooltip
    else item.visibleTooltip = false
  })
  model.value = { role_id: null, user_name: '', user_pwd: '', visibleTooltip: false }
}

// 角色分配功能
const divideRoleHandler = async (model: SysuserDivide): Promise<void> => {
  await formRef.value?.validate() // 表单验证
  formRef.value?.resetFields() // 重置表单
  await api.user.divideRole(model)
  model.visibleTooltip = false
  await getData()
}
</script>
<style lang="scss" scoped></style>