import Vue from 'vue';
import Router from 'vue-router';
import Trivia from '@/components/trivia/trivia.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/trivia',
      name: 'Trivia',
      component: Trivia
    }
  ]
})