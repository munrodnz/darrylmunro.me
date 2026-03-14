// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

interface SocialLink {
  href: string;
  label: string;
}

interface Site {
  website: string;
  author: string;
  profile: string;
  desc: string;
  title: string;
  ogImage: string;
  lightAndDarkMode: boolean;
  postPerIndex: number;
  postPerPage: number;
  scheduledPostMargin: number;
  showArchives: boolean;
  showBackButton: boolean;
  editPost: {
    enabled: boolean;
    text: string;
    url: string;
  };
  dynamicOgImage: boolean;
  lang: string;
  timezone: string;
}

// Site configuration
export const SITE: Site = {
  website: "https://darrylmunro.me/",
  author: "Darryl Munro",
  profile: "https://darrylmunro.me/about",
  desc: "Strong opinions, loosely held. Enterprise architecture, AI, neurodiversity, and pragmatic human systems.",
  title: "Darryl Munro",
  ogImage: "darryl-avatar.jpg",
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: false,
  showBackButton: false,
  editPost: {
    enabled: false,
    text: "Edit on GitHub",
    url: "https://github.com/munrodnz/darrylmunro.me/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en",
  timezone: "Pacific/Auckland",
};

export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.desc;

// Navigation links
export const NAV_LINKS: SocialLink[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/posts",
    label: "Writing",
  },
  {
    href: "/podcast",
    label: "Podcast",
  },
  {
    href: "/services",
    label: "Services",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

// Social media links
export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://github.com/munrodnz",
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/darryl-munro",
    label: "LinkedIn",
  },
  {
    href: "https://x.com/munrod10",
    label: "X",
  },
  {
    href: "/rss.xml",
    label: "RSS",
  },
];

// Icon map for social media
export const ICON_MAP: Record<string, string> = {
  GitHub: "github",
  Twitter: "twitter",
  BlueSky: "bsky",
  RSS: "rss",
  Email: "mail",
  LinkedIn: "linkedin",
  X: "twitter",
};
