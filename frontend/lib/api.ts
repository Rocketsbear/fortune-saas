const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function generateFortuneReport(data: any) {
  const response = await fetch(`${API_BASE_URL}/fortune`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "生成报告失败");
  }

  return response.json();
}

export async function getTemplates() {
  const response = await fetch(`${API_BASE_URL}/fortune/templates`);
  if (!response.ok) {
    throw new Error("获取模板失败");
  }
  return response.json();
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error("服务不可用");
  }
  return response.json();
}
