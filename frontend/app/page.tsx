"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateFortuneReport } from "@/lib/api";
import type { FortuneRequest, FortuneResponse } from "@/types";

const formSchema = z.object({
  date: z.string().min(1, "请选择出生日期").regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式：YYYY-MM-DD"),
  time: z.string().min(1, "请选择出生时间").regex(/^\d{2}:\d{2}$/, "时间格式：HH:MM"),
  gender: z.enum(["male", "female"], { required_error: "请选择性别" }),
  longitude: z.string().optional(),
  year: z.string().optional(),
  template: z.enum(["lite", "pro", "executive"]).default("pro"),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      time: "",
      gender: undefined,
      longitude: "117.9",
      year: "2026",
      template: "pro",
    },
  });

  const template = watch("template");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError("");

    try {
      const payload: FortuneRequest = {
        date: data.date,
        time: data.time,
        gender: data.gender,
        longitude: data.longitude ? parseFloat(data.longitude) : 117.9,
        year: data.year ? parseInt(data.year) : 2026,
        from_year: data.year ? parseInt(data.year) : 2026,
        years: 10,
        template: data.template,
        format: "markdown",
      };

      const response: FortuneResponse = await generateFortuneReport(payload);

      if (response.success && response.report) {
        // 保存报告到 sessionStorage
        sessionStorage.setItem("fortuneReport", response.report);
        sessionStorage.setItem("fortuneData", JSON.stringify(response.data));
        router.push("/report");
      } else {
        setError(response.message || "生成报告失败，请重试");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成报告失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            命理融合咨询 Pro
          </h1>
          <p className="text-muted-foreground mt-2">
            紫微斗数 + 八字融合分析
          </p>
        </div>

        {/* Form Card */}
        <Card className="backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle>生成您的命理报告</CardTitle>
            <CardDescription>
              填写以下信息，获取专业的命理分析报告
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 出生日期 */}
              <div className="space-y-2">
                <Label htmlFor="date">出生日期</Label>
                <Input
                  id="date"
                  type="date"
                  placeholder="1989-10-17"
                  {...register("date")}
                  max="2010-12-31"
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              {/* 出生时间 */}
              <div className="space-y-2">
                <Label htmlFor="time">出生时间</Label>
                <Input
                  id="time"
                  type="time"
                  {...register("time")}
                />
                {errors.time && (
                  <p className="text-sm text-destructive">{errors.time.message}</p>
                )}
              </div>

              {/* 性别 */}
              <div className="space-y-2">
                <Label>性别</Label>
                <Select
                  value={watch("gender")}
                  onValueChange={(value) => setValue("gender", value as "male" | "female")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender.message}</p>
                )}
              </div>

              {/* 模板选择 */}
              <div className="space-y-2">
                <Label>报告模板</Label>
                <Select
                  value={template}
                  onValueChange={(value) => setValue("template", value as "lite" | "pro" | "executive")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择模板" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lite">
                      <div className="flex flex-col">
                        <span>轻量版</span>
                        <span className="text-xs text-muted-foreground">短摘要，适合社交媒体</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pro">
                      <div className="flex flex-col">
                        <span>专业版</span>
                        <span className="text-xs text-muted-foreground">标准命理咨询报告</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="executive">
                      <div className="flex flex-col">
                        <span>高管版</span>
                        <span className="text-xs text-muted-foreground">高净值客户专属话术</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 经度 */}
              <div className="space-y-2">
                <Label htmlFor="longitude">出生地经度 (可选)</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.1"
                  placeholder="117.9 (北京)"
                  {...register("longitude")}
                />
                <p className="text-xs text-muted-foreground">
                  默认：北京 117.9，其他城市请查询当地经度
                </p>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* 提交按钮 */}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    正在生成报告...
                  </>
                ) : (
                  <>
                    开始分析
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          本报告仅供娱乐参考，不构成任何投资或决策建议
        </p>
      </div>
    </main>
  );
}
