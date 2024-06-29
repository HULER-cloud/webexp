<script>
import axios from "axios";
import {reactive,ref} from 'vue';
import SingleStock from "@/components/SingleStock.vue";

export default {
  name: 'MainPage',
  components: {SingleStock},
  data() {
    const chart_visible = ref(false)
    const form_visible = ref(false)
    const tradeForm = reactive({
      name: '',
      region: '',
      date1: '',
      date2: '',
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    })
    return {
      chart_visible,
      form_visible,
      tradeForm,
      activeName:"first",
      stocks:Array(30).fill().map(()=>({
        Code:0,
        Name:"temp",
        Price:0,
      })),
      stocks_old:Array(30).fill().map(()=>({
        Code:0,
        Name:"temp",
        Price:0,
      })),
      timer_stocks:null,
      countdown:5,
      timer_countdown:null,
      stock_code:"",
      stock_name:"",
    };
  },
  computed:{
    amount(){
      // 30支股票的当日涨跌价
      return this.stocks.map((item,index)=>(item['Price']-this.stocks_old[index]['Price']))
    },
    ratio(){
      // 30支股票的当日涨跌幅
      return this.stocks.map((item,index)=>((item['Price']-this.stocks_old[index]['Price'])/(this.stocks_old[index]['Price']===0?Infinity:this.stocks_old[index]['Price'])));
    },
    stocks_all(){
      // 将涨跌价和涨跌幅合并到对象数组里面
      return this.stocks.map((item,index)=>({...item,Amount:this.amount[index].toFixed(2),Ratio:(this.ratio[index]*100).toFixed(2)+"%"}))
    },

  },
  mounted() {
    this.getMarketPrice()
    // this.timer_stocks=setInterval( ()=>{
    //   this.getMarketPrice()
    // },5000)
    this.timer_countdown=setInterval(()=>{
      this.countdown--
      if(this.countdown==0) {
        this.getMarketPrice()
        this.countdown=5
      }
    },1000)

  },
  methods:{
    getMarketPrice(){
      axios.get('http://127.0.0.1:12345/getMarketPrice')
          .then(res=>{
            this.stocks_old=this.stocks
            this.stocks=res.data
            // console.log(this.$root.code2name==={})
            // 如果是空对象就执行，防止无意义计算
            if(Object.keys(this.$root.code2name).length === 0){
              this.$root.code2name=this.stocks.reduce((acc, current) => {
                acc[current.Code] = current.Name;
                return acc;
              }, {});
            }
            // console.log(this.$root.code2name)
          }).catch(error=>{
          this.$message({
            type:'error',
            message:error.message
          });
        });
    },
    handleChartClick(scope){
      this.stock_code=scope.row.Code
      this.stock_name=scope.row.Name
      this.chart_visible=true
    },
    handleTradeClick(scope){
      this.stock_code=scope.row.Code
      this.stock_name=scope.row.Name
      if(this.$root.state===0){
        this.$message({
          type:'error',
          message:'未登录用户不能交易'
        });
      }else{
        this.form_visible=true
      }
    },
    tradeFormSubmit(){
      axios.get('http://127.0.0.1:12345/trade',{
        params:{
          username:this.$root.username,
          code:this.stock_code,
          direction:this.tradeForm.direction,
          price:this.tradeForm.price,
          amount:this.tradeForm.amount,
        }
      }).then(res=>{
        switch (res.data) {
          case 0:
            this.$message({
              type:'error',
              message:'交易错误'
            });
            break;
          case 1:
            this.$message({
              type:'success',
              message:'委托成功'
            });
            break;
          case 2:
            this.$root.getBalance()
            this.$message({
              type:'success',
              message:'交易成功'
            });
            break;
          case 3:
            this.$message({
              type:'warning',
              message:'交易作废'
            });
            break;
          case 4:
            this.$message({
              type:'error',
              message:'账户余额不足'
            });
            break;
          case 5:
            this.$message({
              type:'error',
              message:'持仓余额不足'
            });
            break;
          default:
            this.$message({
              type:'info',
              message:'未知状况'
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

<template>
  <div class="MainPage">
    <div class="MainBox">
      <el-dialog v-model="chart_visible"
                 v-model:visible="chart_visible"
                 title="股票详情" width="800"
                 @close="chart_visible = false">
        <template v-slot:title>
          股票
          <span style="font-weight: bold">{{stock_code}} {{ stock_name }} </span>
          过去10时段走势图
        </template>
        <SingleStock :code="this.stock_code"></SingleStock>
      </el-dialog>
      <el-dialog v-model="form_visible"
                 v-model:visible="form_visible"
                 title="发起交易" width="400"
                 @close="form_visible = false">
        <template v-slot:title>
          发起
          <span style="font-weight: bold">{{stock_code}} {{ stock_name }} </span>
          交易
        </template>
        <el-form :model="tradeForm" label-width="auto" style="max-width: 600px">
          <el-form-item label="交易方向">
            <el-radio-group v-model="tradeForm.direction">
              <el-radio value="0">买入</el-radio>
              <el-radio value="1">卖出</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="挂单价格">
            <el-input v-model.number="tradeForm.price"></el-input>
          </el-form-item>
          <el-form-item label="挂单数量">
            <el-input v-model.number="tradeForm.amount"></el-input>
          </el-form-item>
          <el-form-item style="display: flex; justify-content: center; width: 100%;">
            <el-button type="primary" @click="tradeFormSubmit">提交</el-button>
            <el-button
                @click="form_visible=false;tradeForm.direction='';tradeForm.price='';tradeForm.amount=''">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <div class="refresh">股票数据将在{{countdown}}秒后更新</div>
      <div class="stocks">
        <el-tabs v-model="activeName" class="demo-tabs" >
          <el-tab-pane label="沪市" name="first">
            <el-table :data="stocks_all.slice(0,10)" border stripe style="width: 100%">
              <el-table-column prop="Code" label="代码"/>
              <el-table-column prop="Name" label="名称"/>
              <el-table-column prop="Price" label="最新价格" />
              <el-table-column prop="Amount" label="当日涨跌价" />
              <el-table-column prop="Ratio" label="当日涨跌幅" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button type="primary" plain size="medium" @click="handleChartClick(scope)">
                    查看详情
                  </el-button>
                  <el-button type="primary" :disabled="this.$root.state===0" size="medium" @click="handleTradeClick(scope)">
                    交易
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="深市" name="second">
            <el-table :data="stocks_all.slice(10,20)" border stripe style="width: 100%">
              <el-table-column prop="Code" label="代码"/>
              <el-table-column prop="Name" label="名称"/>
              <el-table-column prop="Price" label="最新价格" />
              <el-table-column prop="Amount" label="当日涨跌价" />
              <el-table-column prop="Ratio" label="当日涨跌幅" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button link type="primary" plain size="medium" @click="handleChartClick(scope)">
                    查看详情
                  </el-button>
                  <el-button type="primary" :disabled="this.$root.state===0" size="medium" @click="handleTradeClick(scope)">
                    交易
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="创业板" name="third">
            <el-table :data="stocks_all.slice(20,30)" border stripe style="width: 100%">
              <el-table-column prop="Code" label="代码"/>
              <el-table-column prop="Name" label="名称"/>
              <el-table-column prop="Price" label="最新价格" />
              <el-table-column prop="Amount" label="当日涨跌价" />
              <el-table-column prop="Ratio" label="当日涨跌幅" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button link type="primary" plain size="medium" @click="handleChartClick(scope)">
                    查看详情
                  </el-button>
                  <el-button type="primary" :disabled="this.$root.state===0" size="medium" @click="handleTradeClick(scope)">
                    交易
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<style>
.MainPage{
    width: 100%;
    height: 100vh;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
}
.MainBox{
    width: 100%;
    height: 100%;
    background-color: #fff;
}
.stocks{
  margin:20px
}

.refresh{
  margin-top:20px;
  text-align: center;
  color: red;
  font-size: 30px;
}
</style>