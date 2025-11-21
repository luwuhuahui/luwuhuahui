// 简单的本地模拟接口示例

export type Article = {
  id: string
  title: string
  summary: string
}

// 用 let，后续提交表单时会往里 push 新数据
let mockArticles: Article[] = [
  { id: '1', title: '使用本地 Mock API 练习前端接口对接', summary: '演示在没有真实后端接口时，如何用本地数据模拟异步请求。' },
  { id: '2', title: 'Vue 路由：普通路由与动态路由', summary: '通过 / 和 /user/:id 路由示例理解基础路由配置。' },
  { id: '3', title: '响应式布局实践', summary: '利用 meta viewport、max-width 和媒体查询实现常见响应式需求。' },
  { id: '4', title: '前端分页与搜索实践', summary: '使用 query + page + pageSize 组合模拟列表筛选与分页。' },
  { id: '5', title: '表单提交与校验', summary: '通过本地新增一条记录练习创建接口与错误处理。' },
]

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

// 模拟带分页 & 搜索的列表接口
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

// 模拟获取全部文章（不分页）——保留给简单场景使用
export function fetchArticles(): Promise<Article[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockArticles])
    }, 300)
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

export type CreateArticlePayload = {
  title: string
  summary: string
}

// 模拟创建文章（表单提交）
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
