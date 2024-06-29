<script>
import axios from "axios";
import router from "@/router";

export default {
  name: "TradeRecordView",
  data(){
    return{
      currentPage:1, // 当前页
      pageSize:10, // 一页有多少条数据
      trade_record:Array(1).fill().map(()=>({
        Code:0,
        Amount:0,
        Direction:0,
        KnockPrice:0,
        No:"",
        Price:0,
        State:0,
        TradeTime:"",
      })),
      state_arr:["交易错误","委托成功","交易成功","交易作废","账户余额不足","持仓余额不足"],
    }
  },
  computed:{
    currentPageData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = this.currentPage * this.pageSize;
            return this.trade_record_all.slice().reverse().slice(start, end);
          },
    trade_record_all(){
      return this.trade_record.map((item)=>({
        ...item,
        Name:this.$root.code2name[`${item.Code}`],
        KnockPrice:item.KnockPrice.toFixed(2),
        Direction:item.Direction===0?"买入":"卖出",
        State:this.state_arr[item.State]
      }))
    }
  },
  mounted() {
    if(this.$root.state===0){
      this.$message({
          type:'error',
          message:'未登录用户不能访问'
      });
      router.push('/main')
    }
    this.getTradeRecord()
  },
  methods:{
    getTradeRecord(){
      axios.get('http://127.0.0.1:12345/getTradeRecord',{
        params:{
          username:this.$root.username
        }
      }).then(res=>{
          this.trade_record=res.data
        }).catch(error=>{
        this.$message({
          type:'error',
          message:error.message
        });
      });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    }
  }
}
</script>

<template>
  <div class="refresh">用户 {{this.$root.username}} 交易记录</div>
  <el-table :data="currentPageData" border stripe style="width: 80%;margin:0 auto">
    <el-table-column prop="Code" label="代码"/>
    <el-table-column prop="Name" label="名称"/>
    <el-table-column prop="Amount" label="交易数量" />
    <el-table-column prop="Direction" label="交易方向" />
    <el-table-column prop="Price" label="挂单价格" />
    <el-table-column prop="KnockPrice" label="成交价格" />
    <el-table-column prop="State" label="交易状态" />
    <el-table-column prop="No" label="交易单号" />
    <el-table-column prop="TradeTime" label="交易时间" />
  </el-table>
  <br>
  <el-pagination
    style="display: flex;justify-content: center;"
    v-model:current-page="currentPage"
    :page-size="pageSize"
    :total="trade_record_all.length"
    layout="prev, pager, next"
    @current-change="handleCurrentChange"
  />
</template>

<style>
.refresh{
  margin-top:20px;
  margin-bottom: 20px;
  text-align: center;
  color: red;
  font-size: 30px;
}
</style>