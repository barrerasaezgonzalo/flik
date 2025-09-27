export async function GET() {
  return new Response(
    `User-agent: *
Allow: /
Sitemap: https://flik.cl/sitemap.xml`,
    {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-transform",
        "X-Robots-Tag": "noai, noimageai",
      },
    },
  );
}
