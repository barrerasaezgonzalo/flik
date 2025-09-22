import Comments from "@/components/Comments";

export default function FixturesPage() {
  return (
    <div>
      <h1>Fixture de E2E</h1>
      <Comments postId="fake-post" initialComments={[]} />
    </div>
  );
}
