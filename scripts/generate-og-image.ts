import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const WIDTH = 1200
const HEIGHT = 630

// Configuration - update these values
const config = {
  name: 'Jordan Lamoreaux',
  title: 'Software Developer',
  tagline: 'Building innovative solutions',
  backgroundColor: '#0a0a0a',
  primaryColor: '#f97316', // Orange
  textColor: '#ffffff',
}

async function generateOgImage() {
  const outputPath = path.join(process.cwd(), 'public', 'og-image.png')
  const logoPath = path.join(process.cwd(), 'public', 'logo.webp')

  // Check if logo exists
  const hasLogo = fs.existsSync(logoPath)

  // Create SVG with the design
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#171717;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>

      <!-- Decorative elements -->
      <circle cx="1100" cy="100" r="200" fill="#f97316" opacity="0.1"/>
      <circle cx="100" cy="530" r="150" fill="#f97316" opacity="0.08"/>

      <!-- Grid pattern overlay -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.03"/>
      </pattern>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

      <!-- Accent bar -->
      <rect x="80" y="260" width="6" height="110" fill="url(#accentGrad)" rx="3"/>

      <!-- Name -->
      <text x="110" y="310" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="700" fill="${config.textColor}">
        ${config.name}
      </text>

      <!-- Title -->
      <text x="110" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="400" fill="${config.primaryColor}">
        ${config.title}
      </text>

      <!-- Domain -->
      <text x="110" y="540" font-family="monospace" font-size="24" fill="#737373">
        jlmx.dev
      </text>

      <!-- Bottom accent line -->
      <rect x="0" y="620" width="${WIDTH}" height="10" fill="url(#accentGrad)"/>
    </svg>
  `

  // Convert SVG to PNG using sharp
  let image = sharp(Buffer.from(svg))

  // If logo exists, composite it onto the image
  if (hasLogo) {
    try {
      const logo = await sharp(logoPath)
        .resize(80, 80, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .negate({ alpha: false }) // Invert for dark background
        .toBuffer()

      image = image.composite([
        { input: logo, top: 50, left: 80 }
      ])
    } catch (err) {
      console.log('Could not add logo, continuing without it')
    }
  }

  await image.png().toFile(outputPath)

  console.log(`✅ OG image generated: ${outputPath}`)
}

generateOgImage().catch(console.error)
