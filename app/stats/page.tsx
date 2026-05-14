"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { LinkItem } from "@/data/links";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as PhosphorIcons from "@phosphor-icons/react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  clicks: {
    label: "클릭 수",
    color: "#18181b", // zinc-900 fallback color
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const { data: links = [], isLoading: isLinksLoading } = useQuery({
    queryKey: ['links', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const q = query(collection(db, `users/${user.uid}/links`), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LinkItem));
    },
    enabled: !!user,
  });

  const totalClicks = useMemo(() => {
    return links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  }, [links]);

  const chartData = useMemo(() => {
    return links.map(link => ({
      title: link.title || "제목 없음",
      clicks: link.clicks || 0,
      fill: "#18181b", // zinc-900 
    }));
  }, [links]);

  if (authLoading) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center bg-zinc-50">
        <PhosphorIcons.Spinner className="w-8 h-8 text-zinc-300 animate-spin" />
      </main>
    );
  }

  if (!user) {
    return null; // will be redirected
  }

  return (
    <main className="flex min-h-svh flex-col items-center p-6 bg-zinc-50 text-zinc-900 overflow-hidden">
      <div className="w-full max-w-3xl flex items-center justify-between mb-8 z-20 relative pt-4 px-2">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon" className="border-zinc-200 hover:bg-zinc-100 text-zinc-700 h-10 w-10 rounded-full shadow-sm">
              <PhosphorIcons.ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-black tracking-tighter text-zinc-900">
            방문자 통계
          </h1>
        </div>
      </div>

      <div className="w-full max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Total Clicks Card */}
        <Card className="border-zinc-200 shadow-sm bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-500 font-medium text-sm flex items-center gap-2">
              <PhosphorIcons.CursorClick className="w-4 h-4" />
              총 클릭 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLinksLoading ? (
              <div className="h-14 flex items-center">
                <div className="w-24 h-10 bg-zinc-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black tracking-tighter text-zinc-900">
                  {totalClicks.toLocaleString()}
                </span>
                <span className="text-zinc-500 font-medium mb-1">회</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart Card */}
        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PhosphorIcons.ChartBar className="w-5 h-5" />
              링크별 클릭 통계
            </CardTitle>
            <CardDescription>
              각 링크의 클릭 횟수를 보여줍니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLinksLoading ? (
              <div className="h-[300px] w-full flex items-center justify-center">
                <PhosphorIcons.Spinner className="w-8 h-8 text-zinc-300 animate-spin" />
              </div>
            ) : links.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 text-zinc-500 text-center space-y-2">
                <PhosphorIcons.LinkBreak className="w-10 h-10 text-zinc-300 mb-2" />
                <p className="font-semibold text-zinc-700">등록된 링크가 없습니다</p>
                <p className="text-sm font-medium">대시보드에서 링크를 추가해보세요.</p>
              </div>
            ) : chartData.every(d => d.clicks === 0) ? (
              <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 text-zinc-500 text-center space-y-2">
                <PhosphorIcons.ChartBar className="w-10 h-10 text-zinc-300 mb-2" />
                <p className="font-semibold text-zinc-700">아직 클릭 데이터가 없습니다</p>
                <p className="text-sm font-medium">프로필을 공유하여 방문자를 늘려보세요.</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis 
                    dataKey="title" 
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.length > 8 ? value.substring(0, 8) + '...' : value}
                    style={{ fontSize: '12px', fill: '#71717a' }}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    style={{ fontSize: '12px', fill: '#71717a' }}
                    allowDecimals={false}
                  />
                  <ChartTooltip 
                    cursor={{ fill: '#f4f4f5' }}
                    content={<ChartTooltipContent hideLabel />} 
                  />
                  <Bar 
                    dataKey="clicks" 
                    radius={[4, 4, 0, 0]} 
                    fill="#18181b"
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
