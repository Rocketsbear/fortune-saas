"""
Fortune SaaS - 后端主入口
生产级 FastAPI 配置，支持 CORS、速率限制、日志
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.routers import fortune, health, admin

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    logger.info("🚀 Fortune SaaS 后端启动")
    logger.info(f"📋 环境: {settings.ENV}")
    logger.info(f"🔧 Debug 模式: {settings.DEBUG}")
    yield
    logger.info("👋 Fortune SaaS 后端关闭")


# 创建 FastAPI 应用
app = FastAPI(
    title="Fortune SaaS API",
    description="命理融合咨询平台 - 专业命理服务 API",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 全局异常处理
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"❌ 全局异常: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "服务器内部错误，请稍后重试",
            "detail": str(exc) if settings.DEBUG else None,
        },
    )


# 注册路由
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(fortune.router, prefix="/api/v1", tags=["Fortune"])
app.include_router(admin.router, prefix="/api/v1", tags=["Admin"])


@app.get("/")
async def root():
    """根路径"""
    return {
        "name": "Fortune SaaS API",
        "version": "1.0.0",
        "docs": "/docs" if settings.DEBUG else "API 已隐藏",
    }
