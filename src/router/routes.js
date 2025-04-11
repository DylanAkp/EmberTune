const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/HomePage.vue') }],
  },
  {
    path: '/artist/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/ArtistPage.vue') }],
  },
  {
    path: '/playlists',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/PlaylistPage.vue') },
      { path: ':id', component: () => import('src/pages/PlaylistDetailPage.vue') },
    ],
  },
  {
    path: '/search',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/SearchPage.vue') }],
  },
  {
    path: '/settings',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/SettingPage.vue') }],
  },
  {
    path: '/lyrics',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/LyricsPage.vue') }],
  },
  {
    path: '/overlay',
    component: () => import('src/pages/Overlay.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/HomePage.vue') }],
  },
]

export default routes
