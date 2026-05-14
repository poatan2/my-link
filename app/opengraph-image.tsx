import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MyLink - 나만의 모든 링크를 하나의 페이지로';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa', // zinc-50
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Blobs (Simulated Blur) */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: -200,
            width: 800,
            height: 800,
            background: 'radial-gradient(circle, rgba(219, 234, 254, 0.8) 0%, rgba(250, 250, 250, 0) 70%)', // blue-100
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -300,
            right: -200,
            width: 900,
            height: 900,
            background: 'radial-gradient(circle, rgba(243, 232, 255, 0.8) 0%, rgba(250, 250, 250, 0) 70%)', // purple-100
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 24px',
            backgroundColor: '#ffffff',
            border: '2px solid #e4e4e7', // zinc-200
            borderRadius: '100px',
            marginBottom: 40,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: '#22c55e', // green-500
              borderRadius: '50%',
            }}
          />
          <span style={{ fontSize: 24, fontWeight: 700, color: '#52525b' }}> {/* zinc-600 */}
            지금 바로 시작해보세요!
          </span>
        </div>

        {/* Main Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div style={{ fontSize: 80, fontWeight: 900, color: '#18181b', letterSpacing: '-0.05em', marginBottom: 10 }}>
            나만의 모든 링크를
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: '-0.05em',
              background: 'linear-gradient(to right, #18181b, #52525b, #a1a1aa)', // zinc-900 to zinc-600 to zinc-400
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            하나의 페이지로
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 32,
            fontWeight: 600,
            color: '#71717a', // zinc-500
            lineHeight: 1.5,
            textAlign: 'center',
          }}
        >
          <span>여러 곳에 흩어져 있는 나의 소셜 미디어, 포트폴리오를</span>
          <span>MyLink에서 쉽고 빠르게 정리하고 공유하세요.</span>
        </div>

        {/* Logo at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            fontSize: 36,
            fontWeight: 900,
            color: '#18181b',
            letterSpacing: '-0.05em',
          }}
        >
          MyLink
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
