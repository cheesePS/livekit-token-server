# LiveKit Token Server

Secure token server for At The Cross Philippians.

## Vercel Environment Variables

Add these in Vercel Project Settings > Environment Variables:

- LIVEKIT_API_KEY
- LIVEKIT_API_SECRET
- ALLOWED_ORIGIN (optional; use * for testing)

## Endpoint

/api/token?room=At%20The%20Cross%20Philippians&identity=teacher-1&name=Teacher

Returns JSON with a LiveKit token.
