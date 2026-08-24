import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#f8fafc',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <span style={{ fontSize: 100, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>
            N
          </span>
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#f8fafc',
              margin: '0 6px 38px',
            }}
          />
          <span style={{ fontSize: 100, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>
            N
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
