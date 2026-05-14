import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '방문자 통계',
  description: '내 MyLink 프로필의 방문자 통계와 클릭 현황을 확인하세요.',
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
