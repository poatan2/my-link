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
      url: "https://github.com/poatan2",
      icon: <GithubIcon className="w-5 h-5" />,
    },
    {
      title: "LinkedIn",
      url: "#",
      icon: <LinkedinIcon className="w-5 h-5" />,
    },
    {
      title: "Instagram",
      url: "#",
      icon: <InstagramIcon className="w-5 h-5" />,
    },
    {
      title: "Email Me",
      url: "mailto:hello@example.com",
      icon: <MailIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-slate-100 font-sans selection:bg-purple-500/30 overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Background Animated Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/40 mix-blend-screen filter blur-[100px] opacity-70 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/40 mix-blend-screen filter blur-[100px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }} />

      <main className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Avatar Image Loop / Initials */}
        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-blue-500 shadow-xl mb-6 shadow-purple-900/20">
          <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center border-4 border-black/50 overflow-hidden">
            <span className="text-4xl font-black bg-gradient-to-tr from-purple-400 to-blue-400 bg-clip-text text-transparent">
              TK
            </span>
          </div>
        </div>

        {/* Profile Info */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 text-center">
          홍태경
        </h1>
        <p className="text-lg text-zinc-400 font-medium text-center mb-10 max-w-sm leading-relaxed px-4">
          정보보안을 배우고 있는 대학생입니다. 🚀
        </p>

        {/* Links Grid */}
        <div className="flex flex-col gap-4 w-full px-2 sm:px-0">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-4 px-6 w-full rounded-2xl bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 backdrop-blur-md overflow-hidden"
            >
              {/* Hover highlight effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

              <div className="flex items-center gap-4 relative z-10 text-zinc-300 group-hover:text-purple-400 transition-colors">
                {link.icon}
                <span className="text-lg font-semibold tracking-wide text-zinc-100 group-hover:text-white transition-colors">
                  {link.title}
                </span>
              </div>
              
              <ExternalLinkIcon className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors relative z-10 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300" />
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 pb-8 text-zinc-600 text-sm font-medium">
        © {new Date().getFullYear()} 홍태경. All Rights Reserved.
      </footer>
    </div>
  );
}
