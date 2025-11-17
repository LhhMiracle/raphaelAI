# RaphaelAI - Free AI Image Generator

A modern, free AI image generation web application inspired by Raphael.app. Generate stunning images from text descriptions using advanced AI models.

## Features

### Core Features
- **Free & Unlimited**: No sign-up required, completely free to use
- **High Quality**: Powered by Stable Diffusion XL for stunning results
- **Fast Generation**: Get your images in seconds
- **Privacy First**: No server-side storage, everything stays in your browser
- **Download Ready**: Download your generated images instantly
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Mode**: Automatic dark/light theme support

### Advanced Features
- **🎨 Style Presets**: 10 built-in artistic styles (Cinematic, Anime, Photorealistic, Digital Art, Oil Painting, Watercolor, Cyberpunk, Fantasy, 3D Render)
- **⚙️ Advanced Controls**:
  - Adjustable inference steps (10-50)
  - Customizable guidance scale (1-20)
  - Multiple aspect ratios (Square, Portrait, Landscape, Wide)
- **📜 History Management**: Automatic saving of all generated images to browser storage (up to 50 images)
- **❤️ Favorites**: Mark and organize your favorite creations
- **🔄 Reuse Prompts**: One-click reuse of any previous prompt
- **💡 Example Prompts**: Built-in inspiration gallery with ready-to-use prompts
- **🗑️ Flexible Management**: Delete individual images or clear entire history

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Hugging Face Inference API (Stable Diffusion XL)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- (Optional) Hugging Face API token for better rate limits

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd raphaelAI
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Hugging Face API token:
   - Create a `.env.local` file
   - Get your token from: https://huggingface.co/settings/tokens
   - Add to `.env.local`:
   ```
   HUGGINGFACE_API_TOKEN=your_token_here
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Usage
1. Enter a description of the image you want to generate
2. (Optional) Select a style preset from the dropdown
3. (Optional) Click "Show Advanced Settings" to fine-tune parameters
4. Click "Generate Image"
5. Wait 10-20 seconds for the AI to create your image
6. Download, favorite, or generate more images!

### Tabs Overview
- **Generate**: Create new images with all controls and settings
- **History**: View all previously generated images (up to 50)
- **Favorites**: Quick access to your favorite images

### Example Prompts

- "A serene landscape with mountains at sunset, painted in watercolor style"
- "A futuristic city with flying cars, cyberpunk aesthetic, neon lights"
- "A cute cat wearing a wizard hat, digital art"
- "An astronaut riding a horse on Mars, photorealistic"

## API Configuration

The app uses Hugging Face's Inference API by default. You can modify the model in `app/api/generate/route.ts`:

- **Current**: `stabilityai/stable-diffusion-xl-base-1.0`
- **Alternatives**:
  - `black-forest-labs/FLUX.1-schnell` (faster)
  - `runwayml/stable-diffusion-v1-5`
  - Any other text-to-image model on Hugging Face

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `HUGGINGFACE_API_TOKEN` environment variable
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Project Structure

```
raphaelAI/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts       # AI image generation API
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page with all features
├── lib/
│   ├── types.ts                # TypeScript types & constants
│   └── storage.ts              # localStorage utilities
├── .env.local.example          # Environment variables template
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── package.json                # Dependencies
```

## Performance

- **Generation Time**: 10-20 seconds (depending on model, steps, and API limits)
- **Image Quality**: High resolution (up to 1344x768 with SDXL)
- **Storage**: All images stored in browser localStorage (no server storage)
- **History Limit**: Automatically keeps last 50 generated images
- **Rate Limits**:
  - Without API token: ~10-20 requests/hour
  - With API token: Much higher limits (check Hugging Face pricing)

## Style Presets

The app includes 10 built-in style presets that automatically enhance your prompts:

1. **Cinematic** - Professional photography with cinematic lighting
2. **Anime** - Vibrant anime-style art inspired by Studio Ghibli
3. **Photorealistic** - Ultra-realistic 8K quality images
4. **Digital Art** - ArtStation-quality concept art
5. **Oil Painting** - Classical oil painting with brushstrokes
6. **Watercolor** - Soft watercolor painting style
7. **Cyberpunk** - Futuristic neon-lit sci-fi aesthetic
8. **Fantasy** - Magical and ethereal fantasy art
9. **3D Render** - High-quality 3D rendered look

## Advanced Settings

- **Steps (10-50)**: More steps = higher quality but slower generation
- **Guidance Scale (1-20)**: Higher values make the AI follow your prompt more closely
- **Image Size**: Choose from Square (1:1), Portrait (2:3), Landscape (3:2), or Wide (16:9)

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Inspired by [Raphael.app](https://raphael.app)
- Powered by [Hugging Face](https://huggingface.co)
- Built with [Next.js](https://nextjs.org)

## Support

If you encounter any issues, please check:
1. Your internet connection
2. Hugging Face API status
3. Browser console for errors

For persistent issues, please open a GitHub issue.

---

Made with ❤️ for the AI community
