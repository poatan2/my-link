"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
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
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [bio, setBio] = useState<string>("");
  const [originalBio, setOriginalBio] = useState<string>("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [originalDisplayName, setOriginalDisplayName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [originalUsername, setOriginalUsername] = useState<string>("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  // React Hook Form implementation
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { title: "", url: "" },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      const emailPrefix = loggedInUser.email ? loggedInUser.email.split('@')[0] : loggedInUser.displayName;
      
      // Save user to Firestore users collection
      await setDoc(doc(db, "users", loggedInUser.uid), {
        uid: loggedInUser.uid,
        email: loggedInUser.email,
        username: loggedInUser.displayName || "사용자",
        displayName: emailPrefix,
        photoURL: loggedInUser.photoURL,
        bio: "한 줄 소개를 입력해주세요",
        lastLoginAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Login failed", error);
      toast.error("로그인에 실패했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleCopyProfileLink = () => {
    if (!user || !displayName) return;
    const profileUrl = `${window.location.origin}/${displayName}`;
    navigator.clipboard.writeText(profileUrl)
      .then(() => toast.success("프로필 링크가 복사되었습니다!"))
      .catch((err) => console.error("Failed to copy link: ", err));
  };

  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
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

  useEffect(() => {
    if (userProfile) {
      if (userProfile.username) {
        setUsername(userProfile.username);
        setOriginalUsername(userProfile.username);
      }
      if (userProfile.displayName) {
        setDisplayName(userProfile.displayName);
        setOriginalDisplayName(userProfile.displayName);
      }
      if (userProfile.bio) {
        setBio(userProfile.bio);
        setOriginalBio(userProfile.bio);
      }
    } else if (user) {
      const defaultDisplayName = user.email ? user.email.split('@')[0] : (user.displayName || "사용자");
      setDisplayName(defaultDisplayName);
      setOriginalDisplayName(defaultDisplayName);
      const defaultUsername = user.displayName || "사용자";
      setUsername(defaultUsername);
      setOriginalUsername(defaultUsername);
      setBio("한 줄 소개를 입력해주세요");
      setOriginalBio("한 줄 소개를 입력해주세요");
    } else {
      setBio(""); setOriginalBio("");
      setDisplayName(""); setOriginalDisplayName("");
      setUsername(""); setOriginalUsername("");
    }
  }, [userProfile, user]);

  const visibleLinks = links.filter(link => link.isVisible);

  const updateUsernameMutation = useMutation({
    mutationFn: async (newUsername: string) => {
      if (!user) throw new Error("Not authenticated");
      await updateDoc(doc(db, "users", user.uid), { username: newUsername, updatedAt: serverTimestamp() });
      return newUsername;
    },
    onSuccess: (newUsername) => {
      setOriginalUsername(newUsername);
      setIsEditingUsername(false);
      toast.success("이름이 변경되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.uid] });
    },
    onError: () => toast.error("이름 수정 중 오류가 발생했습니다.")
  });

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUsername = username.trim();
    if (!newUsername) return toast.error("이름을 입력해주세요.");
    if (newUsername === originalUsername) return setIsEditingUsername(false);
    updateUsernameMutation.mutate(newUsername);
  };

  const updateDisplayNameMutation = useMutation({
    mutationFn: async (newName: string) => {
      if (!user) throw new Error("Not authenticated");
      const q = query(collection(db, "users"), where("displayName", "==", newName));
      const snapshot = await getDocs(q);
      let isDuplicate = false;
      snapshot.forEach(d => { if (d.id !== user.uid) isDuplicate = true; });
      if (isDuplicate) throw new Error("DUPLICATE");
      await updateDoc(doc(db, "users", user.uid), { displayName: newName, updatedAt: serverTimestamp() });
      return newName;
    },
    onSuccess: (newName) => {
      setOriginalDisplayName(newName);
      setIsEditingName(false);
      toast.success("닉네임이 변경되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.uid] });
    },
    onError: (err: Error) => {
      if (err.message === "DUPLICATE") toast.error("이미 사용 중인 닉네임입니다.");
      else toast.error("닉네임 수정 중 오류가 발생했습니다.");
    }
  });

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newName = displayName.trim();
    if (!newName) return toast.error("닉네임을 입력해주세요.");
    if (newName === originalDisplayName) return setIsEditingName(false);
    updateDisplayNameMutation.mutate(newName);
  };

  const updateBioMutation = useMutation({
    mutationFn: async (newBio: string) => {
      if (!user) throw new Error("Not authenticated");
      await updateDoc(doc(db, "users", user.uid), { bio: newBio, updatedAt: serverTimestamp() });
      return newBio;
    },
    onSuccess: (newBio) => {
      setOriginalBio(newBio);
      setIsEditingBio(false);
      toast.success("한 줄 소개가 변경되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.uid] });
    },
    onError: () => toast.error("한 줄 소개 수정 중 오류가 발생했습니다.")
  });

  const handleBioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBio = bio.trim();
    if (newBio === originalBio) return setIsEditingBio(false);
    updateBioMutation.mutate(newBio);
  };

  const addLinkMutation = useMutation({
    mutationFn: async (data: LinkFormValues) => {
      if (!user) throw new Error("Not authenticated");
      const urlTrimmed = data.url.trim();
      const formattedUrl = urlTrimmed.startsWith("http") ? urlTrimmed : `https://${urlTrimmed}`;
      await addDoc(collection(db, `users/${user.uid}/links`), {
        title: data.title.trim(),
        url: formattedUrl,
        isVisible: true,
        order: links.length,
        animation: "none",
        icon: "Link",
        createdAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.uid] });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: () => toast.error("링크 추가 중 오류가 발생했습니다.")
  });

  const onSubmit = (data: LinkFormValues) => addLinkMutation.mutate(data);

  const updateLinkMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: LinkFormValues }) => {
      if (!user) throw new Error("Not authenticated");
      const urlTrimmed = data.url.trim();
      const formattedUrl = urlTrimmed.startsWith("http") ? urlTrimmed : `https://${urlTrimmed}`;
      await updateDoc(doc(db, `users/${user.uid}/links`, id), {
        title: data.title.trim(),
        url: formattedUrl,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.uid] });
    },
    onError: () => toast.error("링크 수정 중 오류가 발생했습니다.")
  });

  const handleUpdateLink = async (id: string, data: LinkFormValues) => {
    updateLinkMutation.mutate({ id, data });
  };

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");
      await deleteDoc(doc(db, `users/${user.uid}/links`, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.uid] });
      setDeletingLink(null);
    },
    onError: () => toast.error("링크 삭제 중 오류가 발생했습니다.")
  });

  const handleDeleteLink = () => {
    if (deletingLink) deleteLinkMutation.mutate(deletingLink.id);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) form.reset();
  };

  const isUpdatingUsername = updateUsernameMutation.isPending;
  const isUpdatingName = updateDisplayNameMutation.isPending;
  const isUpdatingBio = updateBioMutation.isPending;
  const isAdding = addLinkMutation.isPending;
  const isDeleting = deleteLinkMutation.isPending;
  const isLoading = isLinksLoading;

  return (
    <main className="flex min-h-svh flex-col items-center p-6 bg-zinc-50 text-zinc-900 overflow-hidden">
      <div className="w-full max-w-5xl flex justify-between items-center mb-4 z-20 relative pt-4 px-2">
        <div className="text-2xl font-black tracking-tighter text-zinc-900">
          MyLink
        </div>
        {user ? (
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
                <DropdownMenuItem className="cursor-pointer py-2 focus:bg-zinc-50" onClick={() => toast.info("준비 중인 기능입니다.")}>
                  <PhosphorIcons.ChartBar className="mr-2 h-4 w-4 text-zinc-500" />
                  <span>방문자 통계</span>
                </DropdownMenuItem>
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
        ) : (
          <Button onClick={handleLogin} className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800 font-semibold px-6 shadow-sm">
            로그인
          </Button>
        )}
      </div>

      {authLoading ? (
        <div className="flex justify-center items-center py-20 flex-1">
          <PhosphorIcons.Spinner className="w-8 h-8 text-zinc-300 animate-spin" />
        </div>
      ) : !user ? (
        <div className="flex flex-col items-center justify-center w-full flex-1 animate-in fade-in duration-700 relative z-10 pb-20 mt-4 md:mt-10">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 mb-6 text-center leading-none">
            MyLink
          </h1>
          <p className="text-zinc-500 text-center text-lg md:text-xl font-medium mb-10 leading-relaxed">
            나만의 링크를 만들고 관리하려면<br/>구글 계정으로 로그인해주세요.
          </p>
          <Button onClick={handleLogin} size="lg" className="h-14 px-8 text-lg bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-full font-semibold">
            <PhosphorIcons.GoogleLogo className="mr-2 h-6 w-6" /> Google로 시작하기
          </Button>

          {/* Floating UI Mockup */}
          <div className="mt-20 relative w-full max-w-md mx-auto perspective-[1000px] select-none pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-zinc-200 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
            <div className="relative w-full transform transition-transform duration-700 hover:rotate-0 rotate-[2deg] hover:scale-105">
              <div className="bg-white/80 backdrop-blur-xl border border-zinc-200 p-6 rounded-3xl shadow-2xl">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-full bg-zinc-200 animate-pulse"></div>
                   <div className="space-y-2">
                     <div className="w-32 h-4 bg-zinc-200 rounded-full animate-pulse"></div>
                     <div className="w-20 h-3 bg-zinc-100 rounded-full animate-pulse"></div>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <div className="w-full h-14 bg-zinc-100/80 rounded-2xl border border-zinc-100 flex items-center px-4 gap-3">
                     <div className="w-6 h-6 rounded-md bg-zinc-200"></div>
                     <div className="w-40 h-4 bg-zinc-200 rounded-full"></div>
                   </div>
                   <div className="w-full h-14 bg-zinc-100/80 rounded-2xl border border-zinc-100 flex items-center px-4 gap-3">
                     <div className="w-6 h-6 rounded-md bg-zinc-200"></div>
                     <div className="w-24 h-4 bg-zinc-200 rounded-full"></div>
                   </div>
                 </div>
              </div>
              <div className="absolute -z-10 top-6 -right-6 w-full h-full bg-zinc-100/50 backdrop-blur-sm border border-zinc-200/50 rounded-3xl rotate-[-4deg]"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-10 mt-8 mb-24 relative z-10 animate-in fade-in duration-500">
          <header className="text-center space-y-5">
            <div className="mx-auto w-24 h-24 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5 shadow-sm border border-zinc-200 transition-transform duration-500 hover:scale-105">
               {user.photoURL ? (
                 <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
               ) : (
                 <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center">
                     <PhosphorIcons.User className="w-10 h-10 text-zinc-400" weight="fill" />
                 </div>
               )}
            </div>
            <div className="space-y-1">
              <div className="flex justify-center items-center">
                {isEditingUsername ? (
                  <form onSubmit={handleUsernameSubmit} className="flex items-center space-x-2">
                    <Input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="이름을 입력해주세요"
                      className="h-10 text-xl font-bold text-center border-zinc-300 focus-visible:ring-zinc-500 w-48"
                      autoFocus
                      disabled={isUpdatingUsername}
                    />
                    <Button type="submit" size="sm" className="h-10 px-3 bg-zinc-900 text-zinc-50 hover:bg-zinc-800" disabled={isUpdatingUsername}>
                      {isUpdatingUsername ? <PhosphorIcons.Spinner className="w-4 h-4 animate-spin" /> : "저장"}
                    </Button>
                  </form>
                ) : (
                  <div 
                    className="group flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-100 px-3 py-1 rounded-lg transition-colors border border-transparent hover:border-zinc-200"
                    onClick={() => setIsEditingUsername(true)}
                    title="클릭하여 이름 수정"
                  >
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                      {username}
                    </h1>
                    <PhosphorIcons.PencilSimple className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>
              <div className="flex justify-center items-center">
                {isEditingName ? (
                  <form onSubmit={handleNameSubmit} className="flex items-center space-x-1">
                    <span className="text-zinc-500 font-medium">@</span>
                    <Input 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)} 
                      placeholder="닉네임을 입력해주세요"
                      className="h-8 text-sm font-medium text-center border-zinc-300 focus-visible:ring-zinc-500 w-32"
                      autoFocus
                      disabled={isUpdatingName}
                    />
                    <Button type="submit" size="sm" className="h-8 px-2 bg-zinc-900 text-zinc-50 hover:bg-zinc-800" disabled={isUpdatingName}>
                      {isUpdatingName ? <PhosphorIcons.Spinner className="w-4 h-4 animate-spin" /> : "저장"}
                    </Button>
                  </form>
                ) : (
                  <div 
                    className="group flex items-center justify-center gap-1 cursor-pointer hover:bg-zinc-100 px-2 py-1 rounded-md transition-colors border border-transparent hover:border-zinc-200"
                    onClick={() => setIsEditingName(true)}
                    title="클릭하여 닉네임 수정"
                  >
                    <p className="text-sm font-medium text-zinc-500">
                      @{displayName}
                    </p>
                    <PhosphorIcons.PencilSimple className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>
              
              {/* Bio Section */}
              <div className="pt-3 flex justify-center pb-2">
                {isEditingBio ? (
                  <form onSubmit={handleBioSubmit} className="flex w-full max-w-[280px] items-center space-x-2">
                    <Input 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      placeholder="한 줄 소개를 입력해주세요"
                      className="h-9 text-sm text-center border-zinc-300 focus-visible:ring-zinc-500"
                      autoFocus
                      disabled={isUpdatingBio}
                    />
                    <Button type="submit" size="sm" className="h-9 px-3 bg-zinc-900 text-zinc-50 hover:bg-zinc-800" disabled={isUpdatingBio}>
                      {isUpdatingBio ? <PhosphorIcons.Spinner className="w-4 h-4 animate-spin" /> : "저장"}
                    </Button>
                  </form>
                ) : (
                  <div 
                    className="group flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-100 px-4 py-1.5 rounded-lg transition-colors border border-transparent hover:border-zinc-200"
                    onClick={() => setIsEditingBio(true)}
                    title="클릭하여 한 줄 소개 수정"
                  >
                    <p className="text-sm text-zinc-700 max-w-[250px] truncate font-medium">
                      {bio || "한 줄 소개를 입력해주세요"}
                    </p>
                    <PhosphorIcons.PencilSimple className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>
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

          <Dialog open={!!deletingLink} onOpenChange={(open) => !open && !isDeleting && setDeletingLink(null)}>
            <DialogContent className="sm:max-w-md p-6 bg-white border-zinc-200">
              <DialogHeader>
                <DialogTitle className="text-zinc-900 text-xl font-bold tracking-tight">정말 삭제하시겠습니까?</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-3">
                <p className="text-zinc-700">
                  <span className="font-semibold">&quot;{deletingLink?.title}&quot;</span> 링크를 삭제합니다.
                </p>
                <p className="text-red-500 font-medium text-sm">
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setDeletingLink(null)} className="border-zinc-200 text-zinc-700" disabled={isDeleting}>취소</Button>
                <Button type="button" variant="destructive" onClick={handleDeleteLink} disabled={isDeleting} className="bg-red-500 text-white hover:bg-red-600">
                  {isDeleting ? <><PhosphorIcons.Spinner className="mr-2 h-4 w-4 animate-spin" /> 삭제 중...</> : "삭제하기"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        </header>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <PhosphorIcons.Spinner className="w-8 h-8 text-zinc-300 animate-spin" />
            </div>
          ) : visibleLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 text-zinc-500 text-center space-y-2 mt-2 animate-in fade-in zoom-in-95 duration-300">
               <PhosphorIcons.LinkBreak className="w-10 h-10 text-zinc-300 mb-2" />
               <p className="font-semibold text-zinc-700">아직 추가된 링크가 없습니다</p>
               <p className="text-sm font-medium">위 버튼을 눌러 링크를 추가해보세요!</p>
            </div>
          ) : (
            visibleLinks.map((link) => (
              <LinkCardItem 
                key={link.id} 
                link={link} 
                onUpdate={handleUpdateLink}
                onDeleteRequest={() => setDeletingLink(link)}
              />
            ))
          )}
        </div>
        </div>
      )}
    </main>
  );
}

function LinkCardItem({
  link,
  onUpdate,
  onDeleteRequest
}: {
  link: LinkItem;
  onUpdate: (id: string, data: LinkFormValues) => Promise<void>;
  onDeleteRequest: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { title: link.title, url: link.url },
  });

  const onSubmit = async (data: LinkFormValues) => {
    setIsUpdating(true);
    await onUpdate(link.id, data);
    setIsUpdating(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset({ title: link.title, url: link.url });
    setIsEditing(false);
  };

  const IconComponent = link.icon ? PhosphorIcons[link.icon as keyof typeof PhosphorIcons] as React.ElementType || PhosphorIcons.Link : PhosphorIcons.Link;

  if (isEditing) {
    return (
      <Card className="overflow-hidden border border-zinc-200 bg-white shadow-sm ring-2 ring-zinc-400 ring-offset-2 ring-offset-zinc-50 mb-4 animate-in fade-in duration-300">
        <CardContent className="p-4 sm:p-5">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`title-${link.id}`} className={cn("font-semibold text-xs", form.formState.errors.title ? "text-red-500" : "text-zinc-700")}>
                링크 제목
              </Label>
              <Input 
                id={`title-${link.id}`}
                placeholder="예: 내 포트폴리오 웹사이트" 
                {...form.register("title")}
                className={cn(
                  "h-9 focus-visible:ring-zinc-500", 
                  form.formState.errors.title ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-300"
                )}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-red-500 font-medium px-0.5">{form.formState.errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`url-${link.id}`} className={cn("font-semibold text-xs", form.formState.errors.url ? "text-red-500" : "text-zinc-700")}>
                URL 주소
              </Label>
              <Input 
                id={`url-${link.id}`}
                type="text"
                placeholder="https://example.com" 
                {...form.register("url")}
                className={cn(
                  "h-9 focus-visible:ring-zinc-500", 
                  form.formState.errors.url ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-300"
                )}
              />
              {form.formState.errors.url && (
                <p className="text-xs text-red-500 font-medium px-0.5">{form.formState.errors.url.message}</p>
              )}
            </div>
            
            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleCancel} className="text-sm h-9 border-zinc-200 text-zinc-700">취소</Button>
              <Button type="submit" disabled={isUpdating} size="sm" className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800 text-sm h-9">
                {isUpdating ? <PhosphorIcons.Spinner className="h-4 w-4 animate-spin" /> : "저장"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative group block animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-2">
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
            <div className="flex items-center gap-4 pr-24">
              {IconComponent && (
                <div className="flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-zinc-100 text-zinc-500 group-hover:bg-zinc-900 group-hover:text-zinc-50 transition-all duration-300">
                  <IconComponent weight="duotone" className="w-5 h-5" />
                </div>
              )}
              <span className="font-medium text-zinc-700 text-base tracking-wide group-hover:text-zinc-900 transition-colors break-words line-clamp-2">
                {link.title}
              </span>
            </div>
          </CardContent>
        </Card>
      </a>

      {/* Action buttons wrapper container - always visible */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
          aria-label="수정"
        >
          <PhosphorIcons.PencilSimple className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteRequest();
          }}
          className="p-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors"
          aria-label="삭제"
        >
          <PhosphorIcons.Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
