import { BetaAnalyticsDataClient } from "@google-analytics/data";

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: (process.env.GA_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  },
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) return Response.json({ views: 0 });

  try {
    const [report] = await client.runReport({
      property: `properties/${process.env.GA_PROPERTY_ID}`,
      dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            value: `/posts/${slug}`,
            matchType: "BEGINS_WITH",
          },
        },
      },
    });

    const views: string = report.rows?.[0]?.metricValues?.[0]?.value ?? "0";
    return Response.json({ views });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("GA Error:", err);

    return new Response(
      JSON.stringify({ error: err?.message || "GA failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
