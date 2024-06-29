import {createRouter,createWebHistory} from "vue-router";
import Login from "@/components/LogView.vue";
import Register from "@/components/RegView.vue";
import MainPage from "@/components/MainPage.vue";
import Inventory from "@/components/InventoryView.vue";
import TradeRecordView from "@/components/TradeRecordView.vue";

const routes=[
    {path:'/',component:MainPage,},
    {path:'/main',component:MainPage,},
    {path:'/login',component:Login},
    {path:'/register',component:Register},
    {path:'/inventory',component: Inventory},
    {path:'/trade_record',component: TradeRecordView}
]

const router= createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router