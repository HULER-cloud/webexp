<script>
import axios from "axios";
import router from "@/router";

export default {
  name: "InventoryView",
  data(){
    return{
      inventory:Array(1).fill().map(()=>({
        Code:0,
        Amount:0,
        Total_Cost:0,
        AVG_Cost:0,
      })),
    }
  },
  computed:{
    inventory_all(){
      return this.inventory.map((item)=>({
        ...item,
        Name:this.$root.code2name[`${item.Code}`],
        Total_Cost:item.Total_Cost.toFixed(2),
        AVG_Cost:item.AVG_Cost.toFixed(2)
      }))
    },
  },
  mounted() {
    if(this.$root.state===0){
      this.$message({
          type:'error',
          message:'未登录用户不能访问'
      });
      router.push('/main')
    }
    this.getInventory()
  },
  methods:{
    getInventory(){
      axios.get('http://127.0.0.1:12345/getInventory',{
        params:{
          username:this.$root.username
        }
      }).then(res=>{
          this.inventory=res.data
        }).catch(error=>{
        this.$message({
          type:'error',
          message:error.message
        });
      });
    }
  }
}
</script>

<template>
  <div class="refresh">用户 {{this.$root.username}} 持仓情况</div>
  <el-table :data="inventory_all" border stripe style="width: 80%;margin:0 auto">
    <el-table-column prop="Code" label="代码"/>
    <el-table-column prop="Name" label="名称"/>
    <el-table-column prop="Amount" label="持仓数量" />
    <el-table-column prop="Total_Cost" label="持仓总成本" />
    <el-table-column prop="AVG_Cost" label="持仓平均成本" />
  </el-table>

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