import { NextResponse } from "next/server";
import { Resend } from "resend";

function textToHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
}

export async function POST(req: Request) {
  try {
    const { to, subject, body, replyTo } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    }

    if (!to || !subject || !body) {
      return NextResponse.json(
        { success: false, error: "to, subject, and body are required" },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: process.env.LUMA_FROM_EMAIL || "onboarding@resend.dev",
      to: [to],
      subject,
      replyTo,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#241A14">${textToHtml(
        body
      )}</div>`,
    });

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: result.data?.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
