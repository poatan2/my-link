"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { collection, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { LinkItem } from "@/data/links";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as PhosphorIcons from "@phosphor-icons/react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    },
    enabled: !!user,
  });

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

  const activeLinksCount = useMemo(() => {
    return links.filter(link => link.isVisible).length;
  }, [links]);

  const mostPopularLink = useMemo(() => {
    if (links.length === 0) return null;
    const sorted = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    return sorted[0].clicks && sorted[0].clicks > 0 ? sorted[0] : null;
  }, [links]);

  const chartData = useMemo(() => {
    return links.map(link => ({
      title: link.title || "제목 없음",
      clicks: link.clicks || 0,
      fill: "#18181b", // zinc-900 
    }));
  }, [links]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleCopyProfileLink = () => {
    const displayName = userProfile?.displayName;
    if (!user || !displayName) return;
    const profileUrl = `${window.location.origin}/${displayName}`;
    navigator.clipboard.writeText(profileUrl)
      .then(() => toast.success("프로필 링크가 복사되었습니다!"))
      .catch((err) => console.error("Failed to copy link: ", err));
  };

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

  const displayName = userProfile?.displayName || user.email?.split('@')[0] || user.displayName || "사용자";
  const username = userProfile?.username || user.displayName || "사용자";

  return (
    <main className="flex min-h-svh flex-col items-center p-6 bg-zinc-50 text-zinc-900 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-200/50 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-zinc-200/50 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/4 pointer-events-none mix-blend-multiply"></div>

      <div className="w-full max-w-5xl flex justify-between items-center mb-10 z-20 relative pt-4 px-2">
        <Link href="/" className="text-2xl font-black tracking-tighter text-zinc-900 hover:opacity-80 transition-opacity">
          MyLink
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/${displayName}`} target="_blank">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 border-zinc-200 hover:bg-zinc-100 text-zinc-700 h-9 px-3 text-xs font-semibold rounded-full shadow-sm">
              <PhosphorIcons.Eye className="h-4 w-4" />
              내 페이지 미리보기
            </Button>
            <Button variant="outline" size="icon" className="sm:hidden border-zinc-200 hover:bg-zinc-100 text-zinc-700 h-9 w-9 rounded-full shadow-sm">
              <PhosphorIcons.Eye className="h-4 w-4" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex items-center justify-center h-10 w-10 rounded-full bg-zinc-100 p-0 overflow-hidden border border-zinc-200 outline-none hover:bg-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-500 shadow-sm cursor-pointer">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <PhosphorIcons.User className="h-5 w-5 text-zinc-500" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-zinc-200 shadow-lg rounded-xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal py-3">
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-sm font-semibold leading-none text-zinc-900">{username}</p>
                    <p className="text-xs leading-none text-zinc-500">@{displayName}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-100" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer py-2 focus:bg-zinc-50" onClick={handleCopyProfileLink}>
                  <PhosphorIcons.Copy className="mr-2 h-4 w-4 text-zinc-500" />
                  <span>내 페이지 링크 복사</span>
                </DropdownMenuItem>
                <Link href={`/${displayName}`} target="_blank" className="w-full">
                  <DropdownMenuItem className="cursor-pointer py-2 focus:bg-zinc-50">
                    <PhosphorIcons.Link className="mr-2 h-4 w-4 text-zinc-500" />
                    <span>내 퍼블릭 프로필 보기</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/stats" className="w-full">
                  <DropdownMenuItem className="cursor-pointer py-2 focus:bg-zinc-50">
                    <PhosphorIcons.ChartBar className="mr-2 h-4 w-4 text-zinc-500" />
                    <span>방문자 통계</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-100" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer py-2 focus:bg-zinc-50" onClick={() => toast.info("준비 중인 기능입니다.")}>
                  <PhosphorIcons.PaintBrush className="mr-2 h-4 w-4 text-zinc-500" />
                  <span>디자인 및 테마 설정</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-2 focus:bg-zinc-50" onClick={() => toast.info("준비 중인 기능입니다.")}>
                  <PhosphorIcons.Gear className="mr-2 h-4 w-4 text-zinc-500" />
                  <span>계정 설정</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-100" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer py-2 focus:bg-zinc-50" onClick={() => toast.info("준비 중인 기능입니다.")}>
                  <PhosphorIcons.Question className="mr-2 h-4 w-4 text-zinc-500" />
                  <span>도움말 및 문의</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-100" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer py-2">
                <PhosphorIcons.SignOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-8 z-10">
        <div className="flex flex-col items-center justify-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="icon" className="border-zinc-200 hover:bg-zinc-100 text-zinc-700 h-10 w-10 rounded-full shadow-sm transition-transform hover:-translate-x-1">
                <PhosphorIcons.ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900">
              방문자 통계
            </h1>
          </div>
          <p className="text-zinc-500 font-medium">프로필 링크의 방문 및 클릭 현황을 분석합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {/* Total Clicks Card */}
          <Card className="border border-zinc-200/60 shadow-lg shadow-zinc-200/20 bg-white/80 backdrop-blur-xl overflow-hidden relative group transition-all hover:shadow-xl hover:border-zinc-300">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-zinc-100 rounded-full blur-2xl opacity-50 group-hover:bg-zinc-200 transition-colors"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-500 font-medium text-sm flex items-center gap-2">
                <div className="p-1.5 bg-zinc-100 rounded-md text-zinc-700">
                  <PhosphorIcons.CursorClick className="w-4 h-4" />
                </div>
                총 클릭 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLinksLoading ? (
                <div className="h-10 flex items-center">
                  <div className="w-24 h-8 bg-zinc-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="flex items-end gap-1.5 mt-2">
                  <span className="text-4xl font-black tracking-tighter text-zinc-900">
                    {totalClicks.toLocaleString()}
                  </span>
                  <span className="text-zinc-500 font-semibold mb-1">회</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Links Card */}
          <Card className="border border-zinc-200/60 shadow-lg shadow-zinc-200/20 bg-white/80 backdrop-blur-xl overflow-hidden relative group transition-all hover:shadow-xl hover:border-zinc-300">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-zinc-100 rounded-full blur-2xl opacity-50 group-hover:bg-zinc-200 transition-colors"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-500 font-medium text-sm flex items-center gap-2">
                <div className="p-1.5 bg-zinc-100 rounded-md text-zinc-700">
                  <PhosphorIcons.Link className="w-4 h-4" />
                </div>
                활성 링크 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLinksLoading ? (
                <div className="h-10 flex items-center">
                  <div className="w-24 h-8 bg-zinc-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="flex items-end gap-1.5 mt-2">
                  <span className="text-4xl font-black tracking-tighter text-zinc-900">
                    {activeLinksCount.toLocaleString()}
                  </span>
                  <span className="text-zinc-500 font-semibold mb-1">개</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Most Popular Link Card */}
          <Card className="border border-zinc-200/60 shadow-lg shadow-zinc-200/20 bg-white/80 backdrop-blur-xl overflow-hidden relative group transition-all hover:shadow-xl hover:border-zinc-300">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-zinc-100 rounded-full blur-2xl opacity-50 group-hover:bg-zinc-200 transition-colors"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-500 font-medium text-sm flex items-center gap-2">
                <div className="p-1.5 bg-zinc-100 rounded-md text-zinc-700">
                  <PhosphorIcons.Fire className="w-4 h-4" />
                </div>
                최고 인기 링크
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLinksLoading ? (
                <div className="h-10 flex items-center mt-2">
                  <div className="w-full h-6 bg-zinc-200 rounded animate-pulse"></div>
                </div>
              ) : mostPopularLink ? (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-xl font-bold tracking-tight text-zinc-900 truncate" title={mostPopularLink.title}>
                    {mostPopularLink.title}
                  </span>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-sm font-medium">
                    <PhosphorIcons.CursorClick className="w-3.5 h-3.5" />
                    {mostPopularLink.clicks?.toLocaleString() || 0}회 클릭됨
                  </div>
                </div>
              ) : (
                <div className="flex items-center h-10 mt-1">
                  <span className="text-zinc-400 font-medium text-sm">클릭 데이터 없음</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chart Card */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
          <Card className="border border-zinc-200/60 shadow-lg shadow-zinc-200/20 bg-white/80 backdrop-blur-xl group transition-all hover:shadow-xl hover:border-zinc-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 bg-zinc-100 rounded-md text-zinc-700">
                  <PhosphorIcons.ChartBar className="w-5 h-5" />
                </div>
                링크별 클릭 현황
              </CardTitle>
              <CardDescription>
                등록된 각 링크의 개별 클릭 횟수를 보여줍니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLinksLoading ? (
                <div className="h-[250px] w-full flex items-center justify-center">
                  <PhosphorIcons.Spinner className="w-8 h-8 text-zinc-300 animate-spin" />
                </div>
              ) : links.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[250px] border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 text-zinc-500 text-center space-y-3">
                  <div className="p-3 bg-white rounded-full shadow-sm border border-zinc-100">
                    <PhosphorIcons.LinkBreak className="w-8 h-8 text-zinc-300" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-700 text-lg">등록된 링크가 없습니다</p>
                    <p className="text-sm font-medium mt-1">대시보드에서 링크를 추가해보세요.</p>
                  </div>
                </div>
              ) : chartData.every(d => d.clicks === 0) ? (
                <div className="flex flex-col items-center justify-center h-[250px] border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 text-zinc-500 text-center space-y-3">
                  <div className="p-3 bg-white rounded-full shadow-sm border border-zinc-100">
                    <PhosphorIcons.ChartBar className="w-8 h-8 text-zinc-300" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-700 text-lg">아직 클릭 데이터가 없습니다</p>
                    <p className="text-sm font-medium mt-1">프로필을 공유하여 방문자를 늘려보세요.</p>
                  </div>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                  <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e4e4e7" opacity={0.5} />
                    <XAxis
                      dataKey="title"
                      tickLine={false}
                      tickMargin={12}
                      axisLine={false}
                      tickFormatter={(value) => value.length > 8 ? value.substring(0, 8) + '...' : value}
                      style={{ fontSize: '12px', fill: '#71717a', fontWeight: 500 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      style={{ fontSize: '12px', fill: '#71717a', fontWeight: 500 }}
                      allowDecimals={false}
                    />
                    <ChartTooltip
                      cursor={{ fill: '#f4f4f5', opacity: 0.8 }}
                      content={<ChartTooltipContent hideLabel className="shadow-lg border-zinc-200 rounded-xl" />}
                    />
                    <Bar
                      dataKey="clicks"
                      radius={[6, 6, 0, 0]}
                      fill="#18181b"
                      animationDuration={1500}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
