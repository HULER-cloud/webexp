<template>
    <div class="RegView">
        <div class="RegBox">
            <div class="RegTitle">注册</div>
            <div class="unameBox">
                <el-input class="unameInput" v-model="username" placeholder="请输入用户名"></el-input>
            </div>
            <div class="passBox">
                <el-input class="passInput" v-model="password" placeholder="请输入密码" show-password></el-input>
            </div>
            <div class="passAgaBox">
                <el-input class="passAgaInput" v-model="passwordAgain" placeholder="请确认密码" show-password></el-input>
            </div>
            <div class="RegBoxOne">
                <el-button class="RegBut" type="primary" @click="Reg">注册</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import router from "@/router"; // 引入axios库
export default {
    name: 'RegisterView',
    data() {
        return {
            username: '',
            password: '',
            passwordAgain: '',
        }
    },
    methods:{
        Reg(){
            // 发送请求
            if (this.password !== this.passwordAgain) {
              this.$message({
                type:'error',
                message:'两次输入的密码不一致'
              });
              return;
            }
            // 发送注册请求
            axios.get('http://127.0.0.1:12345/regist', {
              params:{
                username:this.username,
                pwd:this.password
              }
            }).then(res => {
                if (res) {
                  this.$message({
                    type:'success',
                    message:'注册成功'
                  });
                    router.push({ path: '/login' }); // 返回登录界面
                } else {
                  this.$message({
                    type:'success',
                    message:'注册失败'
                  });
                }
            }).catch(error => {
              this.$message({
                type:'error',
                message:error.message
              });
            });
        }

    }
}
</script>

<style scoped>
.RegView{
    width: 100%;
    height: 100vh;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
}

.RegBox{
    width: 848px;
    height: 548px;
    background-color: #fff;
}

.RegTitle{
    font-size: 30px;
    font-weight: 500;
    color: #333333;
    text-align: center;
    margin-top: 60px;
}

.unameBox{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.unameInput{
    width: 350px;
}

.passBox{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 25px;
}

.passInput{
    width: 350px;
}

.passAgaBox{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 25px;
}

.passAgaInput{
    width: 350px;
}

.RegBoxOne{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.RegBut{
    width: 350px;
}

.RegLink{
    margin-top: 15px;
    margin-left: 469px;
}

.checkBox{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 25px;
}

.checkInput{
    width: 235px;
}

.CheckBut{
    width: 110px;
    margin-left: 5px;
}
</style>