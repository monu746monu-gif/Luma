import { NextRequest, NextResponse } from "next/server";

type SlackMessage = {
  text?: string;
  user?: string;
  ts?: string;
  subtype?: string;
};

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("slack_access_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Slack is not connected. Connect Slack first.",
        },
        { status: 401 }
      );
    }

    const { channelId } = await req.json();

    if (!channelId) {
      return NextResponse.json(
        {
          success: false,
          error: "channelId is required.",
        },
        { status: 400 }
      );
    }

    const slackRes = await fetch(
      `https://slack.com/api/conversations.history?channel=${encodeURIComponent(
        channelId
      )}&limit=30`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await slackRes.json();

    if (!data.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to fetch Slack messages.",
        },
        { status: 400 }
      );
    }

    const messages = ((data.messages || []) as SlackMessage[])
      .filter((message) => message.text && !message.subtype)
      .slice(0, 20)
      .map((message, index) => ({
        id: `${message.ts || index}`,
        text: message.text || "",
        user: message.user || "unknown",
        ts: message.ts || "",
      }));

    const context = messages
      .map((message, index) => {
        return `${index + 1}. ${message.text}`;
      })
      .join("\n");

    const summaryPrompt = `
Recent Slack messages from the selected channel:

${context}

Use this as workspace context for Luma.
Extract:
- what the team/product is working on
- blockers or pending work
- launch/marketing/tasks mentioned
- what AI can help with
- what humans need to approve
`;

    return NextResponse.json({
      success: true,
      context,
      summaryPrompt,
      messages,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Slack context error.",
      },
      { status: 500 }
    );
  }
}