import { createWebHistory, createRouter } from 'vue-router'
import home from '../views/home/home.vue'
import person from '../views/person/person.vue'
import interview from '../views/interview/interview.vue'


const routes = [
  { path: '/', component: home },
  { path: '/home', component: home },
  { path: '/person', component: person },
  { path: '/interview', component: interview },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router