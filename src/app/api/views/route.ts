export const runtime = "nodejs"; // GA NO funciona en edge

import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Normaliza GA_PRIVATE_KEY para ambos formatos:
// - multilínea tal cual (A)  -> solo convierte CRLF a LF
// - una línea con '\n' (B)   -> convierte '\n' literales a saltos reales
function resolvePrivateKey(raw?: string) {
  if (!raw) return "";
  const v = raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
  return v.replace(/\r\n/g, "\n");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ views: 0 });

  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const propertyId = process.env.GA_PROPERTY_ID;
  const privateKey = resolvePrivateKey(process.env.GA_PRIVATE_KEY);

  if (!clientEmail || !privateKey || !propertyId) {
    // No exponer secretos; solo booleans
    console.error(
      "GA envs missing ->",
      "email:",
      !!clientEmail,
      "key:",
      !!privateKey,
      "pid:",
      !!propertyId,
    );
    return NextResponse.json(
      {
        error:
          "GA envs missing (GA_CLIENT_EMAIL / GA_PRIVATE_KEY / GA_PROPERTY_ID)",
      },
      { status: 500 },
    );
  }

  try {
    const client = new BetaAnalyticsDataClient({
      credentials: { client_email: clientEmail, private_key: privateKey },
    });

    const [report] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { value: `/posts/${slug}`, matchType: "BEGINS_WITH" },
        },
      },
    });

    const views = report.rows?.[0]?.metricValues?.[0]?.value ?? "0";
    return NextResponse.json({ views });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "GA failed";
    console.error("GA Error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
