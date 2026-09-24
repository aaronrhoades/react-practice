import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import App from './App'
import Register from './components/Register'
import User from './components/User'

const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Register,
})

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: User,
})

const routeTree = rootRoute.addChildren([indexRoute, usersRoute])

export const router = createRouter({ routeTree })

export type RouterType = typeof router
