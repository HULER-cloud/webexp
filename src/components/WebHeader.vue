<script>
  import axios from "axios";
  import router from "@/router";

  export default {
    name:"WebHeader",
    data(){
      return {

      }
    },
    methods:{
      Drop(){
        axios.get('http://127.0.0.1:12345/logout',{
          params:{
            username:this.$root.username
          }
        }).then(res=>{
          if(res){
            this.$root.state=0
            this.$message({
              type:'success',
              message:'注销成功'
            });
            router.push('/main')
          }
        }).catch(error=>{
          this.$message({
            type:'success',
            message:error.message
          });
        });
      }
    },
  }
</script>

<template>
  <el-row style="display: flex; height: 20%; width: 100%; background-color: #303133;" v-if="this.$root.state===0">
    <div style="height: 100%; width: 10%; display: flex;">
      <router-link to="/main" class="log">前往首页</router-link>
    </div>
    <div class="zhe">
      <div class="wen">股票交易系统</div>
    </div>
    <div style="height: 100%; width: 10%; display: flex;">
      <router-link to="/login" class="log">登录</router-link>
    </div>
    <div style="height: 100%; width: 5%; display: flex;">
      <router-link to="/register" class="reg">注册</router-link>
    </div>
  </el-row>
  <el-row style="display: flex; height: 20%; width: 100%; background-color: #303133;" v-else>
    <div style="height: 100%; width: 10%; display: flex;">
      <router-link to="/main" class="log">前往首页</router-link>
    </div>
    <div class="zhe">
      <div class="wen">股票交易系统</div>
    </div>
    <div style="height: 100%; width: 20%; display: flex;">
      <el-dropdown>
        <div class="uinfo">用户: {{ this.$root.username }}&nbsp;&nbsp;余额: {{this.$root.balance.toFixed(2)}}元</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <router-link to="/inventory"
                style="text-decoration: none;color: inherit;">
                持仓情况
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/trade_record"
                style="text-decoration: none;color: inherit;">
                交易记录
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item @click="Drop">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
  </el-row>
</template>

<style>
.zhe{
    height: 60px;
    width: 250px;
    display: flex;
    align-items: center;
    margin-left: 34%;
    margin-right: auto;
}
.wen{
    color: white;
    font-size: 1.5rem;
    margin-left: 20px;
}

.log{
    color: #b0b0b0;
    text-decoration: none;
    height: 20px;
    margin-left: auto;
    margin-right: 0;
    margin-top: 15px;
}
.reg{
    color: #b0b0b0;
    text-decoration: none;
    height: 20px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 15px;
}
.uinfo{
    color: #b0b0b0;
    text-decoration: none;
    height: 20px;
    margin-left: auto;
    margin-right: 50px;
    margin-top: 20px;
}

</style>