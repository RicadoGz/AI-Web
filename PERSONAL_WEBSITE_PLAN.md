# 个人网站实施计划

## 1. 项目目标

做一个带有个人品牌展示能力的个人网站，满足下面 3 个核心目标：

1. 展示个人信息、项目经历、技能和联系方式。
2. 提供一个 `Chat Bot`，让访问者可以直接提问，了解我是谁、做过什么、能提供什么价值。
3. 后端能够追踪访问行为，统计页面访问、来源、停留、点击等数据，方便持续优化网站内容。

## 2. MVP 版本范围

第一版先做最小可用版本，重点保证能上线、能展示、能对话、能统计。

### 前台页面

- 首页：一句清晰的个人介绍 + 主视觉 + CTA
- About 页面：个人背景、经历、价值主张
- Projects 页面：项目列表、项目详情、技术栈、成果
- Contact 页面：邮箱、社媒、表单
- Chat Bot 组件：全站悬浮或固定在首页/右下角

### 后端能力

- 访问追踪接口
- Chat Bot 对话接口
- 管理端基础统计接口
- 日志与错误监控

## 3. 推荐技术方案

为了开发效率和后期维护，建议采用下面的组合：

### 前端

- `Next.js`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui` 或轻量自定义组件

原因：

- 页面型网站适合 `Next.js`
- SEO 友好
- 以后加博客、项目详情、服务页都方便
- 前后端联动简单

### 后端

- `Next.js API Routes` 或独立 `FastAPI`

建议：

- 如果你想先快速做完，使用 `Next.js + API Routes`
- 如果你后面想做更多数据分析、定时任务、复杂管理后台，使用 `FastAPI`

这份计划默认按 `Next.js 前端 + FastAPI 后端` 设计，结构更清晰。

### 数据库

- `PostgreSQL`

### 缓存/队列（可选）

- `Redis`

### 部署

- 前端：`Vercel`
- 后端：`Railway` / `Render` / `Fly.io`
- 数据库：`Neon` / `Supabase Postgres`

## 4. 网站信息架构

建议站点结构如下：

```text
/
/about
/projects
/projects/[slug]
/contact
/chat
```

后续可扩展：

```text
/blog
/uses
/resume
```

## 5. Chat Bot 规划

## 目标

让访问者能直接通过聊天快速了解你，而不是自己翻页面。

## Chat Bot 能回答的内容

- 你是谁
- 你的技能栈
- 你做过的项目
- 你的工作/合作方向
- 联系方式
- 简历相关问题

## 实现方式

### 第一阶段

- 使用固定知识库回答
- 知识来源：
  - `about` 内容
  - 项目列表
  - 简历内容
  - FAQ

### 第二阶段

- 接入大模型 API
- 做简单的 `RAG`
- 将你的个人资料、项目说明、博客内容作为检索数据源

## Chat Bot MVP 功能

- 浮动聊天入口
- 对话窗口
- 常见问题快捷按钮
- 后端调用模型接口
- 保存对话日志
- 基础限流

## 建议接口

- `POST /api/chat/message`
- `GET /api/chat/history/:sessionId`

## 需要保存的数据

- `session_id`
- `visitor_id`
- `question`
- `answer`
- `timestamp`
- `source_page`

## 6. 访问追踪系统规划

## 目标

知道“谁来了、从哪来、看了什么、停了多久、点了什么”，但尽量避免采集过度敏感信息。

## 要追踪的数据

### 访客维度

- `visitor_id`（前端生成匿名 ID）
- 首次访问时间
- 最近访问时间
- 访问次数
- 来源渠道
- 设备类型
- 浏览器
- 操作系统
- 国家/地区（可选）

### 会话维度

- `session_id`
- 进入页面
- 退出页面
- 会话开始/结束时间
- 停留时长

### 行为维度

- 页面浏览 `page_view`
- 按钮点击 `click`
- 表单提交 `form_submit`
- Chat Bot 打开 `chat_open`
- Chat Bot 发送消息 `chat_message`
- 项目详情点击 `project_click`

## 推荐追踪方式

前端埋点：

- 首次进入页面时发送 `page_view`
- 关键按钮点击时发送 `event`
- Chat Bot 行为单独记录

后端处理：

- 接收埋点
- 规范化数据
- 存数据库
- 提供统计接口

## 建议接口

- `POST /api/track/page-view`
- `POST /api/track/event`
- `POST /api/track/session/start`
- `POST /api/track/session/end`
- `GET /api/admin/analytics/overview`

## 7. 数据库设计草案

### visitors

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| visitor_id | varchar | 匿名访客 ID |
| first_seen_at | timestamp | 首次访问 |
| last_seen_at | timestamp | 最近访问 |
| visit_count | int | 访问次数 |
| referrer | varchar | 来源 |
| device_type | varchar | 设备 |
| browser | varchar | 浏览器 |
| os | varchar | 系统 |
| country | varchar | 国家/地区 |

### sessions

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| session_id | varchar | 会话 ID |
| visitor_id | varchar | 关联访客 |
| started_at | timestamp | 开始时间 |
| ended_at | timestamp | 结束时间 |
| landing_page | varchar | 入口页 |
| exit_page | varchar | 离开页 |
| duration_seconds | int | 停留时长 |

### page_views

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| session_id | varchar | 会话 ID |
| visitor_id | varchar | 访客 ID |
| path | varchar | 页面路径 |
| title | varchar | 页面标题 |
| viewed_at | timestamp | 浏览时间 |
| referrer | varchar | 页面来源 |

### events

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| session_id | varchar | 会话 ID |
| visitor_id | varchar | 访客 ID |
| event_name | varchar | 事件名 |
| page_path | varchar | 发生页面 |
| metadata | jsonb | 扩展信息 |
| created_at | timestamp | 时间 |

### chat_messages

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| session_id | varchar | 会话 ID |
| visitor_id | varchar | 访客 ID |
| role | varchar | user / assistant |
| message | text | 内容 |
| source_page | varchar | 来源页面 |
| created_at | timestamp | 时间 |

## 8. 管理端数据看板

MVP 后台先不追求复杂，先做一个简单分析页即可。

### 需要看到的数据

- 今日/近 7 天/近 30 天访问量
- 独立访客数
- 热门页面
- 来源渠道统计
- 设备分布
- Chat Bot 使用次数
- 最常见提问
- 联系表单提交数

## 9. 隐私与合规建议

这个部分非常重要，建议一开始就处理好。

- 默认使用匿名 `visitor_id`
- 不直接存原始 IP，必要时只存哈希或做脱敏
- 明确提示网站会进行基础访问统计
- 如果后续使用 cookies 做更精细分析，补一个隐私说明页
- 不记录敏感输入内容，尤其是用户可能在 Chat Bot 里输入的私人信息

## 10. 分阶段开发计划

## Phase 1：项目初始化

目标：把基础工程跑起来

- 初始化前端项目
- 初始化后端项目
- 连接数据库
- 配置环境变量
- 搭建基础页面路由
- 配置部署方案

交付：

- 前后端都能本地启动
- 首页可访问
- 数据库连通

## Phase 2：网站内容搭建

目标：先把内容展示做好

- 首页设计与文案
- About 页面
- Projects 页面
- Contact 页面
- 响应式适配
- SEO 基础配置

交付：

- 一套可访问的个人网站静态内容

## Phase 3：访问追踪系统

目标：实现行为统计闭环

- 生成匿名访客 ID
- 建立 session 机制
- 页面浏览埋点
- 按钮点击埋点
- 后端入库
- 数据统计接口

交付：

- 可以看到访问量、来源、页面热度

## Phase 4：Chat Bot

目标：让用户能通过聊天了解你

- 聊天 UI
- 后端对话接口
- 知识库整理
- 常见问题预设
- 对话日志保存
- 基础限流与错误处理

交付：

- 访问者可以和网站进行有效问答

## Phase 5：后台分析页

目标：把数据可视化

- 访问概览页
- 热门页面排行
- 事件统计图
- Chat Bot 数据统计

交付：

- 你可以从后台直接看网站效果

## 11. MVP 验收标准

做到下面这些，就算第一版成功：

- 网站可以正常访问
- 手机和桌面端都能正常浏览
- Chat Bot 可以回答你的基本信息和项目问题
- 每个页面访问都能被记录
- 关键点击行为能被记录
- 后台可以查看基础访问数据

## 12. 后续增强方向

- 博客系统
- 多语言支持
- 简历在线预览与下载
- 邮件订阅
- 更强的 RAG 知识库
- 管理后台登录权限
- 热力图分析
- A/B 测试

## 13. 建议的开发顺序

建议按这个顺序做，效率最高：

1. 先把网站页面骨架搭好
2. 再接数据库和访问追踪
3. 然后接入 Chat Bot
4. 最后做后台数据看板和细节优化

## 14. 我建议的最终版本形态

一个更完整的版本会像这样：

- 一个设计清晰的个人品牌网站
- 一个能回答“你是谁、做过什么、如何合作”的 AI Chat Bot
- 一个能记录访问行为和互动数据的后端
- 一个能看访问趋势和用户兴趣点的后台面板

---

如果接下来要正式开工，下一步建议直接拆成：

1. 项目脚手架搭建
2. 页面结构搭建
3. 埋点系统开发
4. Chat Bot 接入
5. 后台统计页开发
