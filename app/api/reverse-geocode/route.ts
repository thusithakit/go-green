// app/api/reverse-geocode/route.ts
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'GoGreenApp/1.0 (your-email@example.com)',
        },
      }
    );
    const data = await response.json();
    return Response.json({ address: data.display_name });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch address' }), {
      status: 500,
    });
  }
}
