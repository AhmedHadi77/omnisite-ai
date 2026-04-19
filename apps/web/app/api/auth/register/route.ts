import { NextResponse } from "next/server";
import { createPasswordAccount } from "../../../../lib/account-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      username?: string;
      agencyName?: string;
      email?: string;
      password?: string;
    };

    const result = await createPasswordAccount({
      name: body.name ?? "",
      username: body.username ?? "",
      agencyName: body.agencyName ?? "",
      email: body.email ?? "",
      password: body.password ?? ""
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Account registration failed.", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
