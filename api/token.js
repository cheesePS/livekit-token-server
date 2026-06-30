import { AccessToken } from "livekit-server-sdk";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    let room = "At The Cross Philippians";
    let identity = `guest-${Date.now()}`;
    let name = identity;

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      room = body.room || room;
      identity = body.identity || identity;
      name = body.name || identity;
    } else {
      const url = new URL(req.url, `https://${req.headers.host}`);
      room = url.searchParams.get("room") || room;
      identity = url.searchParams.get("identity") || identity;
      name = url.searchParams.get("name") || identity;
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: "Missing LIVEKIT_API_KEY or LIVEKIT_API_SECRET." });
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: String(identity),
      name: String(name),
      ttl: "2h"
    });

    token.addGrant({
      room: String(room),
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true
    });

    return res.status(200).json({
      token: await token.toJwt(),
      room,
      identity,
      name
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create LiveKit token." });
  }
}
