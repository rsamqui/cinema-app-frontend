import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

import type { QueryClient } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <AuthProvider>
      <Header />

      <Outlet />
      <TanStackRouterDevtools />

    </AuthProvider>
  ),
})