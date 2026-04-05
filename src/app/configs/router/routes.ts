export const routes = [
  {
    path: "/",
    component: () => import("@/app/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("@/pages/login/index"),
      },
    ],
  },
];
