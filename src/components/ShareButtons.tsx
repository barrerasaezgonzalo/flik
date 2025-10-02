import {
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
  FaXTwitter,
} from "react-icons/fa6";
import React from "react";
import ViewsCounter from "./ViewsCounter";
import LikeButton from "@/components/LikeButton";

export function ShareButtons({
  post,
}: {
  post: { slug: string; title: string; id: string };
}) {
  const url = `https://flik.cl/posts/${post.slug}`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const twitterUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Échale un vistazo a este artículo de Flik!")}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent("Échale un vistazo a este artículo de Flik! " + url)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Échale un vistazo a este artículo de Flik!")}`;

  return (
    <div className="mt-10 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 text-center">
      <div className="flex items-center justify-center gap-4 mb-4">
        <LikeButton postId={post.id} />
        <span> | </span>
        <ViewsCounter slug={post.slug} />
      </div>
      <div className="flex justify-center mb-4">
        <p className="text-md font-normal text-gray-900 dark:text-gray-100">
          📢 ¿Te gustó este artículo? ¡Compártelo!
        </p>
      </div>
      <div className="flex items-center justify-center gap-6 mt-6">
        <a
          aria-label="Compartir en LinkedIn"
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white text-sm hover:scale-110  hover:text-[#0A66C2] transition"
        >
          <FaLinkedin className="w-5 h-5" /> LinkedIn
        </a>
        <a
          aria-label="Compartir en X (Twitter)"
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white text-sm hover:scale-110  hover:text-[#1DA1F2] transition"
        >
          <FaXTwitter className="w-5 h-5" /> X
        </a>
        <a
          aria-label="Compartir en WhatsApp"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white text-sm hover:scale-110  hover:text-[#25D366] transition"
        >
          <FaWhatsapp className="w-5 h-5" /> WhatsApp
        </a>
        <a
          aria-label="Compartir en Telegram"
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white text-sm hover:text-[#0088CC] transition"
        >
          <FaTelegram className="w-5 h-5" /> Telegram
        </a>
      </div>
    </div>
  );
}
