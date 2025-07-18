import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Room from '../views/Room.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/room/:id', component: Room },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router