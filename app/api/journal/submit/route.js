import { createHash, randomUUID } from "node:crypto";
export async function POST(request) {
  try {
    const raw = await request.text();
    if (raw.length > 1450000)
      return Response.json(
        { error: "Your submission is too long." },
        { status: 413 },
      );
    const data = JSON.parse(raw);
    if (data.website) return Response.json({ ok: true });
    if (!data.consent)
      return Response.json(
        { error: "Please agree to publication after approval." },
        { status: 400 },
      );
    for (const [field, min, max] of [
      ["name", 1, 80],
      ["title", 1, 140],
      ["text", 10, 5000],
    ]) {
      if (
        typeof data[field] !== "string" ||
        data[field].trim().length < min ||
        data[field].trim().length > max
      )
        return Response.json(
          { error: `Please check your ${field}.` },
          { status: 400 },
        );
    }
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const visitor = createHash("sha256").update(ip).digest("hex");
    const category = data.category || "Community";
    if (
      ![
        "Books",
        "Movies",
        "Notes",
        "Photos & videos",
        "Vlogs",
        "Quotes",
        "News",
        "Community",
      ].includes(category)
    )
      return Response.json(
        { error: "Choose a category from the list." },
        { status: 400 },
      );
    let image = "";
    if (data.photo) {
      const match =
        typeof data.photo === "string" &&
        /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(
          data.photo,
        );
      if (!match)
        return Response.json(
          { error: "Use a PNG, JPEG or WebP photo." },
          { status: 400 },
        );
      const bytes = Buffer.from(match[2], "base64");
      const signatures = {
        "image/png": bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
        "image/jpeg": bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
        "image/webp":
          bytes.toString("ascii", 0, 4) === "RIFF" &&
          bytes.toString("ascii", 8, 12) === "WEBP",
      };
      if (!bytes.length || bytes.length > 1048576 || !signatures[match[1]])
        return Response.json(
          { error: "Choose a valid photo smaller than 1 MB." },
          { status: 400 },
        );
      image = `guest/${randomUUID()}.${{ "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" }[match[1]]}`;
      const upload = await fetch(
        "https://zrenpbsmjiarpjsuowoe.supabase.co/storage/v1/object/portfolio-guest-media/" +
          image,
        {
          method: "POST",
          headers: {
            apikey: "sb_publishable_KtfMSMkyNlFUJc07K_qYHQ_4_Xa9_Nq",
            "Content-Type": match[1],
            "x-upsert": "false",
          },
          body: bytes,
          signal: AbortSignal.timeout(20000),
        },
      );
      if (!upload.ok)
        return Response.json(
          {
            error:
              "The photo could not be uploaded. Guest photo storage may need setup, or its upload limit has been reached.",
          },
          { status: 503 },
        );
    }
    const response = await fetch(
      "https://zrenpbsmjiarpjsuowoe.supabase.co/rest/v1/rpc/portfolio_submit_journal_v2",
      {
        method: "POST",
        headers: {
          apikey: "sb_publishable_KtfMSMkyNlFUJc07K_qYHQ_4_Xa9_Nq",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_name: data.name,
          p_title: data.title,
          p_text: data.text,
          p_visitor: visitor,
          p_category: category,
          p_image: image,
        }),
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      return Response.json(
        {
          error:
            result.code === "P0001"
              ? result.message
              : "Submissions are not available yet. Please try later.",
        },
        { status: 400 },
      );
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Could not send your journal. Please try again." },
      { status: 503 },
    );
  }
}
