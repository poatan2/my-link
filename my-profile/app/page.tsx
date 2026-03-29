'use client';
import React from 'react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ExternalLinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

export default function Home() {
  const links = [
    {
      title: "GitHub",
      desc: "오픈소스 기여 및 개인 프로젝트",
      url: "https://github.com/poatan2",
      icon: <GithubIcon className="w-8 h-8" />,
      bgColor: "bg-white",
      textColor: "text-black",
    },
    {
      title: "LinkedIn",
      desc: "프로페셔널 네트워크 및 이력",
      url: "#",
      icon: <LinkedinIcon className="w-8 h-8" />,
      bgColor: "bg-blue-400",
      textColor: "text-black",
    },
    {
      title: "Instagram",
      desc: "일상과 소소한 기록들",
      url: "#",
      icon: <InstagramIcon className="w-8 h-8" />,
      bgColor: "bg-pink-400",
      textColor: "text-black",
    },
    {
      title: "Email Me",
      desc: "협업 제안 및 커피챗 환영",
      url: "mailto:hello@example.com",
      icon: <MailIcon className="w-8 h-8" />,
      bgColor: "bg-green-400",
      textColor: "text-black",
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 md:p-12 lg:p-20 flex flex-col items-center">
      {/* Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Profile Card */}
        <div className="md:col-span-5 lg:col-span-4 sticky top-10">
          <div className="bg-yellow-300 border-4 border-black p-6 sm:p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center border-[6px]">
            {/* Avatar */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 border-4 border-black rounded-full overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 bg-white shrink-0">
              <img 
                src="https://github.com/poatan2.png" 
                alt="홍태경 프로필 사진" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ddd" width="100" height="100"/><text fill="%23333" font-size="40" x="50" y="65" font-family="sans-serif" text-anchor="middle">TK</text></svg>';
                }}
              />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-black mb-3 text-center uppercase tracking-tight text-black">
              홍태경
            </h1>
            
            {/* User Tagline */}
            <div className="bg-white border-2 border-black w-full text-center py-2 px-4 rounded-full font-bold mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
              🚀 보안 전공 대학생
            </div>
            
            {/* description */}
            <p className="text-center text-lg font-medium leading-relaxed mb-6 text-black">
              정보보안을 배우고 있는 대학생입니다. 새로운 기술을 탐구하고, 견고한 시스템을 만드는 것에 열정이 있습니다.
            </p>

            {/* Primary Action */}
            <a 
              href="mailto:hello@example.com"
              className="w-full bg-black text-white text-center font-bold text-xl py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:bg-white hover:text-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98]"
            >
              Contact Me 👋
            </a>
          </div>
        </div>

        {/* Right Column: Links & Content grid */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-8">
          
          {/* Main Links Card */}
          <div className="bg-white border-4 border-black p-6 sm:p-10 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl sm:text-4xl font-black mb-6 uppercase border-b-4 border-black pb-4 inline-block text-black">
              My Links
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              {links.map((link) => (
                <a
                  key={link.title}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col p-6 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${link.bgColor} ${link.textColor}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                      {link.icon}
                    </div>
                    <ExternalLinkIcon className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <h3 className="text-2xl font-black tracking-tight mb-2">
                    {link.title}
                  </h3>
                  
                  <p className="font-semibold text-lg opacity-90 border-t-2 border-black/20 pt-2 mt-auto">
                    {link.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Extra Block */}
          <div className="bg-purple-400 border-4 border-black p-6 sm:p-10 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 uppercase">
              Current Focus 🔥
            </h2>
            <p className="text-xl font-bold leading-relaxed bg-white border-2 border-black p-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              웹 취약점 분석 및 프론트엔드 보안 역량 강화
            </p>
          </div>
          
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full mt-20 pt-8 border-t-4 border-black max-w-6xl text-center pb-8 font-bold text-lg text-black">
        <p className="inline-block bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          © {new Date().getFullYear()} 홍태경. All Rights Reserved. X_X
        </p>
      </footer>
    </div>
  );
}
