import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Joel Lamoreaux - Software Developer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

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
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          {/* Logo placeholder - geometric shape */}
          <div
            style={{
              display: 'flex',
              width: 120,
              height: 120,
              backgroundColor: 'white',
              borderRadius: 16,
              marginBottom: 20,
            }}
          />

          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            Joel Lamoreaux
          </div>

          <div
            style={{
              fontSize: 32,
              color: '#94a3b8',
              textAlign: 'center',
            }}
          >
            Software Developer
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              marginTop: 20,
            }}
          >
            {['React', 'Next.js', 'TypeScript', 'Node.js'].map((tech) => (
              <div
                key={tech}
                style={{
                  backgroundColor: '#1e293b',
                  color: '#f97316',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 18,
                  border: '1px solid #334155',
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
