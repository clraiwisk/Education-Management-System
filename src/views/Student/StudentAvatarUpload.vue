<script setup lang="ts">
// import { reactive, ref, nextTick, toRaw } from 'vue'

interface PropsType { studentList: StudentModel[] }
const props = defineProps<PropsType>()

const uploadHeaders = { Authorization: sessionStorage.getItem('token') }
const showFileList = ref<string[]>([])

const avatarEdit = reactive<Edit<avatarModel>>({
  isEdit: false,
  formRef: null,
  model: { stu_id: 0, stu_avatar_old: "", stu_avatar_new: "" }
})


// TS版本的defineEmitsType
interface EmitsType { (name: 'save', model: avatarModel): void; }
const emit = defineEmits<EmitsType>()

const UploadHandler = async () => {
  await avatarEdit.formRef?.validate() // 表单验证
  emit("save", toRaw(avatarEdit.model))
}
interface EditRefType {
  beginAvatar: (stu_id: number, stu_avatar_old: string) => void;
  endEdit: () => void;
}

defineExpose<EditRefType>({
  beginAvatar: (stu_id: number, stu_avatar_old: string) => {
    avatarEdit.model = { stu_id, stu_avatar_old, stu_avatar_new: "" }
    nextTick(() => { avatarEdit.isEdit = true })
  },
  endEdit: () => {
    avatarEdit.isEdit = false;
  },
});
// 图片上传
const beforeUploadHandler = (file: any) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;
  // @ts-ignore
  if (!isJPG && !isPNG) { ElMessage({ type: 'error', message: '上传头像图片只能是 JPG 格式 或者 PNG格式!' }) }
  // @ts-ignore
  if (!isLt2M) { ElMessage({ type: 'error', message: '上传头像图片大小不能超过 2MB!' }) }
  return (isJPG || isPNG) && isLt2M;
}
const successHandler = (response, file, fileList) => {
  // 获取预上传到服务器后的暂时文件的名字
  console.log(file)
  avatarEdit.model.stu_avatar_new = response.data;
  if (fileList.length > 1) fileList.shift();
}
</script>

<template>
  <el-dialog :model-value="avatarEdit.isEdit" center title="照片上传" width="700px" :show-close="false"
    :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="content">
      <div class="content-left">
        <img v-if="avatarEdit.model.stu_avatar_old" :src="avatarEdit.model.stu_avatar_old" alt="">
        <span class="prompt" v-else>暂无照片，请及时上传！</span>
        <span>{{ props.studentList.find(stu => stu.stu_id === avatarEdit.model.stu_id)?.stu_name }}</span>
      </div>
      <div class="content-right">
        <el-upload :headers="uploadHeaders" name="avatar" action="/api/student/avatarupload"
          accept="image/png,image/jpeg" :before-upload="beforeUploadHandler" :on-success="successHandler"
          list-type="picture-card" :file-list="showFileList">
          上传图片
        </el-upload>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="UploadHandler">上传</el-button>
      <el-button @click="avatarEdit.isEdit = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.content {
  height: 250px;
  display: flex;

  .content-left {
    width: 200px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    padding-right: 23px;
    border-right: 2px solid #999;

    img {
      width: 100%;
    }

    span {
      font-size: 20px;
    }

    span.prompt {
      color: red;
      font-size: 16px;
    }
  }

  .content-right {
    flex-grow: 1;
    flex-shrink: 0;
    box-sizing: border-box;
    padding-left: 25px;
  }
}
</style>