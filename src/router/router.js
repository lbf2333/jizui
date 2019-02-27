import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login";
import NotFound from "@/views/404";
import timeOut from "@/views/timeOut";
import Home from "@/views/Home";
import change from "@/views/system/change";
import user from "@/views/user";
import category from "@/views/category";
import school from "@/views/school";
import order from "@/views/order";
import magazine from "@/views/magazine";
import record from "@/views/record";
import magazineForm from "@/views/magazine/form";
import comment from "@/views/comment";
import publishplan from "@/views/publishplan/publishplan";

Vue.use(Router);
let router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/login",
      hidden: true
    },
    {
      path: "/login",
      component: Login,
      name: "login",
      hidden: true
    },
    {
      path: "/404",
      component: NotFound,
      name: "404",
      hidden: true
    },
    {
      path: "/timeOut",
      component: timeOut,
      name: "timeOut",
      hidden: true
    },
    {
      path: "/",
      component: Home,
      meta: {
        title: "用户管理",
        iconCls: "fa fa-user" //图标样式class
      },
      children: [
        {
          path: "/user",
          component: user,
          name: "user",
          meta: {
            title: "用户管理"
          }
        }
      ]
    },
    {
      path: "/",
      component: Home,
      meta: {
        title: "分类管理",
        iconCls: "fa fa-cubes" //图标样式class
      },
      children: [
        {
          path: "/category",
          component: category,
          name: "category",
          meta: {
            title: "分类管理"
          }
        }
      ]
    },
    {
      path: "/",
      component: Home,
      meta: {
        title: "学校管理",
        iconCls: "fa fa-university" //图标样式class
      },
      children: [
        {
          path: "/school",
          component: school,
          name: "school",
          meta: {
            title: "学校管理"
          }
        }
      ]
    },
    {
      path: "/",
      component: Home,
      meta: {
        title: "杂志管理",
        iconCls: "fa fa-book" //图标样式class
      },
      children: [
        {
          path: "/magazine",
          component: magazine,
          name: "magazine",
          meta: {
            title: "杂志管理"
          }
        },
        {
          path: "magazineForm",
          component: magazineForm,
          name: "magazineForm",
          meta: {
            title: "新增杂志"
          },
          hidden: true
        }
      ]
    },
    {
      path: "/",
      component: Home,
      meta: {
        title: "评论管理",
        iconCls: "fa fa-comment" //图标样式class
      },
      children: [
        {
          path: "/comment",
          component: comment,
          name: "comment",
          meta: {
            title: "评论管理"
          }
        }
      ]
    },
    {
      path: "/",
      component: Home,
      meta: {
        title: "订单管理",
        iconCls: "fa fa-reorder" //图标样式class
      },
      children: [
        {
          path: "/order",
          component: order,
          name: "order",
          meta: {
            title: "订单管理"
          }
        }
      ]
    },
    {
      path: "/",
      component: Home,
      meta: {
        title: "出版计划",
        iconCls: "fa fa-truck"
      },
      children: [
        {
          path: "/publishplan",
          component: publishplan,
          name: "publishplan",
          meta: {
            title: "出版计划"
          }
        }
      ]
    },
    {
      path: "/",
      component: Home,
      meta: {
        title: "钱包记录管理",
        iconCls: "fa fa-dollar" //图标样式class
      },
      children: [
        {
          path: "/record",
          component: record,
          name: "record",
          meta: {
            title: "钱包记录管理"
          }
        }
      ]
    },
    {
      path: "/",
      component: Home,
      meta: {
        title: "系统管理",
        iconCls: "fa fa-cog"
      },
      children: [
        {
          path: "/change",
          component: change,
          name: "change",
          meta: {
            title: "修改密码"
          }
        }
      ]
    },
    {
      path: "*",
      hidden: true,
      redirect: { path: "/404" }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (from.path == "/404" && to.path != "/change") {
    next({ path: "/change" });
  }
  if (to.path == "/login") {
    sessionStorage.removeItem("token");
  }
  let token = sessionStorage.getItem("token");
  if (
    !token &&
    !(to.path == "/login" || to.path == "/404" || to.path == "/timeOut")
  ) {
    next({ path: "/login" });
  } else {
    next();
  }
});

export default router;
