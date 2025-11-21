# vue-up 屏幕响应式适配与设计实现笔记

## 1. 总体设计目标

- **背景颜色**：固定为白色 `#ffffff`，不随系统深浅色模式变化。
- **文字颜色**：主体文字使用深色 `#111827`，保证在白底上的可读性。
- **布局宽度**：内容区域最大宽度控制在 ~1024px，居中显示，两侧留白。
- **适配范围**：
  - 大屏（桌面端 ≥ 1024px）
  - 中等屏（平板 768px–1023px）
  - 小屏（手机 ≤ 767px）

## 2. index.html 中的适配实现

文件：`vue-up/index.html`

### 2.1 视口设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

作用：

- 让页面宽度跟随设备宽度缩放，是移动端/响应式布局的前置条件。

### 2.2 全局背景、文字颜色与布局容器

在 `<head>` 中新增了内联样式：

```html
<style>
  html,
  body {
    margin: 0;
    padding: 0;
    min-height: 100%;
  }

  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      sans-serif;
    background-color: #ffffff; /* 固定白色背景 */
    color: #111827; /* 深色文字 */
    -webkit-font-smoothing: antialiased;
  }

  #app {
    box-sizing: border-box;
    width: 100%;
    max-width: 1024px; /* 设计最大宽度 */
    margin: 0 auto; /* 在大屏居中 */
    padding: 2rem; /* 默认边距 */
  }

  @media (max-width: 768px) {
    #app {
      padding: 1.5rem; /* 平板等中等屏，略微收紧边距 */
    }
  }

  @media (max-width: 480px) {
    #app {
      padding: 1rem; /* 手机小屏，进一步收紧边距，避免左右被挤压 */
    }
  }
</style>
```

**实现要点：**

- **白色背景**：`body` 的 `background-color` 设置为 `#ffffff`，确保整体页面背景是白色。
- **文字颜色**：`body` 的 `color` 设置为 `#111827`，统一默认文字颜色。
- **布局宽度**：`#app` 使用 `max-width: 1024px` + `margin: 0 auto`，实现内容区域在大屏上的居中与最大宽度约束。
- **响应式内边距**：通过两个断点（`768px` 与 `480px`）递减 `padding`，保证在小屏设备上内容不贴边，也不会占据过多可视宽度。

## 3. src/style.css 全局样式调整

文件：`vue-up/src/style.css`

### 3.1 统一为白底深字

原始模板中 `:root` 使用了暗色背景和 `color-scheme: light dark;`，我们进行了统一调整：

```css
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #111827;        /* 全局默认文字颜色 */
  background-color: #ffffff; /* 全局默认背景色为白色 */
}
```

这样可以保证：

- 不再走暗色模式的背景逻辑，避免和 index.html 中的白色背景冲突。
- 所有未特别指定颜色的文字，默认都是深色文本。

> 说明：`body` 的布局（`display: flex; place-items: center; ...`）依然由模板保留，如后续设计需要，可再根据业务需要进行单独调整。

## 4. App.vue 中的局部响应式布局

文件：`vue-up/src/App.vue`

为了让页面内容在不同屏幕下更加合理分布，对根组件结构和样式进行了适配：

### 4.1 结构

```vue
<template>
  <main class="app-shell">
    <section class="logo-grid" aria-label="Framework logos">
      <!-- Vite / Vue Logo 区域 -->
    </section>
    <HelloWorld msg="Vite + Vue" />
  </main>
</template>
```

- 使用 `<main>` + `<section>` 提升语义化，有利于 SEO 与无障碍。

### 4.2 样式

```vue
<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: min(960px, 100%);
  margin: 0 auto;
}

.logo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  place-items: center;
  width: 100%;
}

.logo {
  height: clamp(4rem, 8vw, 6rem);
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

@media (max-width: 600px) {
  .app-shell {
    gap: 1.5rem;
  }

  .logo {
    padding: 1rem;
  }
}
</style>
```

**实现要点：**

- `.app-shell`：
  - 使用 `flex` 垂直排列 logo 区域和内容组件。
  - 宽度使用 `min(960px, 100%)`，在小屏自动缩小，在大屏限制最大宽度。
- `.logo-grid`：
  - 使用 CSS Grid + `auto-fit` + `minmax(120px, 1fr)`，logo 在大屏时并排，小屏时自动换行。
- `.logo`：
  - `height: clamp(4rem, 8vw, 6rem)` 保证在极小屏/大屏下都不过小或过大。
  - 在 `max-width: 600px` 的断点下，减少 `padding`，避免 logo 占用过多垂直空间。

## 5. 调整参数的建议

如需后续微调，可以重点关注以下可调参数：

- **最大内容宽度**：
  - `index.html` 中 `#app` 的 `max-width: 1024px`。
  - `App.vue` 中 `.app-shell` 的 `width: min(960px, 100%)`。
- **颜色体系**：
  - `body` 和 `:root` 的 `background-color` / `color`。
  - 链接颜色在 `style.css` 中的 `a`、`a:hover` 规则。
- **断点选择**：
  - `768px`、`480px`、`600px` 等断点，可以按设计稿调整为 640/960/1200 等常用栅格值。

## 6. 后续扩展方向

- 针对具体业务模块（表单、列表、卡片等）设计组件级响应式样式。
- 将通用断点与颜色变量抽离成 `:root` 自定义属性或单独的主题文件，便于全局维护。
- 视情况引入 TailwindCSS 或其他设计系统，以统一更大范围内的样式规范。

---

## 7. 路由（普通路由 & 动态路由）实现说明

本项目使用 **Vue Router 4** 作为路由管理工具，用于在单页应用中根据 URL 切换不同视图。

### 7.1 依赖与基础配置

在 `package.json` 中增加路由依赖：

```json
"dependencies": {
  "vue": "^3.5.24",
  "vue-router": "^4.4.0"
}
```

> 使用 Vue 3 + Vue Router 4 的标准组合。

入口文件 `src/main.ts` 中挂载路由：

```ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.mount('#app')
```

作用：

- 创建应用实例，并通过 `app.use(router)` 注册路由插件，让整棵组件树都可以使用 `<RouterView>`、`<RouterLink>` 以及路由相关 API。

### 7.2 路由配置文件（普通路由 + 动态路由）

文件：`src/router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserProfileView from '../views/UserProfileView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/user/:id',
    name: 'user-profile',
    component: UserProfileView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

#### 7.2.1 普通路由（静态路由）

- **定义**：
  - 路由对象：
    - `path: '/'`
    - `name: 'home'`
    - `component: HomeView`
- **作用**：
  - 访问 `/` 时，渲染 `HomeView.vue` 作为当前页面内容。
  - 常用于：首页、列表页、关于页等路径固定的页面。

对应视图组件：`src/views/HomeView.vue`

```vue
<template>
  <section>
    <h1>Home</h1>
    <p>这是一个普通路由示例，对应路径 <code>/</code>。</p>
  </section>
  </template>
```

#### 7.2.2 动态路由

- **定义**：
  - 路由对象：
    - `path: '/user/:id'`
    - `name: 'user-profile'`
    - `component: UserProfileView`
    - `props: true`（将路由参数作为组件 `props` 传入）
- **作用**：
  - `/user/123`、`/user/abc` 等不同路径，会渲染同一个组件 `UserProfileView.vue`，但拿到的 `id` 不同。
  - 常用于：用户详情、商品详情、文章详情等“同一模版 + 不同数据”的页面。

对应视图组件：`src/views/UserProfileView.vue`

```vue
<script setup lang="ts">
const props = defineProps<{
  id: string
}>()
</script>

<template>
  <section>
    <h1>用户详情</h1>
    <p>这是一个<strong>动态路由</strong>示例，对应路径 <code>/user/:id</code>。</p>
    <p>当前匹配到的 <code>id</code> 为：<strong>{{ props.id }}</strong></p>
  </section>
</template>
```

### 7.3 在 App.vue 中使用路由视图与导航

文件：`src/App.vue`

模板中使用 `<RouterLink>` 和 `<RouterView>`：

```vue
<template>
  <main class="app-shell">
    <header class="site-header">
      <nav class="nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink :to="'/user/123'">用户 123</RouterLink>
      </nav>
    </header>
    <section class="page-container">
      <RouterView />
    </section>
  </main>
</template>
```

**关键点：**

- `<RouterLink>`：
  - 负责在 SPA 内部进行导航，避免整页刷新。
  - `to="/"` 对应普通路由首页，`to="/user/123"` 对应一个具体的动态路由实例。
- `<RouterView>`：
  - 当前匹配到的路由对应的组件（如 `HomeView` 或 `UserProfileView`）会在这里渲染。

样式中增加了导航相关样式：

```vue
<style scoped>
.site-header {
  width: 100%;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav a {
  font-weight: 500;
}

.page-container {
  width: 100%;
}
</style>
```

### 7.4 普通路由 vs 动态路由 总结

- **普通路由（静态路由）**：
  - 路径固定，如 `/`、`/about`。
  - 一条路径对应一个组件实例。
  - 适合布局固定、内容相对独立的页面。

- **动态路由**：
  - 路径包含参数占位符，如 `/user/:id`、`/post/:slug`。
  - 多个不同的 URL 共享同一组件，通过参数决定展示哪条数据。
  - 非常适合详情页、需要根据 ID/slug 加载后端数据的场景。

在实际项目中，一般会：

- 使用普通路由组织整体信息架构（首页、板块页、关于页、设置页等）。
- 使用动态路由承载实体对象的详情视图（用户、文章、商品等）。

---

## 8. 无真实接口时如何使用动态数据（本地 Mock API 实践）

在真实项目中，前端经常需要在后端接口尚未就绪、或联调不方便的情况下，**先完成页面开发和交互逻辑**。本项目加入了一个简单的本地 Mock API 示例，帮助练习：

- 如何模拟接口返回的 **列表数据**；
- 如何根据动态路由参数加载 **详情数据**；
- 如何在组件中处理 **加载中 / 错误 / 成功** 三种状态。

### 8.1 本地 Mock API 模块

文件：`src/mockApi.ts`

```ts
export type Article = {
  id: string
  title: string
  summary: string
}

const mockArticles: Article[] = [
  { id: '1', title: '使用本地 Mock API 练习前端接口对接', summary: '演示在没有真实后端接口时，如何用本地数据模拟异步请求。' },
  { id: '2', title: 'Vue 路由：普通路由与动态路由', summary: '通过 / 和 /user/:id 路由示例理解基础路由配置。' },
  { id: '3', title: '响应式布局实践', summary: '利用 meta viewport、max-width 和媒体查询实现常见响应式需求。' },
]

// 模拟获取文章列表
export function fetchArticles(): Promise<Article[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockArticles)
    }, 500) // 模拟网络延迟
  })
}

// 模拟按 ID 获取单篇文章
export function fetchArticleById(id: string): Promise<Article | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockArticles.find((item) => item.id === id))
    }, 400)
  })
}
```

要点：

- 使用本地数组 `mockArticles` 代替真实后端返回的数据。
- 使用 `Promise + setTimeout` 模拟网络延迟，让组件逻辑和“真接口”保持一致：
  - 需要处理异步；
  - 需要考虑 loading 和 error。

### 8.2 在首页使用 Mock 列表接口

文件：`src/views/HomeView.vue`

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchArticles, type Article } from '../mockApi'

const loading = ref(false)
const errorMessage = ref('')
const articles = ref<Article[]>([])

onMounted(async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await fetchArticles()
    articles.value = data
  } catch (error) {
    errorMessage.value = '加载文章列表失败（本地 mock 数据）。'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <h1>Home</h1>
    <p>这是一个普通路由示例，对应路径 <code>/</code>，并通过本地 mock 接口展示文章列表。</p>

    <p v-if="loading">正在加载文章列表...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <ul v-else>
      <li v-for="article in articles" :key="article.id">
        <h2>{{ article.title }}</h2>
        <p>{{ article.summary }}</p>
      </li>
    </ul>
  </section>
</template>
```

**实现思路：**

- 组件挂载时（`onMounted`）调用 `fetchArticles()`，模拟“请求接口获取列表”。
- 使用 `loading` 控制“加载中”文案；
- 使用 `errorMessage` 存储错误信息；
- 使用 `articles` 存储成功返回的列表，并通过 `v-for` 渲染到模板。

你可以很容易地将 `fetchArticles()` 换成真实的 `fetch('/api/articles')` 或 `axios.get('/api/articles')`，组件内部逻辑基本不需要改动。

### 8.3 在动态路由详情页使用 Mock 详情接口

文件：`src/views/UserProfileView.vue`

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchArticleById, type Article } from '../mockApi'

const props = defineProps<{
  id: string
}>()

const loading = ref(false)
const errorMessage = ref('')
const article = ref<Article | null>(null)

onMounted(async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await fetchArticleById(props.id)
    if (!data) {
      errorMessage.value = `未找到 ID 为 ${props.id} 的数据（本地 mock）。`
      article.value = null
    } else {
      article.value = data
    }
  } catch (error) {
    errorMessage.value = '加载详情失败（本地 mock 数据）。'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <h1>详情页（通过动态路由 /user/:id 模拟）</h1>

    <p>当前路由参数 <code>id</code> 为：<strong>{{ props.id }}</strong></p>

    <p v-if="loading">正在加载详情数据...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <article v-else-if="article">
      <h2>{{ article.title }}</h2>
      <p>{{ article.summary }}</p>
    </article>

    <p v-else>暂无数据。</p>
  </section>
</template>
```

**实现思路：**

- 动态路由 `path: '/user/:id'` 将 `id` 作为 `props` 传入组件。
- 组件挂载时根据 `props.id` 调用 `fetchArticleById`，模拟“根据 ID 请求详情接口”。
- 同样处理 loading / error / 成功三种状态。

未来对接真实接口时，只需要：

- 保留组件内部的状态管理逻辑；
- 将 `fetchArticleById(props.id)` 实现替换为真实的 HTTP 请求即可。

### 8.4 小结：没有接口时如何练习

1. 在本地定义一份“接口返回数据”的结构（数组或对象）。
2. 用 `Promise + setTimeout` 包一层，模拟真实接口的异步行为。
3. 在组件中按真实接口的思路写：
   - `loading` / `error` / `data` 三种状态；
   - `onMounted` 或某个事件中触发“请求”。
4. 后端接口就绪后，只需要替换 Mock 实现，不用重写组件逻辑和页面。

---

## 9. 进阶 Mock：分页 / 搜索 / 提交表单（更贴近真实业务）

本节在第 8 章的基础上，进一步模拟真实企业项目中常见的三类交互：

- **分页**：前端控制 `page` / `pageSize`，从接口拿到 `total` 与当前页数据；
- **搜索**：携带 `query` 参数，接口按关键词过滤；
- **提交表单**：发送创建请求，接口做校验并返回新数据。

这些逻辑都通过 `src/mockApi.ts` 和 `src/views/ArticleListView.vue` 实现。

### 9.1 Mock 接口：分页 + 搜索 + 创建

文件：`src/mockApi.ts` 中的扩展部分。

#### 9.1.1 列表参数与返回结构

```ts
export type ArticleListParams = {
  page: number
  pageSize: number
  query?: string
}

export type ArticleListResult = {
  list: Article[]
  page: number
  pageSize: number
  total: number
}
```

#### 9.1.2 带分页 & 搜索的列表接口

```ts
export function fetchArticleList(
  params: ArticleListParams,
): Promise<ArticleListResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { page, pageSize, query } = params

      // 1. 先按关键字过滤（title 或 summary 包含）
      const filtered = query
        ? mockArticles.filter((item) => {
            const keyword = query.trim().toLowerCase()
            return (
              item.title.toLowerCase().includes(keyword) ||
              item.summary.toLowerCase().includes(keyword)
            )
          })
        : mockArticles

      const total = filtered.length

      // 2. 再做分页
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filtered.slice(start, end)

      resolve({
        list,
        page,
        pageSize,
        total,
      })
    }, 500)
  })
}
```

要点：

- **过滤逻辑与分页逻辑分离**：先 `filter` 再 `slice`，结构清晰，方便后续换成后端实现。
- 接口统一返回 `list + total + page + pageSize`，方便前端渲染分页信息。

#### 9.1.3 创建接口（模拟表单提交）

```ts
export type CreateArticlePayload = {
  title: string
  summary: string
}

export function createArticle(
  payload: CreateArticlePayload,
): Promise<Article> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!payload.title.trim()) {
        reject(new Error('标题不能为空'))
        return
      }
      if (!payload.summary.trim()) {
        reject(new Error('摘要不能为空'))
        return
      }

      const newArticle: Article = {
        id: String(mockArticles.length + 1),
        title: payload.title.trim(),
        summary: payload.summary.trim(),
      }

      mockArticles = [newArticle, ...mockArticles]
      resolve(newArticle)
    }, 500)
  })
}
```

要点：

- 在 Mock 层模拟了**基础校验**（标题/摘要不能为空），与真实后端行为类似。
- 成功后将新数据 `unshift` 到列表前面，并返回新建的对象。

### 9.2 页面：文章管理（分页 + 搜索 + 表单）

文件：`src/views/ArticleListView.vue`

该页面用于集中练习三种交互：

- 顶部搜索栏：修改 `query` 并重新请求列表；
- 中部创建表单：提交后刷新列表；
- 底部分页控件：上一页 / 下一页 / 修改每页条数。

关键状态与方法（节选）：

```ts
const page = ref(1)
const pageSize = ref(2)
const total = ref(0)
const query = ref('')

const loading = ref(false)
const errorMessage = ref('')
const list = ref<Article[]>([])

async function loadList() {
  loading.value = true
  errorMessage.value = ''
  try {
    const params: ArticleListParams = {
      page: page.value,
      pageSize: pageSize.value,
      query: query.value,
    }
    const result = await fetchArticleList(params)
    list.value = result.list
    total.value = result.total
  } catch (error) {
    errorMessage.value = '加载列表失败（本地 mock）。'
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  loadList()
}

function goPrev() {
  if (!canPrev.value) return
  page.value -= 1
  loadList()
}

function goNext() {
  if (!canNext.value) return
  page.value += 1
  loadList()
}
```

表单相关逻辑：

```ts
const form = ref<CreateArticlePayload>({ title: '', summary: '' })
const submitting = ref(false)
const submitError = ref('')

async function handleSubmit() {
  submitting.value = true
  submitError.value = ''
  try {
    await createArticle(form.value)
    form.value = { title: '', summary: '' }
    page.value = 1
    await loadList()
  } catch (error: any) {
    submitError.value = error?.message || '创建失败（本地 mock）。'
  } finally {
    submitting.value = false
  }
}
```

模板中包含：

- 搜索输入框 + 搜索按钮；
- 标题/摘要表单 + 提交按钮 + 错误提示；
- 列表渲染 + 分页信息 + 翻页按钮 + pageSize 下拉选择。

路由注册：`src/router/index.ts`

```ts
import ArticleListView from '../views/ArticleListView.vue'

const routes: RouteRecordRaw[] = [
  // ...
  {
    path: '/articles',
    name: 'articles',
    component: ArticleListView,
  },
]
```

在 `App.vue` 中增加导航入口：

```vue
<RouterLink to="/articles">文章管理（Mock）</RouterLink>
```

### 9.3 建议的学习路线（结合本项目）

1. **静态页面与响应式布局**（已在本项目实现）
   - 掌握 meta viewport、max-width、媒体查询的基本用法。
   - 能写出在 PC 和手机上都表现合理的静态页面。

2. **路由基础**（已在本项目实现）
   - 理解普通路由 `/` 与动态路由 `/user/:id` 的区别与使用场景。
   - 能用 `<RouterLink>` + `<RouterView>` 组织多页面结构。

3. **Mock API + 基础数据渲染**（第 8 章）
   - 用本地数组 + Promise 模拟接口；
   - 在组件中实现 loading / error / data 三种状态；
   - 熟悉 `onMounted` 中发起请求的模式。

4. **进阶交互：分页 / 搜索 / 表单**（第 9 章）
   - 学会将查询参数打包成一个对象（如 `ArticleListParams`）；
   - 练习根据参数重新请求列表，以及表单提交后刷新视图；
   - 理解接口设计中 `list + total + page + pageSize` 的常见结构。

5. **替换为真实后端接口**（下一步可实践）
   - 将 `mockApi.ts` 中的实现换成 `fetch/axios` 调用公司接口；
   - 保留组件中的状态逻辑，只改数据来源；
   - 遇到后端错误码时，在 Mock 基础上加入更多错误分支处理。

6. **进一步拓展**（可按需继续）
   - 使用拦截器（如 axios interceptors）统一处理 token / 错误弹窗；
   - 把接口调用抽成 `services` 层，统一管理 API；
   - 结合状态管理（Pinia 等）做跨页面的数据共享。

通过以上步骤，你可以在没有真实后端的情况下，把**页面结构、响应式布局、路由切换、数据渲染、分页搜索和表单提交**这一整套前端工作流程完整练习一遍。后续接入公司接口时，只需要逐步替换 Mock 实现即可。

---

## 10. 简易组件库风格的首页排版（NavBar / PageSection / InfoCard）

为了让页面结构更清晰、可复用，本项目没有直接在页面里大量堆叠 `div`，而是封装了几个**小型 UI 组件**：

- `NavBar`：顶部导航栏
- `PageSection`：带标题/副标题的内容区块容器
- `InfoCard`：展示信息的卡片

这些组件目前都放在 `src/components/ui/` 目录下，首页 `HomeView.vue` 则使用它们来组织页面结构。

### 10.1 NavBar：顶部导航组件

文件：`src/components/ui/NavBar.vue`

```vue
<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()
</script>

<template>
  <header class="nav-bar">
    <div class="nav-bar__inner">
      <div class="nav-bar__brand">
        <span class="nav-bar__logo-circle" />
        <span class="nav-bar__title">{{ props.title ?? 'My App' }}</span>
      </div>
      <nav class="nav-bar__links">
        <slot />
      </nav>
    </div>
  </header>
</template>
```

样式要点：

- 让导航条宽度占满屏幕，内部内容限制在 `max-width: 1024px` 并居中；
- 使用 `slot` 渲染传入的 `<RouterLink>`，这样导航项由外部控制；
- 使用半透明背景 + `backdrop-filter: blur(8px)`，增加一点现代感。

在 `App.vue` 中的使用：

```vue
<script setup lang="ts">
import NavBar from './components/ui/NavBar.vue'
</script>

<template>
  <main class="app-shell">
    <NavBar title="Vue Up Demo">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink :to="'/user/123'">用户 123</RouterLink>
      <RouterLink to="/articles">文章管理（Mock）</RouterLink>
    </NavBar>
    <section class="page-container">
      <RouterView />
    </section>
  </main>
</template>
```

这样做的好处是：后续如果需要新增“设置”、“关于”之类的入口，只需要在 `NavBar` 的 slot 中多加一个 `RouterLink` 即可。

### 10.2 PageSection：通用内容区块容器

文件：`src/components/ui/PageSection.vue`

```vue
<script setup lang="ts">
const props = defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <section class="page-section">
    <header v-if="props.title || props.subtitle" class="page-section__header">
      <h2 v-if="props.title" class="page-section__title">{{ props.title }}</h2>
      <p v-if="props.subtitle" class="page-section__subtitle">
        {{ props.subtitle }}
      </p>
    </header>
    <div class="page-section__body">
      <slot />
    </div>
  </section>
</template>
```

使用场景：

- 首页欢迎区块、某个功能区的包裹层；
- 以后可以在其他页面（比如“设置”、“个人中心”）重复使用，保证视觉统一。

样式上加入了：

- 圆角 + 边框 + 轻微阴影；
- 标题、描述与主体内容的间距控制，避免每个页面都手写 margin。

### 10.3 InfoCard：信息卡片

文件：`src/components/ui/InfoCard.vue`

```vue
<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <article class="info-card">
    <h3 class="info-card__title">{{ props.title }}</h3>
    <p class="info-card__description">
      {{ props.description }}
    </p>
    <div class="info-card__footer">
      <slot />
    </div>
  </article>
</template>
```

特点：

- 标题 + 描述由 props 提供；
- 底部 `slot` 可以放按钮、链接等操作（本项目中放了“查看详情（动态路由）”的链接）。

### 10.4 首页如何组合这些组件

首页文件：`src/views/HomeView.vue`

在逻辑上依旧通过 `fetchArticles()` 获取数据，但在模板里使用组件来排版：

```vue
<template>
  <div class="home-layout">
    <PageSection
      title="欢迎来到 Vue Up Demo"
      subtitle="练习响应式布局、路由、Mock 接口和动态数据渲染的示例项目。"
    >
      <p>
        当前首页通过一个简单的“组件库风格”布局组件来组织内容区块，并使用本地
        Mock 接口加载文章数据。
      </p>
    </PageSection>

    <PageSection
      class="home-layout__grid-section"
      title="最近的学习主题（来自 Mock 列表）"
      subtitle="这些数据来自 src/mockApi.ts，可以按需扩展或替换为真实接口。"
    >
      <div class="home-layout__grid">
        <p v-if="loading">正在加载文章列表...</p>
        <p v-else-if="errorMessage">{{ errorMessage }}</p>

        <template v-else>
          <p v-if="articles.length === 0">暂无数据。</p>
          <div v-else class="home-layout__cards">
            <InfoCard
              v-for="article in articles"
              :key="article.id"
              :title="article.title"
              :description="article.summary"
            >
              <RouterLink :to="`/user/${article.id}`">查看详情（动态路由）</RouterLink>
            </InfoCard>
          </div>
        </template>
      </div>
    </PageSection>
  </div>
</template>
```

布局样式摘要：

- 使用 `.home-layout` 控制整个首页是垂直堆叠的区块流；
- 使用 `.home-layout__cards` 结合 `grid` 实现自适应卡片布局：

```css
.home-layout__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
```

### 10.5 这种“小组件库”方式的好处

- **复用性**：NavBar / PageSection / InfoCard 可以在多个页面重复使用，不必每次重新写结构和样式。
- **一致性**：页面视觉风格统一，有利于团队协作和后续扩展。
- **可维护性**：当你想调整导航风格或卡片风格时，只需要改对应组件，不需要逐页查找替换。

在真实项目中，一般会引入成熟的组件库（如 Element Plus、Ant Design Vue、Naive UI 等），但在学习阶段，先用这种轻量的自定义组件方式，可以帮助你理解：

- 组件应该拆到什么粒度；
- props + slot 如何设计；
- 布局/样式如何封装在组件内部而不是散落在每个页面。
