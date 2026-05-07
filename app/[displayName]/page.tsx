"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import * as PhosphorIcons from "@phosphor-icons/react";
import { LinkItem } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ displayName: string }>;
}

export default function PublicProfilePage({ params }: PageProps) {
  const { displayName } = React.use(params);

  // 1. Fetch user profile by displayName
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["publicProfile", displayName],
    queryFn: async () => {
      const decodedDisplayName = decodeURIComponent(displayName);
      const q = query(collection(db, "users"), where("displayName", "==", decodedDisplayName));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      let userData: any = null;
      querySnapshot.forEach((docSnap) => {
        userData = { uid: docSnap.id, ...docSnap.data() };
      });
      return userData;
    },
  });

  // 2. Fetch user links once we have profile.uid
  const { data: links = [], isLoading: isLinksLoading } = useQuery({
    queryKey: ["publicLinks", profile?.uid],
    queryFn: async () => {
      if (!profile?.uid) return [];
      const q = query(
        collection(db, `users/${profile.uid}/links`),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const allLinks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as LinkItem));
      return allLinks.filter(link => link.isVisible);
    },
    enabled: !!profile?.uid,
  });

  // Loading state
  if (isProfileLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-50 text-zinc-900">
        <PhosphorIcons.Spinner className="w-10 h-10 text-zinc-300 animate-spin" />
      </div>
    );
  }

  // If no profile was found, trigger Next.js notFound (404 page)
  if (!profile) {
    notFound();
  }

  return (
    <main className="flex min-h-svh flex-col items-center p-6 bg-zinc-50 text-zinc-900 overflow-hidden">
      <div className="w-full max-w-md space-y-10 mt-12 mb-24 relative z-10 animate-in fade-in duration-500">
        <header className="text-center space-y-5">
          <div className="mx-auto w-24 h-24 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5 shadow-sm border border-zinc-200 transition-transform duration-500 hover:scale-105">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center">
                <PhosphorIcons.User className="w-10 h-10 text-zinc-400" weight="fill" />
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              {profile.username || "사용자"}
            </h1>
            <p className="text-sm font-medium text-zinc-500">
              @{profile.displayName}
            </p>
            {profile.bio && (
              <p className="text-sm text-zinc-700 max-w-[250px] mx-auto pt-3 font-medium">
                {profile.bio}
              </p>
            )}
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {isLinksLoading ? (
            <div className="flex justify-center items-center py-12">
              <PhosphorIcons.Spinner className="w-8 h-8 text-zinc-300 animate-spin" />
            </div>
          ) : links.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 text-zinc-500 text-center space-y-2 mt-2">
              <PhosphorIcons.LinkBreak className="w-10 h-10 text-zinc-300 mb-2" />
              <p className="font-semibold text-zinc-700">추가된 링크가 없습니다</p>
            </div>
          ) : (
            links.map((link) => {
              const IconComponent = link.icon ? PhosphorIcons[link.icon as keyof typeof PhosphorIcons] as React.ElementType || PhosphorIcons.Link : PhosphorIcons.Link;
              return (
                <div key={link.id} className="relative group block animate-in fade-in zoom-in-95 duration-300">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 rounded-xl block"
                  >
                    <Card className={cn(
                      "overflow-hidden transition-all duration-300 hover:shadow-md",
                      "border border-zinc-200 bg-white shadow-sm",
                      "hover:bg-zinc-50 hover:border-zinc-300",
                      link.animation === "pulse" && "animate-pulse hover:animate-none",
                    )}>
                      <CardContent className="p-4 sm:p-5 flex items-center justify-between min-h-[5.5rem]">
                        <div className="flex items-center gap-4">
                          {IconComponent && (
                            <div className="flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-zinc-100 text-zinc-500 group-hover:bg-zinc-900 group-hover:text-zinc-50 transition-all duration-300">
                              <IconComponent weight="duotone" className="w-5 h-5" />
                            </div>
                          )}
                          <span className="font-medium text-zinc-700 text-base tracking-wide group-hover:text-zinc-900 transition-colors break-words line-clamp-2 text-left">
                            {link.title}
                          </span>
                        </div>
                        <PhosphorIcons.ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                      </CardContent>
                    </Card>
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
