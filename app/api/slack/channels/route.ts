import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("slack_access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Slack is not connected" },
      { status: 401 }
    );
  }

  const slackRes = await fetch(
    "https://slack.com/api/conversations.list?types=public_channel&limit=100",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await slackRes.json();

  if (!data.ok) {
    return NextResponse.json(
      { success: false, error: data.error || "Failed to fetch channels" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    channels: data.channels.map(
      (channel: { id: string; name: string; is_member?: boolean }) => ({
        id: channel.id,
        name: channel.name,
        is_member: channel.is_member,
      })
    ),
  });
}