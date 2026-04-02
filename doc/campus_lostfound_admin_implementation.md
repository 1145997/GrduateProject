# 校园失物招领系统后台管理端实现方案（基于 V3 Admin Vite 5.x）

## 1. 技术落地目标

基于现有后端接口，构建一个完整([github.com](https://github.com/un-pany/v3-admin-vite?utm_source=chatgpt.com))统计
- 待审核信息管理
- 失物/招领信息管理
- 公告管理
- 用户管理（先预留页面与接口位）
- 权限与路由控制

前端基座：**V3 Admin Vite 5.x**  
业务后端：**Spring Boot 3.5.x + JWT + RESTful API**

---

## 2. 建议的后台功能结构

### 2.1 页面菜单结构

```text
后台管理
├─ 仪表盘
│  └─ 工作台首页 /dashboard
├─ 信息审核
│  └─ 待审核列表 /lostfound/pending
├─ 信息管理
│  └─ 全部信息 /lostfound/list
├─ 公告管理
│  └─ 公告列表 /notice/list
├─ 用户管理
│  └─ 用户列表 /user/list   （先预留）
└─ 系统设置
   └─ 管理员信息 /profile   （可选）
```

---

## 3. 对应后端接口映射

### 3.1 认证

- `POST /api/auth/admin/login` 管理员登录

### 3.2 仪表盘

- `GET /api/admin/statistics/overview` 总览统计
- `GET /api/admin/statistics/trend/recent7days` 近7天趋势

### 3.3 失物招领审核/管理

- `GET /api/admin/lostfound/pending` 待审核列表
- `GET /api/admin/lostfound/list` 全部信息列表
- `GET /api/admin/lostfound/{id}` 信息详情
- `PUT /api/admin/lostfound/{id}/approve` 审核通过
- `PUT /api/admin/lostfound/{id}/reject` 审核驳回

### 3.4 公告管理

- `POST /api/admin/notice` 新增公告
- `GET /api/admin/notice/list` 公告分页列表
- `PUT /api/admin/notice/{id}` 修改公告
- `DELETE /api/admin/notice/{id}` 删除公告

### 3.5 用户管理

当前 `api_info.txt` 中尚未看到后台用户列表/禁用/删除接口，因此前端页面可先预留，后续再补。

---

## 4. 前端目录建议

```text
src/
├─ api/
│  ├─ auth.ts
│  ├─ dashboard.ts
│  ├─ lostfound.ts
│  └─ notice.ts
├─ views/
│  ├─ login/
│  │  └─ index.vue
│  ├─ dashboard/
│  │  └─ index.vue
│  ├─ lostfound/
│  │  ├─ pending.vue
│  │  ├─ list.vue
│  │  └─ components/
│  │     ├─ detail-dialog.vue
│  │     └─ reject-dialog.vue
│  ├─ notice/
│  │  ├─ list.vue
│  │  └─ components/
│  │     └─ notice-form-dialog.vue
│  └─ user/
│     └─ list.vue
├─ router/
│  └─ modules/
│     ├─ lostfound.ts
│     ├─ notice.ts
│     └─ user.ts
├─ store/
│  └─ modules/
│     └─ admin-user.ts
└─ utils/
   └─ status.ts
```

---

## 5. 环境变量配置

### `.env.development`

```env
VITE_APP_TITLE=校园失物招领后台
VITE_BASE_API=/dev-api
```

### Vite 代理建议

```ts
server: {
  proxy: {
    "/dev-api": {
      target: "http://127.0.0.1:8080",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/dev-api/, "")
    }
  }
}
```

这样前端请求 `/dev-api/api/...`，会自动转发到 Spring Boot。

---

## 6. Axios 请求封装对接要点

你要重点确认 V3 Admin Vite 当前请求封装文件，把这几项接上：

1. 请求头统一加：
   - `Authorization: Bearer ${token}`
2. 登录成功后将 token 存入本地
3. 401 时清空 token 并跳登录页
4. 保持后端统一返回结构：
   - `code`
   - `message`
   - `data`

### 请求拦截核心逻辑示意

```ts
config.headers.Authorization = `Bearer ${getToken()}`
```

### 响应拦截核心逻辑示意

```ts
if (response.data.code !== 200) {
  ElMessage.error(response.data.message || "请求失败")
  return Promise.reject(response.data)
}
return response.data
```

---

## 7. API 文件示例

## `src/api/auth.ts`

```ts
import request from "@/utils/service"

export interface AdminLoginData {
  username: string
  password: string
}

export interface AdminLoginResponse {
  token: string
  username: string
  nickname: string
  role: string
}

export function adminLogin(data: AdminLoginData) {
  return request<any, { data: AdminLoginResponse }>({
    url: "/api/auth/admin/login",
    method: "post",
    data
  })
}
```

## `src/api/dashboard.ts`

```ts
import request from "@/utils/service"

export interface OverviewData {
  totalUsers: number
  totalInfos: number
  pendingInfos: number
  publishedInfos: number
  finishedInfos: number
  rejectedInfos: number
  totalNotices: number
}

export interface TrendItem {
  date: string
  count: number
}

export function getOverview() {
  return request<any, { data: OverviewData }>({
    url: "/api/admin/statistics/overview",
    method: "get"
  })
}

export function getRecent7DaysTrend() {
  return request<any, { data: { list: TrendItem[] } }>({
    url: "/api/admin/statistics/trend/recent7days",
    method: "get"
  })
}
```

## `src/api/lostfound.ts`

```ts
import request from "@/utils/service"

export interface LostFoundQuery {
  pageNum: number
  pageSize: number
  type?: number
  status?: number
  keyword?: string
}

export interface LostFoundItem {
  id: number
  type: number
  title: string
  itemName: string
  categoryId: number
  image: string
  eventPlace: string
  eventTime: string
  contactName: string
  contactPhone: string
  status: number
  viewCount: number
  createTime: string
}

export interface LostFoundDetail extends LostFoundItem {
  userId: number
  brand: string
  color: string
  description: string
  contactWechat: string
  auditReason: string | null
  auditAdminId: number | null
  auditTime: string | null
  finishTime: string | null
}

export function getPendingList(params: LostFoundQuery) {
  return request<any, { data: { list: LostFoundItem[]; total: number; pageNum: number; pageSize: number } }>({
    url: "/api/admin/lostfound/pending",
    method: "get",
    params
  })
}

export function getLostFoundList(params: LostFoundQuery) {
  return request<any, { data: { list: LostFoundItem[]; total: number; pageNum: number; pageSize: number } }>({
    url: "/api/admin/lostfound/list",
    method: "get",
    params
  })
}

export function getLostFoundDetail(id: number) {
  return request<any, { data: LostFoundDetail }>({
    url: `/api/admin/lostfound/${id}`,
    method: "get"
  })
}

export function approveLostFound(id: number) {
  return request({
    url: `/api/admin/lostfound/${id}/approve`,
    method: "put"
  })
}

export function rejectLostFound(id: number, auditReason: string) {
  return request({
    url: `/api/admin/lostfound/${id}/reject`,
    method: "put",
    data: { auditReason }
  })
}
```

## `src/api/notice.ts`

```ts
import request from "@/utils/service"

export interface NoticeQuery {
  pageNum: number
  pageSize: number
}

export interface NoticeItem {
  id: number
  title: string
  content: string
  isTop: number
  status: number
  publishAdminId: number
  createTime: string
  updateTime: string
}

export interface NoticeFormData {
  title: string
  content: string
  isTop: number
  status: number
}

export function getNoticeList(params: NoticeQuery) {
  return request<any, { data: { list: NoticeItem[]; total: number; pageNum: number; pageSize: number } }>({
    url: "/api/admin/notice/list",
    method: "get",
    params
  })
}

export function createNotice(data: NoticeFormData) {
  return request({
    url: "/api/admin/notice",
    method: "post",
    data
  })
}

export function updateNotice(id: number, data: NoticeFormData) {
  return request({
    url: `/api/admin/notice/${id}`,
    method: "put",
    data
  })
}

export function deleteNotice(id: number) {
  return request({
    url: `/api/admin/notice/${id}`,
    method: "delete"
  })
}
```

---

## 8. 登录页实现思路

### 功能

- 输入管理员账号密码
- 登录成功后保存 token、用户名、角色
- 跳转后台首页 `/dashboard`

### 表单字段

- 用户名 `username`
- 密码 `password`

### 登录成功后建议存储

```ts
{
  token,
  username,
  nickname,
  role
}
```

### 登录页伪代码

```ts
const handleLogin = async () => {
  const res = await adminLogin(form)
  userStore.setToken(res.data.token)
  userStore.setUserInfo({
    username: res.data.username,
    nickname: res.data.nickname,
    role: res.data.role
  })
  router.push("/dashboard")
}
```

---

## 9. 仪表盘首页设计

## 模块一：统计卡片

展示：

- 用户总数
- 信息总数
- 待审核数
- 已发布数
- 已完结数
- 已驳回数
- 公告总数

## 模块二：近7天发布趋势

使用 ECharts 折线图展示：

- X轴：日期
- Y轴：发布数量

## 首页建议布局

```text
[总用户] [总信息] [待审核] [已发布]
[已完结] [已驳回] [公告数]

[近7天发布趋势折线图]
```

---

## 10. 待审核列表页设计

## 查询区

- 关键词（标题 / 物品名）
- 分页

## 表格字段

- ID
- 类型（寻物 / 招领）
- 标题
- 物品名称
- 图片
- 地点
- 时间
- 联系人
- 联系电话
- 创建时间
- 操作

## 操作按钮

- 查看详情
- 审核通过
- 驳回

### 类型显示

- `1 -> 寻物启事`
- `2 -> 招领启事`

### 状态显示

- `0 -> 待审核`
- `1 -> 已发布`
- `2 -> 已驳回`
- `3 -> 已完结`

### 审核流程建议

1. 点击“查看详情”弹出详情抽屉
2. 核对图片、描述、联系方式
3. 点击通过直接确认
4. 点击驳回弹出输入框，填写驳回原因

---

## 11. 全部信息管理页设计

## 筛选项

- 类型 type
- 状态 status
- 关键词 keyword
- 分页

## 表格字段

- ID
- 类型
- 标题
- 物品名
- 地点
- 联系人
- 状态
- 浏览量
- 发布时间/创建时间
- 操作（查看详情）

这个页面主要是后台总览查询，不一定需要直接审核，但可以保留“查看详情”。

---

## 12. 公告管理页设计

## 表格字段

- ID
- 标题
- 内容摘要
- 是否置顶
- 状态
- 发布管理员ID
- 创建时间
- 更新时间
- 操作

## 操作按钮

- 新增
- 编辑
- 删除

## 弹窗表单字段

- 标题
- 内容
- 是否置顶（0/1）
- 状态（0禁用/1发布）

---

## 13. 路由设计示例

## `src/router/modules/lostfound.ts`

```ts
const lostfoundRouter = {
  path: "/lostfound",
  component: Layout,
  redirect: "/lostfound/pending",
  name: "LostFound",
  meta: {
    title: "失物招领管理",
    icon: "Search"
  },
  children: [
    {
      path: "pending",
      name: "LostFoundPending",
      component: () => import("@/views/lostfound/pending.vue"),
      meta: {
        title: "待审核列表"
      }
    },
    {
      path: "list",
      name: "LostFoundList",
      component: () => import("@/views/lostfound/list.vue"),
      meta: {
        title: "全部信息"
      }
    }
  ]
}

export default lostfoundRouter
```

## `src/router/modules/notice.ts`

```ts
const noticeRouter = {
  path: "/notice",
  component: Layout,
  redirect: "/notice/list",
  name: "Notice",
  meta: {
    title: "公告管理",
    icon: "Bell"
  },
  children: [
    {
      path: "list",
      name: "NoticeList",
      component: () => import("@/views/notice/list.vue"),
      meta: {
        title: "公告列表"
      }
    }
  ]
}

export default noticeRouter
```

---

## 14. 工具函数建议

## `src/utils/status.ts`

```ts
export function getInfoTypeText(type: number) {
  return type === 1 ? "寻物启事" : type === 2 ? "招领启事" : "未知"
}

export function getStatusText(status: number) {
  const map: Record<number, string> = {
    0: "待审核",
    1: "已发布",
    2: "已驳回",
    3: "已完结"
  }
  return map[status] || "未知"
}
```

---

## 15. 页面开发顺序建议

### 第一阶段：先打通最小闭环

1. 配置代理和请求封装
2. 完成管理员登录
3. 完成仪表盘首页
4. 完成待审核列表页
5. 完成审核通过/驳回

### 第二阶段：补齐管理功能

6. 全部信息管理页
7. 公告管理页
8. 图片预览、详情抽屉、富文本可选增强

### 第三阶段：后续扩展

9. 用户管理页
10. 权限细化
11. 操作日志
12. 数据导出

---

## 16. 你这个项目当前最适合的实现策略

因为你后端接口已经比较完整，所以前端不用先追求复杂权限系统，建议按下面思路：

- **先用静态路由完成后台骨架**
- **先只做一个管理员角色 super_admin**
- **先把审核、公告、统计三大核心业务跑通**
- **用户管理先占位，等后端接口补齐后再接**

这样最适合毕业设计/课程设计节奏，能最快形成可演示成果。

---

## 17. 下一步最推荐直接开工的内容

下一步直接写这 4 个文件，项目就能开始跑：

1. `src/api/auth.ts`
2. `src/api/dashboard.ts`
3. `src/api/lostfound.ts`
4. `src/api/notice.ts`

然后接：

5. 登录页
6. 仪表盘页
7. 待审核页

---

## 18. 我建议你立刻补充的后端接口

为了把后台真正做完整，后端后续最好再补：

### 用户管理

- 后台分页获取用户列表
- 禁用/启用用户
- 查看用户详情

### 评论管理

- 后台评论列表
- 删除评论
- 屏蔽评论

### 分类管理

- 后台分类列表
- 新增分类
- 修改分类
- 删除分类

### 统计增强

- 类型分布统计
- 状态分布统计
- 热门信息排行

这些会让你的后台更像完整系统，而不是只做“审核面板”。

---

## 19. 毕业设计答辩时的后台亮点说法

你可以这样描述后台价值：

- 通过后台管理端实现了对失物招领信息的全流程监管
- 管理员可对用户发布内容进行审核，保障平台信息真实性与合规性
- 系统支持公告发布与可视化统计，提高校园失物招领服务效率
- 基于前后端分离架构，实现小程序端与管理端协同工作

---

## 20. 最后结论

你现在的后台最优解不是一上来追求“超级完整”，而是：

**先围绕“登录—统计—审核—公告”这条主线，快速做出可运行、可演示、可答辩的管理后台。**

这是最稳、最快、最适合你当前阶段的路线。

