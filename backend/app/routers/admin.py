"""
管理员 API 路由
"""
import logging
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

# 模拟数据库（生产环境请用 PostgreSQL）
REPORT_DB = []


class ReportRecord(BaseModel):
    """报告记录"""
    id: str
    request_id: str
    date: str
    time: str
    gender: str
    template: str
    created_at: str
    report_length: int


class AdminStats(BaseModel):
    """管理员统计数据"""
    total_reports: int
    reports_today: int
    reports_this_week: int
    template_usage: dict


def verify_admin_key(x_admin_key: Optional[str] = Header(None)) -> bool:
    """验证管理员密钥"""
    if not x_admin_key:
        return False
    return x_admin_key == settings.API_KEY


@router.get("/admin/stats", response_model=AdminStats)
async def get_stats(admin_key: Optional[str] = Header(None)):
    """获取统计数据"""
    if not verify_admin_key(admin_key):
        raise HTTPException(status_code=401, detail="未授权")
    
    now = datetime.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = now - timedelta(days=7)
    
    total = len(REPORT_DB)
    today = sum(1 for r in REPORT_DB if datetime.fromisoformat(r["created_at"]) >= today_start)
    this_week = sum(1 for r in REPORT_DB if datetime.fromisoformat(r["created_at"]) >= week_start)
    
    # 模板使用统计
    template_usage = {}
    for r in REPORT_DB:
        t = r.get("template", "unknown")
        template_usage[t] = template_usage.get(t, 0) + 1
    
    return AdminStats(
        total_reports=total,
        reports_today=today,
        reports_this_week=this_week,
        template_usage=template_usage,
    )


@router.get("/admin/reports", response_model=list[ReportRecord])
async def get_reports(
    limit: int = 50,
    offset: int = 0,
    admin_key: Optional[str] = Header(None)
):
    """获取报告列表"""
    if not verify_admin_key(admin_key):
        raise HTTPException(status_code=401, detail="未授权")
    
    reports = REPORT_DB[offset:offset+limit]
    return [
        ReportRecord(
            id=r["id"],
            request_id=r["request_id"],
            date=r["date"],
            time=r["time"],
            gender=r["gender"],
            template=r["template"],
            created_at=r["created_at"],
            report_length=r["report_length"],
        )
        for r in reports
    ]


@router.post("/admin/reports")
async def create_report_record(
    request_id: str,
    date: str,
    time: str,
    gender: str,
    template: str,
    report_length: int,
):
    """记录报告（由 fortune 服务调用）"""
    record = {
        "id": f"rpt_{len(REPORT_DB) + 1}",
        "request_id": request_id,
        "date": date,
        "time": time,
        "gender": gender,
        "template": template,
        "created_at": datetime.now().isoformat(),
        "report_length": report_length,
    }
    REPORT_DB.append(record)
    logger.info(f"📝 报告记录已保存: {request_id}")
    return {"success": True}
