import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SLACK_CLIENT_ID;
  const redirectUri = process.env.SLACK_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Missing SLACK_CLIENT_ID or SLACK_REDIRECT_URI" },
      { status: 500 }
    );
  }

  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: clientId,
    scope: "channels:read,channels:history,chat:write",
    redirect_uri: redirectUri,
    state,
  });

  const response = NextResponse.redirect(
    `https://slack.com/oauth/v2/authorize?${params.toString()}`
  );

  response.cookies.set("slack_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });

  return response;
}