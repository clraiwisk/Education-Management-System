<script setup lang="ts">
import { DataLine, Edit, Delete } from '@element-plus/icons'
import api from '@/api';
// import { reactive, markRaw, nextTick } from 'vue';
import { useClassList } from '@/hooks/useClassList';

const { allRoom, getAllRoom } = useClassList()
const edit = reactive<Edit<roomModel>>({
  isEdit: false,
  formRef: null,
  model: { clsr_id: 0, clsr_name: "", clsr_occupy: 0 },
  rules: markRaw({
    clsr_name: [
      {
        //@ts-ignore
        validator: (rule: any, value: string, callback: any) => {
          if (value.length === 0) callback(new Error('* 教室名不能为空'))
          else if (value.length > 10 || value.length < 3) callback(new Error('* 教室名长度为3 — 10'))
          else if (allRoom.value.some((item: roomModel) => item.clsr_name === value && edit.model.clsr_id !== item.clsr_id))
            callback(new Error('*教室名已存在'))
          else
            callback()
        }
      }
    ]
  })
})

const remove = (id: number) => {
  // @ts-ignore
  ElMessageBox.confirm('确定删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(
    async () => {
      await api.clsr.removeClassroom(id)
      await getAllRoom()
      // @ts-ignore
      ElMessage({
        type: 'success',
        message: '删除成功!',
      })
    })
}

const beginAdd = () => {
  edit.formRef?.resetFields()
  edit.model = { clsr_id: 0, clsr_name: "", clsr_occupy: 0 }
  nextTick(() => { edit.isEdit = true; })
};
const beginUpdate = (role: roomModel) => {
  edit.formRef?.resetFields()
  edit.model = { ...role }
  nextTick(() => { edit.isEdit = true; })
}
const saveHandler = async () => {
  if (edit.model.clsr_id === 0)
    await api.clsr.addClassroom(edit.model)
  else
    await api.clsr.updateClassroom(edit.model)
  await getAllRoom()
  nextTick(() => { edit.isEdit = false; })
}
</script>

<template>
  <div class="status-prompt">
    <div class="box">
      <div class="radius" style="background-color: rgb(21,60,101);"></div><span class="state">空闲</span>
    </div>
    <div class="box">
      <div class="radius" style="background-color: rgb(123, 0, 0);"></div><span class="state">使用中</span>
    </div>
  </div>
  <div class="container">
    <el-row :gutter="16">
      <el-col v-for="item in allRoom " :key="item.clsr_id" :span="4" style="margin-bottom: 25px;">
        <el-card shadow="hover" :class="item.clsr_occupy ? 'use' : 'idle'">
          <div class="el-card__body">
            <el-icon style="margin-right: 5px; font-size: 30px; color: #fff;">
              <DataLine />
            </el-icon>
            <span>{{ item.clsr_name }}</span>
          </div>
          <div class="float-main">
            <el-icon style="margin-right: 40px;" @click="beginUpdate(item)">
              <Edit />
            </el-icon>
            <el-icon v-if="!item.clsr_occupy" style="margin-right: 5px;" @click="remove(item.clsr_id)">
              <Delete />
            </el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" @click="beginAdd">
          <span class="found">+</span>
        </el-card>
      </el-col>
    </el-row>
    <!----------------------------------------------新增教室-start---------------------------------------------->
    <el-dialog center width="400" title="新增教室" :show-close="false" :close-on-click-modal="false"
      :close-on-press-escape="false" :model-value="edit.isEdit">

      <el-form :model="edit.model" :rules="edit.rules" :ref="el => edit.formRef = el">
        <el-form-item prop="clsr_name" label="教室名:">
          <el-input v-model.trim="edit.model.clsr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="saveHandler">确定</el-button>
        <el-button @click="edit.isEdit = false">取消</el-button>
      </template>
    </el-dialog>
    <!----------------------------------------------新增教室-end---------------------------------------------->
  </div>
</template>

<style lang="scss" scoped>
.status-prompt {
  display: flex;
  padding-left: 40px;

  .box {
    display: flex;
    margin-right: 20px;
  }
}

.radius {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
}

.container {
  padding: 20px;

  .el-card {
    height: 120px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .float-main {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.9);
      display: none;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      color: #fff;
    }

    span {
      font-size: 23px;
      color: #fff;
    }

    span.found {
      font-size: 50px;
      font-weight: 100;
      color: #153C65;
    }
  }

  .el-card__body {
    display: flex;
    padding: 0;
  }

  .el-card:hover .float-main {
    display: flex;
  }

  .el-card.idle {
    background-color: rgb(21, 60, 101);
  }

  .el-card.use {
    background-color: rgb(149, 3, 3);
  }
}
</style>