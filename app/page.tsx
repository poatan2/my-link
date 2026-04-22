"use client";

import { DUMMY_LINKS } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export default function Home() {
  const visibleLinks = DUMMY_LINKS.filter(link => link.isVisible).sort((a, b) => a.order - b.order);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-secondary/20">
      <div className="w-full max-w-md space-y-8 mt-12 mb-24">
        <header className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full overflow-hidden bg-secondary flex items-center justify-center shadow-sm border border-border">
             <PhosphorIcons.User className="w-12 h-12 text-muted-foreground" weight="fill" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">태경 (TaeGyeong)</h1>
            <p className="text-sm font-medium text-muted-foreground">MyLink 프로젝트 샘플 페이지</p>
          </div>
        </header>
        
        <div className="flex flex-col gap-4">
          {visibleLinks.map((link) => {
            const IconComponent = link.icon ? PhosphorIcons[link.icon as keyof typeof PhosphorIcons] as React.ElementType : null;

            return (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-[&:not(:focus-visible)]:outline-none rounded-xl block"
              >
                <Card className={cn(
                  "overflow-hidden transition-all duration-300 md:hover:scale-[1.02] active:scale-[0.98] border shadow-sm",
                  "hover:shadow-md hover:border-primary/50 bg-card/80 backdrop-blur top-0",
                  link.animation === "pulse" && "animate-pulse hover:animate-none",
                )}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {IconComponent && (
                        <div className="flex items-center justify-center h-11 w-11 shrink-0 rounded-full bg-secondary/80 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                          <IconComponent weight="fill" className="w-5 h-5" />
                        </div>
                      )}
                      <span className="font-semibold text-foreground/90 group-hover:text-foreground transition-colors">
                        {link.title}
                      </span>
                    </div>
                    <div className="text-muted-foreground/60 group-hover:opacity-100 group-hover:text-primary transition-all pr-2">
                       <PhosphorIcons.ArrowUpRight weight="bold" className="w-5 h-5 translate-y-[2px] translate-x-[-2px] group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300" />
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
