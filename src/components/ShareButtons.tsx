import {
  FaLinkedin,
  FaWhatsapp,
  FaReddit,
  FaTelegram,
  FaXTwitter,
} from "react-icons/fa6";

export function ShareButtons({
  post,
}: {
  post: { slug: string; title: string };
}) {
  const url = `https://flik.cl/posts/${post.slug}`;
  const text = `${post.title} ${url}`;

  return (
    <div className="mt-10 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 text-center">
      <p className="mb-3 font-medium">
        📢 ¿Te gustó este artículo? ¡Compártelo!
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-700 hover:underline hover:scale-110 transition"
        >
          <FaLinkedin className="w-5 h-5" /> LinkedIn
        </a>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-green-600 hover:underline hover:scale-110 transition"
        >
          <FaWhatsapp className="w-5 h-5" /> WhatsApp
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white hover:underline hover:scale-110 transition"
        >
          <FaXTwitter className="w-5 h-5" /> X
        </a>

        {/* Reddit */}
        <a
          href={`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-orange-600 hover:underline hover:scale-110 transition"
        >
          <FaReddit className="w-5 h-5" /> Reddit
        </a>

        {/* Telegram */}
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sky-500 hover:underline hover:scale-110 transition"
        >
          <FaTelegram className="w-5 h-5" /> Telegram
        </a>
      </div>
    </div>
  );
}
