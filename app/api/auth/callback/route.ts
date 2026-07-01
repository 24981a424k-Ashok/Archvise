import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  
  // Forward the authentication session cookie to backend callback
  const session = request.cookies.get('archvise_session')?.value
  
  try {
    const callbackResponse = await fetch(`${API_URL}/api/github/callback?code=${code}&state=${state}`, {
      headers: {
        'Cookie': session ? `archvise_session=${session}` : '',
        'Accept': 'application/json'
      }
    })
    
    if (!callbackResponse.ok) {
      const errorText = await callbackResponse.text()
      console.error("Backend GitHub callback failed:", errorText)
    }
  } catch (e) {
    console.error("Failed to forward callback details:", e)
  }

  // Redirect client back to repo selector page
  return NextResponse.redirect(new URL('/github/select-repo', request.url))
}
