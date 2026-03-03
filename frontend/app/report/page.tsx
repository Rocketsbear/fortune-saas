"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Share2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState("");
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("report");

  useEffect(() => {
    const savedReport = sessionStorage.getItem("fortuneReport");
    const savedData = sessionStorage.getItem("fortuneData");

    if (!savedReport) {
      router.push("/");
      return;
    }

    setReport(savedReport);
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, [router]);

  // 解析报告内容，分割成不同部分
  const parseReport = (content: string) => {
    const sections: Record<string, string> = {};
    let currentSection = "";
    let currentKey = "";

    const lines = content.split("\n");
    for (const line of lines) {
      // 检测章节标题
      if (line.startsWith("## ") || line.startsWith("### ")) {
        if (currentKey) {
          sections[currentKey] = currentSection.trim();
        }
        currentKey = line.replace(/^##+ /, "").trim();
        currentSection = line + "\n";
      } else {
        currentSection += line + "\n";
      }
    }
    if (currentKey) {
      sections[currentKey] = currentSection.trim();
    }

    return sections;
  };

  const sections = parseReport(report);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "我的命理分析报告",
          text: `出生日期: ${data?.date} ${data?.time}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  const handleNewReport = () => {
    sessionStorage.removeItem("fortuneReport");
    sessionStorage.removeItem("fortuneData");
    router.push("/");
  };

  if (!report) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={handleNewReport}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            新建报告
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              分享
            </Button>
            <Button variant="outline" size="sm" onClick={handleNewReport}>
              <RefreshCw className="mr-2 h-4 w-4" />
              重新分析
            </Button>
          </div>
        </div>

        {/* Title Card */}
        <Card className="mb-6 backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">命理融合咨询报告</CardTitle>
            <div className="text-muted-foreground mt-2">
              {data?.date} {data?.time} · {data?.gender === "male" ? "男" : "女"} · {data?.template === "pro" ? "专业版" : data?.template === "executive" ? "高管版" : "轻量版"}
            </div>
          </CardHeader>
        </Card>

        {/* Report Content */}
        <Card className="backdrop-blur-sm bg-card/80">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-4">
              <TabsTrigger
                value="report"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                完整报告
              </TabsTrigger>
              <TabsTrigger
                value="ziwei"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                紫微斗数
              </TabsTrigger>
              <TabsTrigger
                value="bazi"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                八字
              </TabsTrigger>
              <TabsTrigger
                value="advice"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                咨询建议
              </TabsTrigger>
            </TabsList>

            <CardContent className="pt-6">
              {/* 完整报告 */}
              <TabsContent value="report" className="mt-0">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{report}</ReactMarkdown>
                </div>
              </TabsContent>

              {/* 紫微斗数 */}
              <TabsContent value="ziwei" className="mt-0">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>
                    {sections["A) 紫微斗数核心"] || sections["紫微核心"] || sections["紫微斗数"] || "## 紫微斗数\n" + (sections["A) 紫微斗数核心"] || "暂无紫微斗数数据")}
                  </ReactMarkdown>
                </div>
              </TabsContent>

              {/* 八字 */}
              <TabsContent value="bazi" className="mt-0">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>
                    {sections["B) 八字核心"] || sections["八字核心"] || sections["八字"] || "## 八字\n" + (sections["B) 八字核心"] || "暂无八字数据")}
                  </ReactMarkdown>
                </div>
              </TabsContent>

              {/* 咨询建议 */}
              <TabsContent value="advice" className="mt-0">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>
                    {sections["C) 运势结论"] || sections["D) 事业发展建议"] || sections["咨询交付"] || sections["事业"] || "## 咨询建议\n" + (sections["C) 运势结论"] || "暂无咨询建议数据")}
                  </ReactMarkdown>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          本报告仅供娱乐参考，不构成任何投资或决策建议
        </p>
      </div>
    </main>
  );
}
