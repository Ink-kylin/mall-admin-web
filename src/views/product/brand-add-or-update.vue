<template>
  <el-dialog
    :title="!dataForm.brandId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="品牌名" prop="name">
        <el-input v-model="dataForm.name" placeholder="品牌名" />
      </el-form-item>
      <el-form-item label="品牌logo地址" prop="logo">
        <SingleUpload v-model="dataForm.logo" />
      </el-form-item>
      <el-form-item label="介绍" prop="descript">
        <el-input v-model="dataForm.descript" placeholder="介绍" />
      </el-form-item>
      <el-form-item label="显示状态" prop="showStatus">
        <el-switch
          v-model="dataForm.showStatus"
          active-text="显示"
          :active-value="1"
          :inactive-value="0"
          inactive-text="隐藏"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label="检索首字母" prop="firstLetter">
        <el-input v-model="dataForm.firstLetter" placeholder="检索首字母" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="排序" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SingleUpload from '@/components/Upload/singleUpload'
import { getSingle, createHandle, updateHandle } from '@/api/product/brand'
export default {
  components: { SingleUpload },
  data() {
    return {
      visible: false,
      dataForm: {
        brandId: 0,
        name: '',
        logo: '',
        descript: '',
        showStatus: '',
        firstLetter: '',
        sort: ''
      },
      dataRule: {
        name: [
          { required: true, message: '品牌名不能为空', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '品牌logo地址不能为空', trigger: 'blur' }
        ],
        descript: [
          { required: true, message: '介绍不能为空', trigger: 'blur' }
        ],
        showStatus: [
          { required: true, message: '显示状态不能为空', trigger: 'blur' }
        ],
        firstLetter: [
          { required: true, message: '检索首字母不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.brandId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.brandId) {
          getSingle(this.dataForm.brandId).then(response => {
            if (response.code === 0) {
              this.dataForm.name = response.data.name
              this.dataForm.logo = response.data.logo
              this.dataForm.descript = response.data.descript
              this.dataForm.showStatus = response.data.showStatus
              this.dataForm.firstLetter = response.data.firstLetter
              this.dataForm.sort = response.data.sort
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const brand = {
            'brandId': this.dataForm.brandId || undefined,
            'name': this.dataForm.name,
            'logo': this.dataForm.logo,
            'descript': this.dataForm.descript,
            'showStatus': this.dataForm.showStatus,
            'firstLetter': this.dataForm.firstLetter,
            'sort': this.dataForm.sort
          }
          if (this.dataForm.brandId) {
            // 修改
            updateHandle(brand).then(response => {
              if (response.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(response.msg)
              }
            })
          } else {
            createHandle(brand).then(response => {
              if (response.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(response.msg)
              }
            })
          }
        }
      })
    }
  }
}
</script>
