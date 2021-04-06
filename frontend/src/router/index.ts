import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Main from '@/views/Main.vue';
import TalkRoom from '@/views/TalkRoom.vue';
import User from '@/views/User.vue';
import Room from '@/views/Room.vue';
import Login from '@/views/Login.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Main',
		component: Main,
		children: [
			{
				path: 'talk/:room_id',
				name: 'TalkRoom',
				component: TalkRoom,
			},
			{
				path: 'room',
				name: 'Room',
				component: Room
			}
		]
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/user',
		name: 'User',
		component: User
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;
