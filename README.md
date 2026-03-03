# 命理融合咨询 SaaS 平台

> 专业命理咨询服务平台 - 紫微斗数 + 八字融合分析

## 技术栈

### 后端
- FastAPI (Python 3.11+)
- Pydantic v2
- Uvicorn
- Docker

### 前端
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v3
- shadcn/ui
- TanStack Query v5
- React Hook Form + Zod

## 快速开始

### 方式 1: Docker Compose (推荐)

```bash
# 克隆项目后
cd fortune-saaS

# 启动所有服务
docker-compose up -d

# 访问
# 前端: http://localhost:3000
# 后端 API: http://localhost:8000
# API 文档: http://localhost:8000/docs
```

### 方式 2: 本地开发

#### 后端
```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
pip install iztro-py lunar-python

# 启动
python -m uvicorn app.main:app --reload --app-dir .
```

#### 前端
```bash
cd frontend

# 安装依赖
npm install

# 或使用 pnpm
pnpm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

## API 使用

### 生成命理报告

```bash
curl -X POST http://localhost:8000/api/v1/fortune \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1989-10-17",
    "time": "12:00",
    "gender": "male",
    "template": "pro"
  }'
```

### 获取可用模板

```bash
curl http://localhost:8000/api/v1/fortune/templates
```

## 项目结构

```
fortune-saaS/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI 入口
│   │   ├── config.py          # 配置管理
│   │   ├── models/           # Pydantic 模型
│   │   ├── routers/          # API 路由
│   │   └── services/         # 业务逻辑
│   ├── skills/               # 命理技能
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # 首页表单
│   │   └── report/           # 报告页面
│   ├── components/          # UI 组件
│   ├── lib/                 # 工具函数
│   ├── types/               # TypeScript 类型
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 环境变量

### 后端 (.env)
```bash
ENV=development
DEBUG=true
PORT=8000
API_KEY=your-secret-key
```

### 前端 (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 功能特性

- ✅ 紫微斗数排盘
- ✅ 八字四柱分析
- ✅ 三种报告模板 (轻量/专业/高管)
- ✅ Markdown 报告渲染
- ✅ 深色主题 UI
- ✅ 响应式设计
- ✅ Docker 一键部署

## 部署

### 生产环境

```bash
# 构建 Docker 镜像
docker-compose build

# 启动生产服务
docker-compose -f docker-compose.yml up -d
```

### Vercel + Railway 部署

详见 [阶段 3 - 部署文档]()

## License

MIT
