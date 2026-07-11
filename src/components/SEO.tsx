import { useEffect } from 'react';

export default function SEO({ title, description, image }: { title?: string; description?: string; image?: string }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} — Khalid Haider Jafri`
      : 'Khalid Haider Jafri — Full-Stack Software Developer';

    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [, name] = selector.match(/\[name="([^"]+)"\]/) || selector.match(/\[property="([^"]+)"\]/) || [];
        if (selector.includes('property')) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    const desc = description || 'Full-Stack Software Developer building scalable web applications, APIs, backend systems, and modern digital experiences.';

    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    if (image) setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', desc);
  }, [title, description, image]);

  return null;
}
