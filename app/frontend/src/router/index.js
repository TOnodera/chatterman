import { createRouter, createWebHistory } from 'vue-router';
import Main from '@/views/Main';
import Talk from '@/views/Talk';
import User from '@/views/User';
import Room from '@/views/Room';
import Login from '@/views/Login';

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children:[
      {
        path: 'talk',
        name: 'Talk',
        component: Talk
      },
      {
        path: 'user',
        name: 'User',
        component: User
      },
      {
        path: 'room',
        name: 'Room',
        component: Room
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
