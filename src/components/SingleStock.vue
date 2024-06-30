<script>
import * as echarts from 'echarts/core'
import {BarChart} from 'echarts/charts'
import{
  TitleComponent,TooltipComponent,GridComponent,
    DatasetComponent,TransformComponent
} from "echarts/components";
import {LabelLayout,UniversalTransition} from "echarts/features";
import {CanvasRenderer} from "echarts/renderers";
import axios from "axios";

export default {
  created() {
    echarts.use([
        BarChart,TitleComponent,TooltipComponent,GridComponent,DatasetComponent,
        TransformComponent,LabelLayout,UniversalTransition, CanvasRenderer
    ])
  },
  props:{
    code: String
  },
  data(){
    return{
      stock_data:[],
      countdown:5,
      myChart:null,

      timer_stock_data:null,
    }
  },
  mounted() {
    this.myChart=echarts.init(document.querySelector('#main'))
    this.getStockPrice()
    this.timer_countdown=setInterval(()=>{
      this.countdown--
      if(this.countdown==0) {
        this.getStockPrice()
        this.countdown=5
      }

    },1000)
  },
  methods:{
    getStockPrice(){
      axios.get('http://127.0.0.1:12345/getStockPrice',{
        params:{
          code:this.code
        }
      }).then(res=>{
        let arr=res.data
        if(arr.length<10){
          this.stock_data=Array(10-arr.length).fill(0)
          this.stock_data=this.stock_data.concat(arr)
        }else{
          this.stock_data=arr.slice(arr.length-10,arr.length)
        }
        let op_new={
          title: {text: ""},
          tooltip: {},
          xAxis: {
            type: 'category',
            data: ['1','2','3','4','5','6','7','8','9','10']
          },
          yAxis: {
            type: 'value',
            scale:true
          },
          series: [
            {
              name: "测试",
              type: "line",
              // smooth: true,
              data: this.stock_data
            }
          ]
        }
        this.myChart.setOption(op_new)
        // console.log(this.stock_data)
      }).catch(error=>{
        this.$message({
          type:'success',
          message:error.message
        });
      });
    }
  }
}

</script>

<template>
  <div class="refresh">股票数据将在{{countdown}}秒后更新</div>
  <div id="main"></div>
</template>

<style>
#main{
  width:600px;
  height:500px
}
</style>