import { createWebHistory, createRouter } from 'vue-router'
import home from '../views/home.vue'
import person from '../views/person.vue'
import interview from '../views/interview.vue'
import interviewInformation from '../views/interviewInformation.vue'
import test from '../views/test.vue'

const routes = [
  { path: '/', component: home },
  { path: '/home', component: home },
  { path: '/person', component: person },
  { path: '/interview', component: interview },
  { 
    path: '/interview/:id', 
    name: 'interviewInformation', 
    component: interviewInformation 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router