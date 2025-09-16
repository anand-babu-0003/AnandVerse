import { NextResponse } from 'next/server';

export async function GET() {
  // Return a simple JSON response for Chrome DevTools
  return NextResponse.json({
    name: 'AnandVerse Portfolio',
    description: 'Portfolio website built with Next.js',
    version: '1.0.0',
    type: 'webapp'
  });
}
