<template>
  <div class="app-container">
    <el-button type="danger" @click="DeleteBatch">批量删除</el-button>
    <el-tree
      ref="tree"
      :data="tree"
      draggable
      :allow-drag="allowDrag"
      :allow-drop="allowDrop"
      :default-expanded-keys="expanded"
      :props="defaultProps"
      node-key="catId"
      show-checkbox
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >

      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level <= 2"
            type="text"
            size="mini"
            @click="() => addDialog(data)"
          >
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => updateDialog(data)"
          >
            编辑
          </el-button>
          <el-button
            v-if="node.childNodes.length === 0"
            type="text"
            size="mini"
            @click="() => deleteNode(node, data)"
          >
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="category">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="category.name" maxlength="50" show-word-limit autocomplete="off" />
        </el-form-item>
        <el-form-item label="层级" :label-width="formLabelWidth">
          <el-select v-model="category.catLevel" disabled placeholder="请选择活动区域">
            <el-option label="一级" value="1" />
            <el-option label="二级" value="2" />
            <el-option label="三级" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="category.sort" type="number" min="0" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品数量" :label-width="formLabelWidth">
          <el-input v-model="category.productCount" type="number" min="0" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateNode">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTree, getNode, DeleteBatchNodes, appendNode, updateNode } from '@/api/product/classify'

export default {
  data() {
    return {
      dialogType: true,
      title: '',
      category: { catId: '', name: '', parentCid: '', catLevel: 0, showStatus: 1, sort: 0, icon: '', productCount: 0 },
      dialogFormVisible: false,
      tree: [],
      expanded: [],
      formLabelWidth: '120px',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  created() {
    this.getTree()
  },
  methods: {
    DeleteBatch() {
      const isCheckedNodes = this.$refs.tree.getCheckedNodes()
      const checkedIds = []
      console.log(isCheckedNodes)
      for (let i = 0; i < isCheckedNodes.length; i++) {
        checkedIds.push(isCheckedNodes[i].catId)
      }
      this.$confirm(`确定批量删除选中菜单, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteBatchNodes(checkedIds).then(response => {
          this.$message({
            type: 'success',
            message: '批量删除成功!'
          })
          this.getTree()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 判断节点是否能被拖拽
    allowDrag(draggingNode) {
      // 非一级分类才可以拖拽
      console.log(draggingNode)
      return draggingNode.data.catLevel !== 1
    },
    // 拖拽时判定目标节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    addDialog(data) {
      this.dialogType = true
      this.title = '添加分类'
      this.dialogFormVisible = true
      this.category.name = ''
      this.category.productCount = 0
      this.category.icon = ''
      this.category.parentCid = data.catId
      this.category.catLevel = data.catLevel + 1
    },
    addOrUpdateNode() {
      if (this.dialogType) {
      //  新增
        appendNode(this.category).then(response => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          }
        }).catch(error => {
          console.log(error)
        }).then(response => {
          this.dialogFormVisible = false
          this.getTree()
          this.expanded.push(this.category.parentCid)
        })
      } else {
      //  编辑
        const { catId, name, productCount } = this.category
        updateNode({ catId, name, productCount }).then(response => {
          this.getTree()
          this.expanded.push(this.category.parentCid)
          this.dialogFormVisible = false
        })
      }
    },
    updateDialog(data) {
      this.dialogType = false
      this.title = '编辑分类'
      this.dialogFormVisible = true
      getNode(data.catId).then(({ data }) => {
        this.category = data
      })
    },
    getTree() {
      getTree().then(({ list }) => {
        this.tree = list
      })
    },
    deleteNode(node, data) {
      this.$confirm(`确定删除${data.name}菜单, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const array = [data.catId]
        DeleteBatchNodes(array).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTree()
            this.expanded = [data.parentCid]
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleNodeClick(data) {
      // console.log(data)
    }
  }
}
</script>

