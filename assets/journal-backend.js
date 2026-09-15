// Supabase adapter. Owner access tokens stay in memory, never localStorage.
// The existing local Node API remains available when no publishable key is set.
(() => {
  const config = window.JOURNAL_CONFIG || {};
  let accessToken = "",
    expiresAt = 0;
  const enabled = Boolean(config.url && config.publishableKey);
  const endpoint = config.url?.replace(/\/$/, "");
  const table = "/rest/v1/portfolio_journal_posts";
  const encodePath = (value) =>
    value.split("/").map(encodeURIComponent).join("/");
  function unauthorized(
    message = "Your session expired. Sign in again to save your changes.",
  ) {
    accessToken = "";
    expiresAt = 0;
    throw Object.assign(new Error(message), { status: 401 });
  }
  async function remote(
    route,
    { method = "GET", body, auth = false, headers = {} } = {},
  ) {
    if (auth && (!accessToken || Date.now() >= expiresAt)) unauthorized();
    const baseHeaders = { apikey: config.publishableKey, ...headers };
    if (auth) baseHeaders.Authorization = `Bearer ${accessToken}`;
    // Legacy anon JWT keys may also be used as the anonymous bearer token.
    else if (config.publishableKey?.startsWith("eyJ"))
      baseHeaders.Authorization = `Bearer ${config.publishableKey}`;
    if (body !== undefined && !(body instanceof Blob)) {
      baseHeaders["Content-Type"] = "application/json";
      body = JSON.stringify(body);
    }
    let response;
    try {
      response = await fetch(endpoint + route, {
        method,
        headers: baseHeaders,
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(body instanceof Blob ? 60000 : 12000),
      });
    } catch {
      throw new Error(
        "Cannot reach Supabase. Keep this page open and try again when your connection returns.",
      );
    }
    const data =
      response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status === 401 && auth) unauthorized();
      throw Object.assign(
        new Error(
          data?.msg ||
            data?.message ||
            data?.error_description ||
            data?.error ||
            "Supabase request failed.",
        ),
        { status: response.status },
      );
    }
    return data;
  }
  async function requireOwner() {
    const owners = await remote(
      "/rest/v1/portfolio_journal_owners?select=user_id",
      { auth: true },
    );
    if (!owners?.length)
      unauthorized(
        "This account is not a portfolio owner. Add its Auth user UUID to portfolio_journal_owners in Supabase.",
      );
  }
  async function request(route, options = {}) {
    const method = options.method || "GET";
    if (route === "/api/portfolio" || route === "/api/admin/portfolio") {
      const auth = route === "/api/admin/portfolio";
      if (auth) await requireOwner();
      if (method !== "GET" && !(auth && method === "PUT")) throw new Error("Unsupported portfolio operation.");
      try {
        const rows = await remote("/rest/v1/portfolio_content?" + (method === "GET" ? "id=eq.1&select=data" : "on_conflict=id"), {
          method: method === "PUT" ? "POST" : "GET", auth,
          ...(method === "PUT" ? { body: { id: 1, data: JSON.parse(options.body) }, headers: { Prefer: "resolution=merge-duplicates,return=representation" } } : {}),
        });
        if (method === "PUT" && !rows?.[0]?.data) throw new Error("Portfolio was not saved. Check owner permissions and try again.");
        return rows?.[0]?.data || null;
      } catch (error) {
        if (error.status === 404) throw new Error("Portfolio editing needs the supabase/portfolio-content.sql migration applied to your Supabase project.");
        throw error;
      }
    }
    if (route === "/api/admin/portfolio-media" && method === "POST") {
      await requireOwner();
      const file = options.body;
      const extensions = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "application/pdf": "pdf" };
      if (!extensions[file.type] || file.size > 10 * 1024 * 1024) throw new Error("Choose a PNG, JPEG, WebP or PDF smaller than 10 MB.");
      const name = `${crypto.randomUUID()}.${extensions[file.type]}`;
      await remote(`/storage/v1/object/portfolio-assets/${name}`, { method: "POST", body: file, auth: true, headers: { "Content-Type": file.type, "x-upsert": "false" } });
      return { url: `${endpoint}/storage/v1/object/public/portfolio-assets/${name}` };
    }
    if (route === "/api/login") {
      const input = JSON.parse(options.body);
      const result = await remote("/auth/v1/token?grant_type=password", {
        method: "POST",
        body: input,
      });
      accessToken = result.access_token;
      expiresAt = Date.now() + (result.expires_in - 30) * 1000;
      try {
        await requireOwner();
      } catch (error) {
        accessToken = "";
        expiresAt = 0;
        throw error;
      }
      return { csrf: "supabase-bearer-session" };
    }
    if (route === "/api/session") {
      await requireOwner();
      return { csrf: "supabase-bearer-session" };
    }
    if (route === "/api/logout") {
      // Scope logout to this session, never other sessions used by 1t1g.
      try {
        if (accessToken && Date.now() < expiresAt)
          await remote("/auth/v1/logout?scope=local", {
            method: "POST",
            auth: true,
          });
      } finally {
        accessToken = "";
        expiresAt = 0;
      }
      return { ok: true };
    }
    if (route === "/api/posts") {
      try {
        return await remote(
          "/rest/v1/portfolio_journal_summaries?visibility=eq.public&select=*&order=updated.desc,id.asc",
        );
      } catch (error) {
        // Keep existing public entries accessible while the optional summary
        // migration is pending. Do not mask network/authentication failures.
        if (error.status !== 404) throw error;
        return remote(
          table + "?visibility=eq.public&select=*&order=updated.desc,id.asc",
        );
      }
    }
    if (route.startsWith("/api/posts/")) {
      const id = route.slice("/api/posts/".length);
      return remote(
        table +
          "?visibility=eq.public&id=eq." +
          encodeURIComponent(id) +
          "&select=*&limit=1",
      );
    }
    if (route === "/api/admin/submissions" && method === "GET") {
      await requireOwner();
      return remote(
        "/rest/v1/portfolio_journal_submissions?status=eq.pending&select=*&order=created_at.asc",
        { auth: true },
      );
    }
    if (route === "/api/admin/submissions/review")
      return remote("/rest/v1/rpc/portfolio_review_journal", {
        method: "POST",
        auth: true,
        body: JSON.parse(options.body),
      });
    if (route === "/api/admin/posts" && method === "GET") {
      await requireOwner();
      return remote(table + "?select=*&order=updated.desc,id.asc", {
        auth: true,
      });
    }
    if (route === "/api/admin/media") {
      const file = options.body;
      const extensions = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/webp": "webp",
        "video/mp4": "mp4",
        "video/webm": "webm",
      };
      if (!extensions[file.type])
        throw new Error("Choose a PNG, JPEG, WebP, MP4 or WebM file.");
      if (file.size > 20 * 1024 * 1024)
        throw new Error("Choose a file smaller than 20 MB.");
      const image = `portfolio/${crypto.randomUUID()}.${extensions[file.type]}`;
      await remote(`/storage/v1/object/${config.bucket}/${encodePath(image)}`, {
        method: "POST",
        body: file,
        auth: true,
        headers: { "Content-Type": file.type, "x-upsert": "false" },
      });
      return { url: image, type: file.type };
    }
    const match = /^\/api\/admin\/posts(?:\/([\w-]+))?$/.exec(route);
    if (match && ["POST", "PUT", "DELETE"].includes(method)) {
      const filter = match[1] ? "?id=eq." + encodeURIComponent(match[1]) : "";
      if (method === "DELETE") {
        await remote(table + filter, { method: "DELETE", auth: true });
        return { ok: true };
      }
      const input = JSON.parse(options.body),
        post = {};
      for (const key of ["title", "category", "text", "url", "image"])
        post[key] = (input[key] || "").trim();
      post.visibility = input.visibility;
      post.sample = input.sample === true;
      const saved = await remote(table + filter, {
        method: method === "PUT" ? "PATCH" : "POST",
        auth: true,
        body: post,
        headers: { Prefer: "return=representation" },
      });
      if (!saved?.[0])
        throw new Error(
          "Nothing was saved. Check owner permissions and try again.",
        );
      return saved[0];
    }
    throw new Error("Unknown journal operation.");
  }
  async function media(image, owner = false) {
    if (!enabled || image.startsWith("/assets/") || image.startsWith("/media/"))
      return image;
    const result = await remote(
      `/storage/v1/object/sign/${image.startsWith("guest/") ? "portfolio-guest-media" : config.bucket}/${encodePath(image)}`,
      { method: "POST", body: { expiresIn: 60 }, auth: owner },
    );
    if (!result?.signedURL) throw new Error("Attachment unavailable.");
    return endpoint + "/storage/v1" + result.signedURL;
  }
  window.JournalBackend = { enabled, request, media };
})();
