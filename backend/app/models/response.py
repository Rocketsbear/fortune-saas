"""
响应模型 - 命理咨询服务
"""
from pydantic import BaseModel, Field
from typing import Optional, Any, Dict


class FortuneResponse(BaseModel):
    """命理咨询响应"""
    
    success: bool = Field(..., description="请求是否成功")
    data: Optional[Dict[str, Any]] = Field(default=None, description="命理数据")
    report: Optional[str] = Field(default=None, description="生成的报告内容")
    message: str = Field(default="", description="响应消息")
    request_id: Optional[str] = Field(default=None, description="请求 ID")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "date": "1989-10-17",
                    "time": "12:00",
                    "gender": "male",
                    "template": "pro"
                },
                "report": "# 命理融合咨询报告\n\n## 紫微核心\n\n...",
                "message": "报告生成成功",
                "request_id": "req_abc123"
            }
        }


class ErrorResponse(BaseModel):
    """错误响应"""
    
    success: bool = Field(default=False)
    error: str = Field(..., description="错误信息")
    detail: Optional[str] = Field(default=None, description="详细错误信息")


class HealthResponse(BaseModel):
    """健康检查响应"""
    
    status: str = Field(..., description="服务状态")
    version: str = Field(..., description="API 版本")
    uptime: float = Field(..., description="运行时间(秒)")
