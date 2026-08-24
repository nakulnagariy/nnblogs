import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 7,
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
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>
            N
          </span>
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: '50%',
              backgroundColor: '#f8fafc',
              margin: '0 1px 7px',
            }}
          />
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>
            N
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
