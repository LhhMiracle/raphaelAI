# RaphaelAI - Free AI Image Generator

A modern, free AI image generation web application inspired by Raphael.app. Generate stunning images from text descriptions using advanced AI models.

## Features

- **Free & Unlimited**: No sign-up required, completely free to use
- **High Quality**: Powered by Stable Diffusion XL for stunning results
- **Fast Generation**: Get your images in seconds
- **Privacy First**: No data stored, all processing is temporary
- **Download Ready**: Download your generated images instantly
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Mode**: Automatic dark/light theme support

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

1. Enter a description of the image you want to generate
2. Click "Generate Image"
3. Wait 10-20 seconds for the AI to create your image
4. Download or generate more images!

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
│   │       └── route.ts      # AI image generation API
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── public/                    # Static assets
├── .env.local.example         # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── package.json               # Dependencies

```

## Performance

- **Generation Time**: 10-20 seconds (depending on model and API limits)
- **Image Quality**: High resolution (1024x1024 with SDXL)
- **Rate Limits**:
  - Without API token: ~10-20 requests/hour
  - With API token: Much higher limits (check Hugging Face pricing)

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
