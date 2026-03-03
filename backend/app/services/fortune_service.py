"""
命理服务 - 调用 fortune_fusion.py
"""
import subprocess
import json
import logging
import os
import uuid
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger(__name__)


class FortuneService:
    """命理服务类"""
    
    def __init__(self):
        # 获取项目根目录
        self.base_path = Path(__file__).parent.parent.parent
        self.skill_path = self.base_path / "skills" / "destiny-fusion-pro"
        self.script_path = self.skill_path / "scripts" / "fortune_fusion.py"
        
        # 检查脚本是否存在
        if not self.script_path.exists():
            logger.warning(f"⚠️ 脚本不存在: {self.script_path}")
            # 尝试备用路径
            alt_path = self.base_path.parent / "skills" / "destiny-fusion-pro" / "scripts" / "fortune_fusion.py"
            if alt_path.exists():
                self.script_path = alt_path
                logger.info(f"✅ 使用备用路径: {self.script_path}")
    
    def generate_report(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        生成命理报告
        
        Args:
            params: 请求参数字典
            
        Returns:
            包含 report 和 metadata 的字典
        """
        request_id = f"req_{uuid.uuid4().hex[:12]}"
        
        # 构建命令
        cmd = [
            "python",
            str(self.script_path),
            "--date", params.get("date", "1989-10-17"),
            "--time", params.get("time", "12:00"),
            "--gender", params.get("gender", "male"),
            "--longitude", str(params.get("longitude", 117.9)),
            "--year", str(params.get("year", 2026)),
            "--from-year", str(params.get("from_year", 2026)),
            "--years", str(params.get("years", 10)),
            "--template", params.get("template", "pro"),
            "--format", params.get("format", "markdown"),
        ]
        
        logger.info(f"🔮 [{request_id}] 生成命理报告")
        logger.debug(f"📝 命令: {' '.join(cmd)}")
        
        try:
            # 执行脚本
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=120,  # 2分钟超时
                cwd=str(self.base_path),
            )
            
            if result.returncode != 0:
                logger.error(f"❌ [{request_id}] 脚本执行失败: {result.stderr}")
                return {
                    "success": False,
                    "error": f"命理计算失败: {result.stderr}",
                    "request_id": request_id,
                }
            
            report_content = result.stdout
            logger.info(f"✅ [{request_id}] 报告生成成功, 长度: {len(report_content)}")
            
            return {
                "success": True,
                "report": report_content,
                "metadata": {
                    "request_id": request_id,
                    "params": params,
                },
            }
            
        except subprocess.TimeoutExpired:
            logger.error(f"⏰ [{request_id}] 脚本执行超时")
            return {
                "success": False,
                "error": "命理计算超时，请稍后重试",
                "request_id": request_id,
            }
        except Exception as e:
            logger.exception(f"💥 [{request_id}] 未知错误: {e}")
            return {
                "success": False,
                "error": f"服务器错误: {str(e)}",
                "request_id": request_id,
            }


# 全局服务实例
fortune_service = FortuneService()
