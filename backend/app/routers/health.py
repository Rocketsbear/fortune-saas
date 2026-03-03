"""
健康检查 API
"""
import time
import logging
from fastapi import APIRouter
from app.models.response import HealthResponse

logger = logging.getLogger(__name__)
router = APIRouter()

# 应用启动时间
START_TIME = time.time()


@router.get("/health", response_model=HealthResponse, summary="健康检查")
async def health_check():
    """检查服务健康状态"""
    uptime = time.time() - START_TIME
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        uptime=uptime,
    )


@router.get("/ready", summary="就绪检查")
async def readiness_check():
    """检查服务是否就绪"""
    return {"ready": True}
