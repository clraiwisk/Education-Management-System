<script setup lang="ts">
import { Edit, Plus, DataLine, Calendar, SuccessFilled, Failed } from '@element-plus/icons';
import { useClassList } from '@/hooks/useClassList';
import ClassEdit from '@/views/Class/ClassEdit.vue'
// import { reactive, ref, nextTick } from 'vue';
import api from '@/api';
// import store from '@/store'
// import { storeToRefs } from 'pinia'

const { dictionary } = storeToRefs(store.dashboard)
const { search, totalN, classList, currentPage, classAllList, staffList, allRoom, getAllRoom } = useClassList()
const ClassEditRef = ref<InstanceType<typeof ClassEdit> | null>(null)

const saveHandler = async (model: ClassModel) => {
  //cls_id是否为0来判断是新增还是更新
  if (model.cls_id === 0) {
    await api.cls.classAdd(model) // 新增
  }
  else {
    await api.cls.classUpdate(model)
  }
  await classAllList()           // 重新加载所有功能
  ClassEditRef.value?.endEdit(); // 结束编辑状态
}

// 开课结课
const classEdit = reactive({
  isEdit: false,
  forRef: null,
  model: { cls_id: 0, cls_clsr_id: 0 },
  rules: {}
})

const beginClass = async (cls_id: number) => {
  if (classEdit.isEdit) {
    await api.cls.classBegin(classEdit.model)
    await classAllList()           // 重新加载所有功能
    nextTick(() => { classEdit.isEdit = false })
  } else {
    // 重置表单
    classEdit.model = { cls_id, cls_clsr_id: 0 }
    // 打开对话框
    nextTick(() => { classEdit.isEdit = true })
  }
  await getAllRoom()
}

const classEnd = async (cls_id: number) => {
  // 提示用户是否确认结课
  classEdit.model = { cls_id, cls_clsr_id: 0 }
  await api.cls.classEnd(classEdit.model)
  await classAllList()           // 重新加载所有功能
}
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item style="font-weight: 700;">班级管理</el-breadcrumb-item>
    <el-breadcrumb-item>班级管理信息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-form label-width="80px" inline>
    <el-form-item label="班级名称:" style="line-height: 40px;">
      <el-input v-model="search.cls_name" @change="currentPage = 1" placeholder="请输入班级名称.."></el-input>
    </el-form-item>
    <el-form-item label="班级专业:">
      <el-select v-model="search.cls_dic_id_major" @change="currentPage = 1">
        <el-option label="- 全部 -" :value="0"></el-option>
        <el-option v-for="item in dictionary.filter(edu => edu.dic_group_key === 'class_major')" :label="item.dic_name"
          :value="item.dic_id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="班级状态:">
      <el-select v-model="search.cls_status" @change="currentPage = 1">
        <el-option label="- 全部 -" :value="0"></el-option>
        <el-option label="开课" :value="1"></el-option>
        <el-option label="未开课" :value="2"></el-option>
        <el-option label="结束" :value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button :icon="Plus" type="primary" @click="ClassEditRef?.beginAdd">新增</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="classList" border style="width: 100%" height="530">
    <el-table-column type="index" width="50" label="#" align="center"></el-table-column>
    <el-table-column label="班级名称" width="150" align="center">
      <template #default="{ row }">
        <el-tag v-text="row.cls_name"></el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="cls_dic_id_major" label="班级专业" width="100" align="center">
      <template #default="{ row }">
        <span>{{ dictionary.find(dic => dic.dic_id === row.cls_dic_id_major).dic_name }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="cls_stf_id_teacher_name" label="教学老师" width="100" align="center"></el-table-column>
    <el-table-column prop="cls_stf_id_admin_name" label="教务老师" width="100" align="center"></el-table-column>
    <el-table-column prop="cls_stf_id_job_name" label="就业老师" width="100" align="center"></el-table-column>
    <el-table-column label="教室" width="100" align="center">
      <template #default="{ row }">
        <div v-if="row.cls_clsr_id">
          <el-icon style="margin-right: 5px; color: #67C23A;">
            <DataLine />
          </el-icon>
          <span>{{ allRoom.find(clsr => clsr.clsr_id === row.cls_clsr_id)?.clsr_name }}</span>
        </div>
        <span style="color: #999" v-else>待分配</span>
      </template>
    </el-table-column>
    <el-table-column prop="cls_begin" label="开课时间" width="140" align="center">
      <template #default="{ row }">
        <span v-if="row.cls_begin" style="color: #67C23A;">
          <el-icon>
            <Calendar />
          </el-icon>
          {{ row.cls_begin }}
        </span>
        <span style="color: #999" v-else>待开课</span>
      </template>
    </el-table-column>
    <el-table-column prop="cls_end" label="结课时间" width="140" align="center">
      <template #default="{ row }">
        <span v-if="row.cls_end" style="color: #FF3D03;">
          <el-icon>
            <Calendar />
          </el-icon>
          {{ row.cls_end }}
        </span>
        <span style="color: #999" v-else-if="row.cls_begin">待结课</span>
        <span style="color: #999" v-else>未开课</span>
      </template>
    </el-table-column>
    <el-table-column label="班级状态" width="100" align="center">
      <template #default="{ row }">
        <el-tag type="danger" v-if="row.cls_begin && row.cls_end">结课</el-tag>
        <el-tag type="success" v-else-if="row.cls_begin">开课中</el-tag>
        <el-tag type="warning" v-else>未开课</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="备注">
      <template #default="{ row }">
        <p v-if="row.cls_remark" v-text="row.cls_remark"></p>
        <p v-else class="not">暂无备注信息...</p>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="210" align="center">
      <template #default="{ row }">
        <el-button :icon="Edit" type="warning" size="small" plain
          @click="ClassEditRef?.beginUpdate(row.cls_id)">修改</el-button>
        <el-button :icon="SuccessFilled" type="success" size="small" @click="beginClass(row.cls_id)" plain
          v-if="row.cls_begin === null">开课</el-button>
        <el-button :icon="Failed" type="danger" size="small" plain @click="classEnd(row.cls_id)"
          v-if="row.cls_begin && row.cls_end === null">结课</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination :total="totalN" v-model:current-page="currentPage" v-model:page-size="search.pageSize"
    :page-sizes="[3, 5, 8, 10, 12]" layout="prev, pager, next, jumper, ->, sizes, total" background
    style="width: 100%; margin-top:20px" @size-change="currentPage = 1"
    @current-change="(value: number) => currentPage = value">
  </el-pagination>
  <el-dialog :model-value="classEdit.isEdit" center title="班级分配" width="400px" :show-close="false"
    :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form label-width="80px" :model="classEdit.model" :rules="classEdit.rules" :ref="el => ClassEdit.forRef = el">
      <el-form-item label="教室名称:" prop="">
        <el-select v-model="classEdit.model.cls_clsr_id">
          <el-option label="- 请选择 -" :value="0"></el-option>
          <el-option v-for="item in allRoom.filter(clsr => clsr.clsr_occupy === 0)" :label="item.clsr_name"
            :value="item.clsr_id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="beginClass(0)">分配</el-button>
      <el-button @click="classEdit.isEdit = false">取消</el-button>
    </template>
  </el-dialog>
  <ClassEdit :class-list="classList" :staff-list="staffList" :dictionary="dictionary" ref="ClassEditRef"
    @save="saveHandler"></ClassEdit>
</template>

<style lang="scss" scoped>
.el-breadcrumb {
  height: 50px;
  font-size: 22px;
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
    padding: 15px 20px;
  }
}
</style>