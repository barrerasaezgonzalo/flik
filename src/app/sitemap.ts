import { getPosts } from "@/lib/posts";
export const contentType = "application/xml";
export default async function sitemap() {
  const posts = await getPosts();

  return posts
    .filter((p) => p.slug) // descarta posts sin slug
    .map((post) => ({
      url: `https://flik.cl/posts/${post.slug}`,
      lastModified: new Date(post.date).toISOString().split("T")[0], // YYYY-MM-DD
    }));
}
