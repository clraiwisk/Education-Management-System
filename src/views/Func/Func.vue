<script setup lang="ts">
import FuncEdit from "./FuncEdit.vue"
import { useFuncList } from '@/hooks/useFuncList'
import api from '@/api';
// import { ref } from 'vue'
import { Plus, Delete, Edit } from '@element-plus/icons'
// 准备数据
const { allFunc, allFuncTree, loadAllFunc } = useFuncList();
const funcEditRef = ref<InstanceType<typeof FuncEdit> | null>(null)
const deleFunc = async (id: number) => {
  if (!confirm('你确定要删除吗？')) return
  await api.func.delFunc(id)
  await loadAllFunc()
}
const saveHandler = async (func: Func) => {
  if (func.func_id === 0) {
    await api.func.addFunc(func) // 新增
  }
  else {
    await api.func.updateFunc(func)
  }
  await loadAllFunc()           // 重新加载所有功能
  funcEditRef.value?.endEdit(); // 结束编辑状态
}

</script>

<template>
  <div class="header">功能管理</div>
  <el-tree class="custom-tree" default-expand-all :expand-on-click-node="false" :data="allFuncTree">
    <template #default="{ data }"> <!-- 作用域插槽 -->
      <div class="custom-tree-node">
        <span v-text="data.func_name" class="title"></span>
        <div>
          <el-button v-if="data.func_key === ''" :icon="Plus"
            @click="funcEditRef?.beginAdd(data.func_id)">添加功能</el-button>
          <el-button v-if="[0, 1, 2].indexOf(data.func_id) === -1" :icon="Edit" type="primary" plain
            @click="funcEditRef?.beginUpdate(data.func_id)"><span>编辑</span></el-button>
          <el-button v-if="[0, 1, 2].indexOf(data.func_id) === -1" :icon="Delete" type="danger" plain
            @click="deleFunc(data.func_id)"><span>删除</span></el-button>
        </div>
      </div>
    </template>
  </el-tree>
  <FuncEdit :all-func="allFunc" ref="funcEditRef" @save="saveHandler" />
</template>

<style lang="scss" scoped>
.header {
  margin-bottom: 40px;
  font-size: 26px;
  font-weight: 600;
  color: #303133;
}

.el-tree {
  width: 500px
}

.custom-tree-node {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    color: #303133;
    font-size: 18px;
  }

}
</style>
