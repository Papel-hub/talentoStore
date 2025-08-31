// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'Talento Store';
  const subtitle = searchParams.get('subtitle') ?? 'Transforme sua carreira farmacêutica';

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
          backgroundColor: '#f1f5f9',
          fontFamily: 'Roboto, sans-serif',
          fontSize: 48,
          fontWeight: 600,
          color: '#0f172a',
          padding: '40px',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              marginBottom: 20,
              textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              opacity: 0.9,
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                backgroundColor: 'white',
                borderRadius: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 20,
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              }}
            >
              <span style={{ fontSize: 40, fontWeight: 'bold', color: '#1e40af' }}>T</span>
            </div>
            <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.9)' }}>Talento Store</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}