export async function GET() {
  return new Response(
    `User-agent: *
Allow: /
Sitemap: https://flik.cl/sitemap.xml`,
    { headers: { "Content-Type": "text/plain" } },
  );
}
