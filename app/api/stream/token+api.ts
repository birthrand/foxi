import {
  getAuthenticatedClerkUserId,
  getClerkUserDisplayName,
} from "@/lib/clerk-server-auth";
import {
  getStreamServerClient,
  getStreamServerConfigError,
} from "@/lib/stream-server";

export async function GET(request: Request) {
  const userId = await getAuthenticatedClerkUserId(request);

  if (!userId) {
    return Response.json(
      { error: "Unauthorized. Sign in to start an audio lesson." },
      { status: 401 },
    );
  }

  const configError = getStreamServerConfigError();
  if (configError) {
    return Response.json({ error: configError }, { status: 500 });
  }

  try {
    const streamClient = getStreamServerClient();
    const apiKey = process.env.STREAM_API_KEY!;
    const displayName = await getClerkUserDisplayName(userId);

    await streamClient.upsertUsers([
      {
        id: userId,
        name: displayName,
        role: "user",
      },
    ]);

    const token = streamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60,
    });

    return Response.json({
      apiKey,
      userId,
      token,
    });
  } catch (error) {
    console.error("Stream token error:", error);
    return Response.json(
      { error: "Could not create a Stream session token." },
      { status: 500 },
    );
  }
}
