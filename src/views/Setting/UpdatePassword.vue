<!--
 * @Author: your name
 * @Date: 2021-09-22 20:53:20
 * @LastEditTime: 2021-10-01 00:45:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Setting\UpdatePassword.vue
-->
<template>
    <div class="updatePwd">
        <el-form
            class="updatePwd__pwdForm"
            :model="userPwd"
            ref="pwdForm"
            :rules="rules"
            label-width="90px">
            <el-form-item label="旧密码:" prop="oldPwd" class="updatePwd__pwdForm__oldPwd">
                <el-input v-model="userPwd.oldPwd" show-password>
                    <template #append>
                        <span>忘记密码</span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="新密码:" prop="newPwd">
                <el-input v-model="userPwd.newPwd" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="confirmPwd">
                <el-input v-model="userPwd.confirmPwd" show-password></el-input>
            </el-form-item>
            <div>
                <el-form-item label-width="0px" class="updatePwd__pwdForm__submit">
                    <el-button plain>取消</el-button>
                    <el-button type="primary">确定</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import request from '../../api/index'
import debounce from '../../utils/debounce'

// 路由
const router = useRouter()

// 用户密码数据
const userPwd = reactive({})

// 密码表单对象
const pwdForm = ref(null)
</script>

<style lang="scss">
.updatePwd {
    margin-top: .3rem;
    padding-right: .2rem;  /* 视觉居中 */

    &__pwdForm {
        &__oldPwd{
            position: relative;
        }

        &__submit {
            margin: .3rem 0 0 .2rem;
        }
    }

    /* element-plus 样式修改  */
    .el-form-item {
        justify-content: center;
    }

    .el-form-item__content {
        flex: 0 1 auto;
    }

    .el-input {
        width: 2rem;
    }

    .el-input-group__append {
        cursor: pointer;
        padding: 0 .05rem;
        font-size: .11rem;
    }
}
</style>