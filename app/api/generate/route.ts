import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 使用 Hugging Face Inference API
    // 可以使用多个免费模型，这里使用 Stable Diffusion
    const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

    // 如果没有配置 token，使用公共 API（有速率限制）
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (HF_API_TOKEN) {
      headers['Authorization'] = `Bearer ${HF_API_TOKEN}`;
    }

    // 使用 FLUX.1-schnell 模型（快速版本）或 Stable Diffusion
    // const modelUrl = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell';
    const modelUrl = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

    const response = await fetch(modelUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HuggingFace API error:', errorText);

      // 如果模型正在加载，返回友好的错误消息
      if (response.status === 503) {
        return NextResponse.json(
          { error: 'Model is loading, please try again in a few seconds' },
          { status: 503 }
        );
      }

      throw new Error(`API request failed: ${response.status}`);
    }

    // 返回图像数据
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
