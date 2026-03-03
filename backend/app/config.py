"""
配置管理 - 使用 Pydantic Settings
"""
import os
from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """应用配置"""
    
    # 环境
    ENV: str = "development"
    DEBUG: bool = True
    
    # 服务器
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # 命理技能路径
    FORTUNE_SKILL_PATH: str = "skills/destiny-fusion-pro"
    FORTUNE_SCRIPT: str = "scripts/fortune_fusion.py"
    
    # 日志
    LOG_LEVEL: str = "INFO"
    
    # API 密钥 (付费功能)
    API_KEY: str = "demo-key-change-in-production"
    
    # 速率限制
    RATE_LIMIT_PER_MINUTE: int = 10
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """获取配置单例"""
    return Settings()


settings = get_settings()
