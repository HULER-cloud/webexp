<template>
  <div class="web">
    <WebHeader></WebHeader>
    <router-view></router-view>
  </div>
</template>

<script>
import WebHeader from "@/components/WebHeader.vue";
import  {ref} from 'vue'
import axios from "axios";


export default {

  data(){
    const balance=ref(0)
    return {
      state: 0,
      username: "默认用户名",
      balance,
      code2name:{},
    }
  },
  provide(){
    return{
      state:this.state,
      username:this.username,
    }
  },
  name: 'App',
  components: {
    WebHeader,

  },
  methods: {
    getBalance(){
      axios.get('http://127.0.0.1:12345/getBalance', {
        params:{
          username: this.$root.username,
        }
      }).then(res=>{
        if(res.data!==-1){
          this.$root.balance=res.data
        }else{
          this.$message({
            type:'error',
            message:'获取用户余额失败'
          });
        }
      }).catch(error=>{
        this.$message({
          type:'error',
          message:error.message
        });
      });
    }
  }
}



const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);

    }, delay);
  }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}
</script>

<style>



</style>
