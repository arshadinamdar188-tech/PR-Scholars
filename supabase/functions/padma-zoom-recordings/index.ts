import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const VIDEO_BUCKET = "padma-recorded-videos";

interface FinalizeUploadRequest {
  title: string;
  description?: string | null;
  subject: string;
  uploadedBy: string;
  storagePath: string;
  thumbnail?: string | null;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function readUint32(view: DataView, offset: number): number {
  return view.getUint32(offset);
}

function readUint64(view: DataView, offset: number): number {
  const hi = view.getUint32(offset);
  const lo = view.getUint32(offset + 4);
  return hi * 2 ** 32 + lo;
}

function readType(view: DataView, offset: number): string {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3),
  );
}

function getMvhdDurationSeconds(buffer: ArrayBuffer): number | null {
  const view = new DataView(buffer);
  let offset = 0;

  const walkBoxes = (start: number, end: number): { type: string; start: number; size: number }[] => {
    const boxes: { type: string; start: number; size: number }[] = [];
    let cursor = start;

    while (cursor + 8 <= end) {
      const size32 = readUint32(view, cursor);
      const type = readType(view, cursor + 4);
      let size = size32;
      let headerSize = 8;

      if (size32 === 1) {
        if (cursor + 16 > end) break;
        size = readUint64(view, cursor + 8);
        headerSize = 16;
      } else if (size32 === 0) {
        size = end - cursor;
      }

      if (size < headerSize || cursor + size > end) break;

      boxes.push({ type, start: cursor, size });
      cursor += size;
    }

    return boxes;
  };

  const topBoxes = walkBoxes(0, view.byteLength);
  const moov = topBoxes.find((box) => box.type === "moov");
  if (!moov) return null;

  const moovBoxes = walkBoxes(moov.start + 8, moov.start + moov.size);
  const mvhd = moovBoxes.find((box) => box.type === "mvhd");
  if (!mvhd) return null;

  const bodyStart = mvhd.start + 8;
  const version = view.getUint8(bodyStart);

  if (version === 0) {
    const timescale = readUint32(view, bodyStart + 12);
    const duration = readUint32(view, bodyStart + 16);
    if (!timescale) return null;
    return duration / timescale;
  }

  if (version === 1) {
    const timescale = readUint32(view, bodyStart + 20);
    const duration = readUint64(view, bodyStart + 24);
    if (!timescale) return null;
    return duration / timescale;
  }

  return null;
}

function formatDuration(secondsRaw: number): string {
  const totalSeconds = Math.max(1, Math.round(secondsRaw));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

async function downloadWithRetry(
  supabase: ReturnType<typeof createClient>,
  path: string,
  attempts = 5,
): Promise<{ downloaded: Blob | null; errorMessage: string | null }> {
  let lastErrorMessage: string | null = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const { data, error } = await supabase.storage.from(VIDEO_BUCKET).download(path);

    if (data) {
      return { downloaded: data, errorMessage: null };
    }

    lastErrorMessage = error?.message || "Video file not found.";

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }

  return { downloaded: null, errorMessage: lastErrorMessage };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (req.method !== "POST") {
      return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return jsonResponse({ success: false, error: "Server is not configured correctly." }, 500);
    }

    const body = (await req.json()) as FinalizeUploadRequest;
    const title = String(body.title || "").trim();
    const subject = String(body.subject || "").trim();
    const uploadedBy = String(body.uploadedBy || "").trim();
    const storagePath = String(body.storagePath || "").trim();
    const description = String(body.description || "").trim() || null;
    const thumbnail = body.thumbnail ? String(body.thumbnail).trim() : null;

    if (!title || !subject || !uploadedBy || !storagePath) {
      return jsonResponse({ success: false, error: "Missing required fields." }, 400);
    }

    if (!storagePath.toLowerCase().endsWith(".mp4")) {
      return jsonResponse({ success: false, error: "Only MP4 files are supported." }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { downloaded, errorMessage } = await downloadWithRetry(supabase, storagePath);

    if (!downloaded) {
      return jsonResponse({ success: false, error: errorMessage || "Video file not found." }, 404);
    }

    const buffer = await downloaded.arrayBuffer();
    const durationSeconds = getMvhdDurationSeconds(buffer);

    if (!durationSeconds || !Number.isFinite(durationSeconds)) {
      return jsonResponse({ success: false, error: "Could not detect video duration from metadata." }, 422);
    }

    const duration = formatDuration(durationSeconds);

    const { data: inserted, error: insertError } = await supabase
      .from("padma_zoom_recordings")
      .insert({
        title,
        description,
        subject,
        uploaded_by: uploadedBy,
        upload_date: new Date().toISOString(),
        storage_path: storagePath,
        duration,
        thumbnail,
      })
      .select("id, duration")
      .single();

    if (insertError || !inserted) {
      return jsonResponse({ success: false, error: insertError?.message || "Could not save metadata." }, 500);
    }

    return jsonResponse({ success: true, data: inserted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return jsonResponse({ success: false, error: message }, 500);
  }
});
