"use client";

import { useState, useEffect } from "react";
import { LinkItem } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Zod Schema Definition
const linkSchema = z.object({
  title: z.string().min(1, { message: "링크 제목을 입력해주세요." }),
  url: z.string()
    .min(1, { message: "URL 주소를 입력해주세요." })
    .refine((val) => {
      // Validate string to be roughly a URL or localhost
      const urlTrimmed = val.trim();
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
      return urlPattern.test(urlTrimmed) || urlTrimmed.includes("localhost");
    }, { message: "올바른 URL 형식이 아닙니다." })
});

type LinkFormValues = z.infer<typeof linkSchema>;

export default function Home() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // React Hook Form implementation
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { title: "", url: "" },
  });

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "users/anonymous/links"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const fetchedLinks = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        } as LinkItem;
      });
      setLinks(fetchedLinks);
    } catch (error) {
      console.error("Error fetching links: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const visibleLinks = links.filter(link => link.isVisible);

  const onSubmit = async (data: LinkFormValues) => {
    setIsAdding(true);
    const urlTrimmed = data.url.trim();
    const formattedUrl = urlTrimmed.startsWith("http") ? urlTrimmed : `https://${urlTrimmed}`;

    try {
      const docRef = await addDoc(collection(db, "users/anonymous/links"), {
        title: data.title.trim(),
        url: formattedUrl,
        isVisible: true,
        order: links.length,
        animation: "none",
        icon: "Link",
        createdAt: serverTimestamp(),
      });

      const newLink: LinkItem = {
        id: docRef.id,
        title: data.title.trim(),
        url: formattedUrl,
        isVisible: true,
        order: links.length,
        animation: "none",
        icon: "Link",
      };

      setLinks([newLink, ...links]);
      form.reset();
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("링크 추가 중 오류가 발생했습니다.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <main className="flex min-h-svh flex-col items-center p-6 bg-zinc-50 text-zinc-900 overflow-hidden">
      <div className="w-full max-w-md space-y-10 mt-16 mb-24 relative z-10">
        <header className="text-center space-y-5">
          <div className="mx-auto w-24 h-24 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5 shadow-sm border border-zinc-200 transition-transform duration-500 hover:scale-105">
             <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center">
                 <PhosphorIcons.User className="w-10 h-10 text-zinc-400" weight="fill" />
             </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              태경 (TaeGyeong)
            </h1>
            <p className="text-sm font-medium text-zinc-500">
              크리에이터를 위한 프리미엄 마이링크
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger 
              render={<Button className="w-full mt-4 font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5" />}
            >
              <PhosphorIcons.Plus className="mr-2 h-4 w-4" weight="bold" />
              새로운 링크 추가하기
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-6 bg-white border-zinc-200">
              <DialogHeader>
                <DialogTitle className="text-zinc-900 text-xl font-bold tracking-tight">새 링크 추가</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                <div className="space-y-2.5">
                  <Label htmlFor="title" className={cn("font-semibold", form.formState.errors.title ? "text-red-500" : "text-zinc-700")}>
                    링크 제목
                  </Label>
                  <Input 
                    id="title" 
                    placeholder="예: 내 포트폴리오 웹사이트" 
                    {...form.register("title")}
                    className={cn(
                      "focus-visible:ring-zinc-500", 
                      form.formState.errors.title ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-300"
                    )}
                  />
                  {form.formState.errors.title && (
                    <p className="text-xs text-red-500 font-medium px-0.5">{form.formState.errors.title.message}</p>
                  )}
                </div>
                
                <div className="space-y-2.5">
                  <Label htmlFor="url" className={cn("font-semibold", form.formState.errors.url ? "text-red-500" : "text-zinc-700")}>
                    URL 주소
                  </Label>
                  <Input 
                    id="url" 
                    type="text"
                    placeholder="https://example.com" 
                    {...form.register("url")}
                    className={cn(
                      "focus-visible:ring-zinc-500", 
                      form.formState.errors.url ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-300"
                    )}
                  />
                  {form.formState.errors.url && (
                    <p className="text-xs text-red-500 font-medium px-0.5">{form.formState.errors.url.message}</p>
                  )}
                </div>
                
                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="border-zinc-200 text-zinc-700">취소</Button>
                  <Button type="submit" disabled={isAdding} className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                    {isAdding ? (
                      <><PhosphorIcons.Spinner className="mr-2 h-4 w-4 animate-spin" /> 추가 중...</>
                    ) : "추가 완료"}
                  </Button>
                </div>
              </form>

            </DialogContent>
          </Dialog>

        </header>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <PhosphorIcons.Spinner className="w-8 h-8 text-zinc-300 animate-spin" />
            </div>
          ) : (
            visibleLinks.map((link) => {
              const IconComponent = link.icon ? PhosphorIcons[link.icon as keyof typeof PhosphorIcons] as React.ElementType || PhosphorIcons.Link : PhosphorIcons.Link;

              return (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 rounded-xl block animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-2"
                >
                  <Card className={cn(
                    "overflow-hidden transition-all duration-300 md:hover:-translate-y-1 active:translate-y-0",
                    "border border-zinc-200 bg-white shadow-sm",
                    "hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-md",
                    link.animation === "pulse" && "animate-pulse hover:animate-none",
                  )}>
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {IconComponent && (
                          <div className="flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-zinc-100 text-zinc-500 group-hover:bg-zinc-900 group-hover:text-zinc-50 transition-all duration-300">
                            <IconComponent weight="duotone" className="w-5 h-5" />
                          </div>
                        )}
                        <span className="font-medium text-zinc-700 text-base tracking-wide group-hover:text-zinc-900 transition-colors">
                          {link.title}
                        </span>
                      </div>
                      <div className="text-zinc-400 group-hover:opacity-100 group-hover:text-zinc-900 transition-all pr-2">
                         <PhosphorIcons.ArrowRight weight="bold" className="w-4 h-4 translate-x-[-4px] group-hover:translate-x-0 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              )
            })
          )}
        </div>
      </div>
    </main>
  );
}
