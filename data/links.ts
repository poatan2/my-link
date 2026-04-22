export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  thumbnail?: string;
  isVisible: boolean;
  order: number;
  animation?: "shake" | "pulse" | "none";
}

export const DUMMY_LINKS: LinkItem[] = [
  {
    id: "1",
    title: "인스타그램",
    url: "https://instagram.com",
    icon: "InstagramLogo",
    isVisible: true,
    order: 0,
    animation: "none",
  },
  {
    id: "2",
    title: "유튜브",
    url: "https://youtube.com",
    icon: "YoutubeLogo",
    isVisible: true,
    order: 1,
    animation: "pulse",
  },
  {
    id: "3",
    title: "블로그",
    url: "https://blog.naver.com",
    icon: "Article",
    isVisible: true,
    order: 2,
    animation: "none",
  },
  {
    id: "4",
    title: "Github",
    url: "https://github.com/poatan2",
    icon: "GithubLogo",
    isVisible: true,
    order: 3,
    animation: "none",
  },
  {
    id: "5",
    title: "포트폴리오",
    url: "https://my-portfolio.com",
    icon: "Briefcase",
    isVisible: true,
    order: 4,
    animation: "shake",
  },
];
