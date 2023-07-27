<script setup lang="ts">
import { Plus } from '@element-plus/icons';
import { useStaffList } from '@/hooks/useStaffList';
import api from '@/api'
// import { ref } from 'vue'
import StaffEdit from './StaffEdit.vue'

const { search, totalN, staffList, staffAllList, currentPage, dictionary } = useStaffList()
const StaffEditRef = ref<InstanceType<typeof StaffEdit> | null>(null)

const saveHandler = async (model: StaffModel) => {
  if (model.stf_id === 0) {
    await api.staff.add(model) // 新增
  }
  else {
    await api.staff.update(model)
  }
  await staffAllList()           // 重新加载所有功能
  StaffEditRef.value?.endEdit(); // 结束编辑状态
}

/*---------------------------------------------离职-start---------------------------------------------*/
const outMark = async (id: number) => {
  ElMessageBox.confirm('请确认该教师已离职...', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await api.staff.dimission(id)
    await staffAllList()
    ElMessage({
      type: 'success',
      message: '确认成功!',
    })
  })
}
/*---------------------------------------------离职-end---------------------------------------------*/

/*---------------------------------------------入职-start---------------------------------------------*/
const joinMark = async (id: number) => {
  ElMessageBox.confirm('请确认该教师已入职...', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await api.staff.reinstate(id)
    await staffAllList()
    ElMessage({
      type: 'success',
      message: '确认成功!',
    })
  })
}
/*---------------------------------------------入职-end---------------------------------------------*/
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item style="font-weight: 700;">教师管理</el-breadcrumb-item>
    <el-breadcrumb-item>教师列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-form label-width="80px" inline>
    <el-form-item label="教师姓名:" style="line-height: 40px;">
      <el-input v-model="search.stf_name" @change="currentPage = 1" placeholder="请输入教师名称.."></el-input>
    </el-form-item>
    <el-form-item label="教师类型:">
      <el-select v-model="search.stf_category" @change="currentPage = 1">
        <el-option label="- 全部 -" :value="0"></el-option>
        <el-option v-for="item in dictionary.filter(edu => edu.dic_group_key === 'staff_category')" :label="item.dic_name"
          :value="item.dic_id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button :icon="Plus" type="primary" @click="StaffEditRef?.beginAdd()">新增</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="staffList" border style="width: 90%" height="530">
    <el-table-column type="index" width="50" label="#" align="center"></el-table-column>
    <el-table-column label="姓名" width="150" align="center">
      <template #default="{ row }">
        <el-tag v-text="row.stf_name"></el-tag>
      </template>
    </el-table-column>
    <el-table-column label="教师类型" width="180" align="center">
      <template #default="{ row }">
        <span v-text="dictionary.find(item => item.dic_id === row.stf_category).dic_name"></span>
      </template>
    </el-table-column>
    <el-table-column prop="stf_remark" label="备注">
      <template #default="{ row }">
        <p v-if="row.stf_remark" v-text="row.stf_remark"></p>
        <p v-else class="not">暂无备注...</p>
      </template>
    </el-table-column>
    <el-table-column label="教师状态" width="150" align="center">
      <template #default="{ row }">
        <el-tag type="success" v-if="row.stf_invalid">在职</el-tag>
        <el-tag type="danger" v-else>离职</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200" align="center">
      <template #default="{ row }">
        <el-button type="primary" @click="StaffEditRef?.beginUpdate(row.stf_id)" plain>修改</el-button>
        <el-button v-if="row.stf_invalid" @click="outMark(row.stf_id)" type="danger" plain>离职</el-button>
        <el-button v-else @click="joinMark(row.stf_id)" type="success" plain>入职</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination :total="totalN" v-model:current-page="currentPage" v-model:page-size="search.pageSize"
    :page-sizes="[3, 5, 8, 10, 12]" layout="prev, pager, next, jumper, ->, sizes, total" background
    style="width: 90%; margin-top:20px" @size-change="currentPage = 1"
    @current-change="(value: number) => currentPage = value">
  </el-pagination>

  <StaffEdit :staff-list="staffList" :dictionary="dictionary" ref="StaffEditRef" @save="saveHandler"></StaffEdit>
</template>

<style lang="scss">
.el-breadcrumb {
  height: 50px;
  font-size: 20px;
}

.el-form-item__label {
  font-size: 16px;
  line-height: 40px;
}

.el-table__row {
  height: 55px;
  font-size: 16px;

  .el-tag.el-tag--light {
    font-size: 16px;
    padding: 15px;
    // width: 80px;
  }
}

.el-input {
  height: 40px;
}

.el-form {
  .el-button {
    padding: 18px 40px;
    font-size: 16px;
  }
}

.el-table {
  border: 1px solid #eee;
  border-radius: 15px;

  p.not {
    color: #999;
  }

  .el-button {
    padding: 18px 20px;
    font-size: 16px;
  }
}
</style>