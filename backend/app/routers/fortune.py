"""
命理咨询 API 路由
"""
import logging
from fastapi import APIRouter, HTTPException, status
from app.models.request import FortuneRequest
from app.models.response import FortuneResponse, ErrorResponse
from app.services.fortune_service import fortune_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/fortune",
    response_model=FortuneResponse,
    summary="生成命理报告",
    description="""
    根据用户提供的出生信息，生成综合命理报告。
    
    支持三种模板:
    - **lite**: 短摘要，适合社交媒体
    - **pro**: 标准咨询版，推荐
    - **executive**: 高净值客户话术
    """,
    responses={
        200: {"model": FortuneResponse, "description": "成功"},
        400: {"model": ErrorResponse, "description": "请求参数错误"},
        500: {"model": ErrorResponse, "description": "服务器错误"},
    },
)
async def generate_fortune_report(request: FortuneRequest):
    """
    生成命理融合咨询报告
    
    - **date**: 出生日期 (YYYY-MM-DD)
    - **time**: 出生时间 (HH:MM)
    - **gender**: 性别 (male/female)
    - **longitude**: 经度 (默认 117.9 北京)
    - **year**: 流年年份 (默认 2026)
    - **from_year**: 起始年份 (默认 2026)
    - **years**: 分析年数 (默认 10)
    - **template**: 模板类型 (lite/pro/executive)
    - **format**: 输出格式 (markdown/json)
    """
    logger.info(f"📥 收到命理咨询请求: {request.model_dump()}")
    
    # 调用服务生成报告
    result = fortune_service.generate_report(request.model_dump())
    
    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.get("error", "生成失败"),
        )
    
    return FortuneResponse(
        success=True,
        data={
            "date": request.date,
            "time": request.time,
            "gender": request.gender,
            "template": request.template,
        },
        report=result.get("report", ""),
        message="命理报告生成成功",
        request_id=result.get("request_id"),
    )


@router.get(
    "/fortune/templates",
    summary="获取可用模板",
)
async def get_templates():
    """获取可用的报告模板"""
    return {
        "templates": [
            {
                "id": "lite",
                "name": "轻量版",
                "description": "短摘要，适合社交媒体分享",
            },
            {
                "id": "pro",
                "name": "专业版",
                "description": "标准命理咨询报告",
            },
            {
                "id": "executive",
                "name": "高管版",
                "description": "高净值客户专属话术",
            },
        ]
    }
