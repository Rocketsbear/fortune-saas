"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Users, FileText, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Stats {
  total_reports: number;
  reports_today: number;
  reports_this_week: number;
  template_usage: Record<string, number>;
}

interface Report {
  id: string;
  request_id: string;
  date: string;
  time: string;
  gender: string;
  template: string;
  created_at: string;
  report_length: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState("");

  const fetchData = async () => {
    if (!adminKey) return;
    
    try {
      const [statsRes, reportsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
          headers: { "X-Admin-Key": adminKey },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports?limit=20`, {
          headers: { "X-Admin-Key": adminKey },
        }),
      ]);

      if (statsRes.ok && reportsRes.ok) {
        setStats(await statsRes.json());
        setReports(await reportsRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetchData();
    }
  }, [adminKey]);

  if (!adminKey) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>管理员登录</CardTitle>
              <CardDescription>请输入管理员密钥</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="password"
                placeholder="管理员密钥"
                className="w-full p-2 border rounded-md bg-background"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
              />
              <button
                onClick={fetchData}
                className="w-full mt-4 p-2 bg-primary text-primary-foreground rounded-md"
              >
                登录
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <BarChart3 className="w-8 h-8" />
          管理后台
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">总报告数</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_reports || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">今日</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.reports_today || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">本周</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.reports_this_week || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">用户</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_reports || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Template Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>模板使用统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {stats?.template_usage && Object.entries(stats.template_usage).map(([template, count]) => (
                <div key={template} className="flex-1 p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground capitalize">{template}</div>
                  <div className="text-2xl font-bold">{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>最近报告</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">日期</th>
                    <th className="text-left p-2">时间</th>
                    <th className="text-left p-2">性别</th>
                    <th className="text-left p-2">模板</th>
                    <th className="text-left p-2">创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b">
                      <td className="p-2">{report.date}</td>
                      <td className="p-2">{report.time}</td>
                      <td className="p-2">{report.gender === 'male' ? '男' : '女'}</td>
                      <td className="p-2 capitalize">{report.template}</td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {new Date(report.created_at).toLocaleString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
