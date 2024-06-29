<template>
    <div class="LogView">
        <div class="LogBox">
            <div class="LogTitle">登录</div>
            <div class="unameBox">
                <el-input class="unameInput" v-model="username" placeholder="请输入用户名"></el-input>
            </div>
            <div class="passBox">
                <el-input class="passInput" v-model="password" placeholder="请输入密码" show-password></el-input>
            </div>
            <div class="LogBoxOne">
                <el-button class="LogBut" type="primary" @click="Log">登录</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import router from "@/router"; // 引入axios库
export default {
    name: 'LoginView',
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        Log(){
            // 发送登录请求
            axios.get('http://127.0.0.1:12345/login', {
              params:{
                username: this.username,
                pwd: this.password
              }

            }).then(res => {
                // console.log(res.data.code); // 打印 res.data.code
                if (res.data) {
                    // 登录成功，设置全局变量
                    this.$message({
                      type:'success',
                      message:'登录成功'
                    });
                    this.$root.state=1
                    this.$root.username=this.username
                    this.$root.getBalance()
                    router.push("/main")
                } else {
                  this.$message({
                    type:'error',
                    message:'登录失败'
                  });
                }
            }).catch(error => {
              this.$message({
                type:'error',
                message:error.message
              });
            });
        },
    }
}
</script>

<style scoped>
.LogView{
    width: 100%;
    height: 100vh;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
}

.LogBox{
    width: 848px;
    height: 648px;
    background-color: #fff;
}

.LogTitle{
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

.LogBoxOne{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.LogBut{
    width: 350px;
}

</style>