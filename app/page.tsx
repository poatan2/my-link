"use client";

import { useState } from "react";
import { DUMMY_LINKS, LinkItem } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export default function Home() {
  // Use React local state to manage the links dynamically
  const [links, setLinks] = useState<LinkItem[]>(DUMMY_LINKS);
  
  // Dialog (Modal) state for adding a new link
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const visibleLinks = links.filter(link => link.isVisible).sort((a, b) => a.order - b.order);

  // Function to handle adding a new link
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    // A simple URL validation fallback if one types URL without http
    const formattedUrl = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`;

    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: newTitle,
      url: formattedUrl,
      isVisible: true,
      order: links.length,
      animation: "none",
      icon: "Link", // Default icon indicating it's a web link
    };

    setLinks([...links, newLink]);
    setNewTitle("");
    setNewUrl("");
    setIsDialogOpen(false);
  };

  return (
    // Ultra-clean minimal light background
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4 font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                <PhosphorIcons.Plus className="mr-2 h-4 w-4" weight="bold" />
                새로운 링크 추가하기
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-6 bg-white border-zinc-200">
              <DialogHeader>
                <DialogTitle className="text-zinc-900 text-xl font-bold tracking-tight">새 링크 추가</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddLink} className="space-y-5 pt-4">
                <div className="space-y-2.5">
                  <Label htmlFor="title" className="text-zinc-700 font-semibold">링크 제목</Label>
                  <Input 
                    id="title" 
                    placeholder="예: 내 포트폴리오 웹사이트" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="border-zinc-300 focus-visible:ring-zinc-500"
                    required
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="url" className="text-zinc-700 font-semibold">URL 주소</Label>
                  <Input 
                    id="url" 
                    type="text"
                    placeholder="https://example.com" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="border-zinc-300 focus-visible:ring-zinc-500"
                    required
                  />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-zinc-200 text-zinc-700">취소</Button>
                  <Button type="submit" className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">추가 완료</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

        </header>

        <div className="flex flex-col gap-4">
          {visibleLinks.map((link) => {
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
                  // Minimal light styling
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
          })}
        </div>
      </div>
    </main>
  );
}
