import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  // This is the route for your main page, the list of all Pokémon.
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  // This is the route for the detail page of a single Pokémon.
  // The ":name" part is a dynamic parameter that will hold the Pokémon's name.
  {
    path: '/pokemon/:name',
    name: 'pokemon-detail',
    component: () => import('../views/PokemonDetailView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
