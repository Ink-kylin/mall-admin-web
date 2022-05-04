<template>
  <div>
    <!-- action必选参数，上传地址，bucket的外网访问域名 -->
    <el-upload
      action="https://kylin01.oss-cn-shanghai.aliyuncs.com"
      :data="dataObj"
      list-type="picture"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { policy } from './policy'
import { getUUID } from '@/utils'

export default {
  name: 'SingleUpload',
  props: {
    value: String
  },
  data() {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: ''
        // callback:'',
      },
      dialogVisible: false
    }
  },
  computed: {
    imageUrl() {
      return this.value
    },
    imageName() {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf('/') + 1)
      } else {
        return null
      }
    },
    fileList() {
      return [{
        name: this.imageName,
        url: this.imageUrl
      }]
    },
    showFileList: {
      get: function() {
        return this.value !== null && this.value !== '' && this.value !== undefined
      },
      set: function(newValue) {
      }
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      this.emitInput('')
    },
    handlePreview(file) {
      this.dialogVisible = true
    },
    beforeUpload(file) {
      const _self = this
      return new Promise((resolve, reject) => {
        policy().then(response => {
          _self.dataObj.policy = response.policy
          _self.dataObj.signature = response.signature
          _self.dataObj.ossaccessKeyId = response.accessid
          _self.dataObj.key = response.dir + '_${filename}'
          _self.dataObj.dir = response.dir
          _self.dataObj.host = response.host
          console.log('上传前请求服务端签名，得到结果：', _self.dataObj)
          resolve(true)
          // eslint-disable-next-line handle-callback-err
        }).catch(error => {
          reject(false)
        })
      })
    },
    handleUploadSuccess(res, file) {
      console.log('上传成功...')
      this.showFileList = true
      this.fileList.pop()
      this.fileList.push({ name: file.name, url: this.dataObj.host + '/' + this.dataObj.key.replace('${filename}', file.name) })
      console.log(this.fileList[0])
      this.emitInput(this.fileList[0].url)
    }
  }
}
</script>
<style>

</style>

