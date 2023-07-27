<script setup lang="ts">
import api from '../../api'
import store from '../../store'
import { useStudentList } from '../../hooks/useStudentList'

import StudentEdit from './StudentEdit.vue';
import StudentAvatarUpload from './StudentAvatarUpload.vue'
import { Delete, Edit, Picture, Plus, Share } from '@element-plus/icons';

const { dictionary } = storeToRefs(store.dashboard)
const { studentAllList, search, studentList, currentPage, allClass, totalN } = useStudentList()
// 新增或修改学生信息
const StudentEditRef = ref<InstanceType<typeof StudentEdit> | null>(null)
const saveHandler = async (model: StudentModel) => {
  if (model.stu_id === 0) {
    // 新增
    await api.student.addStudent(model) 
  }
  else {
    // 修改
    await api.student.updateStudent(model) 
  }
  await studentAllList()           // 重新加载所有数据
  StudentEditRef.value?.endEdit(); // 结束编辑状态
}
// 上传学生照片
const StudentAvatarUploadRef = ref<InstanceType<typeof StudentAvatarUpload> | null>(null)
const uploadHeader = async (model: avatarModel) => {
  await api.student.avatarupdate(model) // 上传
  await studentAllList()           // 重新加载所有数据
  StudentAvatarUploadRef.value?.endEdit(); // 结束编辑状态
}
// 分配班级
const edit = reactive<Edit<assignClass>>({
  isEdit: false,
  formRef: null,
  model: { stu_id: 0, stu_ids: [], stu_cls_id: 0 }
})
const selectIds = shallowRef<number[]>([])
const selectionChange = (select: StudentModel[]) => {
  selectIds.value = select.reduce((ids: number[], row: StudentModel) => { ids.push(row.stu_id); return ids; }, [])
}
const beginAssign = (stu_id: number | null) => {
  edit.formRef?.resetFields(); // 重置表单
  edit.model = { stu_id, stu_ids: selectIds.value, stu_cls_id: 0 }
  nextTick(() => { edit.isEdit = true })
}
const assignHandler = async () => {
  await api.student.assignClass(edit.model)
  await studentAllList()           // 重新加载所有数据
  nextTick(() => { edit.isEdit = false })
}

// 删除学生
const delHandler = async (stu_id: number): Promise<void> => {
  await ElMessageBox.confirm('是否要删除该学生信息？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await api.student.del(stu_id)
  await studentAllList()  
  ElMessage.success({
    message:"删除成功...",
    type:"success",
  })
}


</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item style="font-weight: 700;">学生管理</el-breadcrumb-item>
    <el-breadcrumb-item>学生管理信息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-form label-width="80px" inline>
    <el-form-item label="学生名称:" style="line-height: 40px; align-items: center;">
      <el-input v-model="search.stu_name" @change="currentPage = 1" placeholder="请输入学生名称.."></el-input>
    </el-form-item>
    <el-form-item label="所在班级:">
      <el-select v-model="search.stu_cls_id" @change="currentPage = 1">
        <el-option label="- 全部 -" :value="0"></el-option>
        <el-option v-for="item in allClass" :label="item.cls_name" :value="item.cls_id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="学生学历:">
      <el-select v-model="search.stu_qualification" @change="currentPage = 1">
        <el-option label="--全部--" :value="0"></el-option>
        <el-option v-for="item in dictionary.filter(edu => edu.dic_group_key === 'qualification')" :label="item.dic_name"
          :value="item.dic_id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button :icon="Plus" type="primary" @click="StudentEditRef?.beginAdd">新增</el-button>
      <el-button :icon="Share" type="success" @click="beginAssign(null)"
        :disabled="selectIds.length === 0">批量分班</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="studentList" border style="width: 100%" height="530" @selection-change="selectionChange">
    <el-table-column type="index" fixed width="50" label="#" align="center"></el-table-column>
    <el-table-column type="selection" fixed width="55"></el-table-column>
    <el-table-column label="学生姓名" fixed width="150" align="center">
      <template #default="{ row }">
        <el-tag v-text="row.stu_name"></el-tag>
      </template>
    </el-table-column>
    <el-table-column label="班级" width="150" align="center">
      <template #default="{ row }">
        <span v-if="row.stu_cls_id === null" style="color: #999;">暂未分班级</span>
        <el-tag type="success" v-else>{{ allClass.find(cls => cls.cls_id === row.stu_cls_id)?.cls_name }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="存档照片" width="100" align="center">
      <template #default="{ row }">
        <el-popover placement="right" :width="245" trigger="click">
          <template #reference>
            <el-button>预览</el-button>
          </template>
          <div class="avatar-content" v-if="row.stu_avatar">
            <img class="stu_avatar" :src="row.stu_avatar" alt="">
            <span>{{ row.stu_name }}</span>
          </div>
          <span v-else>暂无照片，请及时上传！</span>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="性别" width="80" align="center">
      <template #default="{ row }">
        <el-tag v-if="row.stu_sex">男</el-tag>
        <el-tag type="danger" v-else>女</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="stu_phone" label="联系电话" width="150" align="center"></el-table-column>
    <el-table-column prop="stu_phone2" label="联系电话2" width="150" align="center"></el-table-column>
    <el-table-column prop="stu_born" label="出生日期" width="150" align="center"></el-table-column>
    <el-table-column label="学历" width="150" align="center">
      <template #default="{ row }">
        <el-tag>{{ dictionary.find(dic => dic.dic_id === row.stu_qualification).dic_name }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="stu_school" label="毕业院校" width="150" align="center"></el-table-column>
    <el-table-column prop="stu_major" label="学院专业" width="150" align="center"></el-table-column>
    <el-table-column prop="stu_address" label="家庭住址" width="250" align="center"></el-table-column>
    <el-table-column prop="stu_remark" label="备注" width="250" align="center"></el-table-column>
    <el-table-column label="操作" fixed="right" width="410" align="center">
      <template #default="{ row }">
        <el-button :icon="Share" type="success" plain @click="beginAssign(row.stu_id)">分班</el-button>
        <el-button :icon="Picture" type="warning" plain
          @click="StudentAvatarUploadRef?.beginAvatar(row.stu_id, row.stu_avatar)">照片存档</el-button>
        <el-button :icon="Edit" type="primary" plain @click="StudentEditRef?.beginUpdate(row.stu_id)">编辑</el-button>
        <el-button :icon="Delete" type="danger" plain @click="delHandler(row.stu_id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination :total="totalN" v-model:current-page="currentPage" v-model:page-size="search.pageSize"
    :page-sizes="[3, 5, 8, 10, 12]" layout="prev, pager, next, jumper, ->, sizes, total" background
    style="width: 100%; margin-top:20px" @size-change="currentPage = 1"
    @current-change="(value: number) => currentPage = value">
  </el-pagination>
  <!-- 分配班级 -->
  <el-dialog center width="400" title="分配班级" :show-close="false" :close-on-click-modal="false"
    :close-on-press-escape="false" :model-value="edit.isEdit">
    <el-form label-width="80px" :model="edit.model" :ref="el => edit.formRef = el">
      <el-form-item label="班级名:">
        <el-select v-model="edit.model.stu_cls_id">
          <el-option label="--请选择--" :value="0"></el-option>
          <el-option v-for="item in allClass.filter(cls => cls.cls_end === null)" :label="item.cls_name"
            :value="item.cls_id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="assignHandler">分配</el-button>
      <el-button @click="edit.isEdit = false">取消</el-button>
    </template>
  </el-dialog>
  <!-- 上传照片 -->
  <StudentAvatarUpload :student-list="studentList" ref="StudentAvatarUploadRef" @save="uploadHeader">
  </StudentAvatarUpload>
  <!-- 编辑学生信息 -->
  <StudentEdit :student-list="studentList" :dictionary="dictionary" ref="StudentEditRef" @save="saveHandler">
  </StudentEdit>
</template>

<style lang="scss" scoped>
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

.avatar-content {
  width: 200px;
  height: 250px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  .stu_avatar {
    width: 100%;
  }

  span {
    font-size: 20px;
    color: #999;
  }
}
</style>
