"""
请求模型 - 命理咨询服务
"""
from pydantic import BaseModel, Field, field_validator
from typing import Literal


class FortuneRequest(BaseModel):
    """命理咨询请求"""
    
    # 必需字段
    date: str = Field(..., description="出生日期 YYYY-MM-DD", examples=["1989-10-17"])
    time: str = Field(..., description="出生时间 HH:MM", examples=["12:00"])
    gender: Literal["male", "female"] = Field(..., description="性别")
    
    # 可选字段
    longitude: float = Field(default=117.9, description="经度 (默认: 117.9 北京)")
    year: int = Field(default=2026, description="流年年份")
    from_year: int = Field(default=2026, description="起始年份")
    years: int = Field(default=10, description="分析年数", ge=1, le=30)
    template: Literal["lite", "pro", "executive"] = Field(
        default="pro", 
        description="报告模板: lite=短摘要, pro=标准版, executive=高净值客户"
    )
    format: Literal["markdown", "json"] = Field(
        default="markdown",
        description="输出格式"
    )
    
    @field_validator("date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        """验证日期格式"""
        import re
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", v):
            raise ValueError("日期格式应为 YYYY-MM-DD")
        return v
    
    @field_validator("time")
    @classmethod
    def validate_time(cls, v: str) -> str:
        """验证时间格式"""
        import re
        if not re.match(r"^\d{2}:\d{2}$", v):
            raise ValueError("时间格式应为 HH:MM")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "date": "1989-10-17",
                "time": "12:00",
                "gender": "male",
                "longitude": 117.9,
                "year": 2026,
                "from_year": 2026,
                "years": 10,
                "template": "pro",
                "format": "markdown"
            }
        }
