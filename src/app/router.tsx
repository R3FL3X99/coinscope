import { createBrowserRouter } from 'react-router-dom'
import { RouteError } from './errors/RouteError'
import { AppShell } from './layout/AppShell'
import { About } from '../pages/About'
import { CoinDetails } from '../pages/CoinDetails'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import { Watchlist } from '../pages/Watchlist'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'coin/:id', element: <CoinDetails /> },
      { path: 'watchlist', element: <Watchlist /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
