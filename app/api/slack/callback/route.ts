import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = req.cookies.get("slack_oauth_state")?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(new URL("/dashboard?slack=error", req.url));
  }

  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri = process.env.SLACK_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(
      new URL("/dashboard?slack=missing_env", req.url)
    );
  }

  const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.ok || !tokenData.access_token) {
    return NextResponse.redirect(
      new URL(
        `/dashboard?slack=token_error&reason=${encodeURIComponent(
          tokenData.error || "unknown"
        )}`,
        req.url
      )
    );
  }

  const response = NextResponse.redirect(
    new URL("/dashboard?slack=connected", req.url)
  );

  response.cookies.set("slack_access_token", tokenData.access_token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set("slack_team_name", tokenData.team?.name || "Slack", {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.delete("slack_oauth_state");

  return response;
}