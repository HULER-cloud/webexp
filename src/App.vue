<template>
  <div class="web">
    <WebHeader></WebHeader>
    <router-view></router-view>
  </div>
</template>

<script>
import WebHeader from "@/components/WebHeader.vue";
import  {ref} from 'vue'

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
  created(){
  },
  methods: {
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
