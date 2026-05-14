import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MyLink Profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ displayName: string }> }) {
  const { displayName } = await params;

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
          background: 'linear-gradient(to bottom right, #09090b, #18181b, #27272a)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: '70px 120px',
            borderRadius: '50px',
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8)',
            border: '4px solid #e4e4e7',
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              backgroundColor: '#18181b',
              borderRadius: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
            }}
          >
            <span style={{ fontSize: '80px', color: 'white' }}>✨</span>
          </div>
          <div 
            style={{ 
              fontSize: 72, 
              fontWeight: 900, 
              color: '#18181b', 
              letterSpacing: '-0.05em', 
              marginBottom: 16,
              display: 'flex',
            }}
          >
            @{displayName}
          </div>
          <div style={{ fontSize: 36, color: '#71717a', fontWeight: 600 }}>
            MyLink에서 모든 링크를 확인해보세요
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 50,
            display: 'flex',
            alignItems: 'center',
            fontSize: 32,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.05em',
            backgroundColor: '#27272a',
            padding: '12px 28px',
            borderRadius: '100px',
            border: '1px solid #52525b',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
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
