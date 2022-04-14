<template>
    <div class="login-wrapper">
        <div class="modal">
            <el-form :model="user" status-icon :rules="rules" ref="userForm">
                <div class="title">DUXI后台管理系统</div>
                <el-form-item prop="userName">
                    <el-input :prefix-icon="User" type="text" v-model="user.userName"></el-input>
                </el-form-item>
                <el-form-item prop="userPwd">
                    <el-input type="password" :prefix-icon="View" v-model="user.userPwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="login" type="primary" class="btn-login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>


<script setup lang="ts">
import { User, View } from "@element-plus/icons-vue"
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";

interface _thisT {
    [key: string]: any;
}

const { proxy } = getCurrentInstance() as _thisT;
const router = useRouter();


let user = reactive({
    userName: "",
    userPwd: ""
})
//表单规则
const rules = reactive({
    userName: [
        { required: true, message: "请输入用户名", trigger: "blur" }
    ],
    userPwd: [
        { required: true, message: "请输入密码", trigger: "blur" }
    ]
})
//登录请求
const login = () => {
    (userForm.value as any).validate((valid: any) => {
        if (valid) {
            proxy.$api.login(user).then((res: any) => {
                proxy.$store.commit("saveUserInfo", res);
                router.push('/welcome')

            })


        } else {
            return false
        }
    })

}
const userForm = ref("0")

</script>


<style lang="scss">
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9fcff;
    width: 100vw;
    height: 100vh;

    .modal {
        width: 500px;
        padding: 50px;
        background-color: white;
        border-radius: 4px;
        box-shadow: 0px 0px 10px 3px #c7c9cb4d;

        .title {
            font-size: 50px;
            line-height: 1.5;
            text-align: center;
            margin-bottom: 30px;

        }

        .btn-login {
            width: 100%;
        }
    }
}
</style>