// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import { remarkLazyLoadImages } from "./src/utils/remarkLazyLoadImages.mjs";
import { SITE } from "./src/config";
import AstroPWA from "@vite-pwa/astro";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  trailingSlash: "never",
  markdown: {
    remarkPlugins: [
      remarkToc,
      // @ts-ignore - TypeScript has issues with remark plugin tuple syntax
      [remarkCollapse, { test: "Table of contents" }],
      remarkLazyLoadImages
    ],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },
  integrations: [
    mdx(),
	    sitemap({
	      filter: (page) => {
	        if (!SITE.showArchives && page.endsWith("/archives")) return false;
        return true;
      },
	      serialize: (item) => {
	        if (item.url.endsWith('/') && item.url !== SITE.website + '/') {
	          item.url = item.url.slice(0, -1);
	        }

	        const url = item.url;

	        item.changefreq = ChangeFreqEnum.MONTHLY;
	        item.priority = 0.5;

	        if (url === SITE.website || url === SITE.website + '/') {
	          item.priority = 1.0;
	          item.changefreq = ChangeFreqEnum.DAILY;
	          item.lastmod = new Date().toISOString();
	        }
	        else if (url.endsWith('/posts') || url.endsWith('/about') || url.endsWith('/search') || url.endsWith('/services') || url.endsWith('/contact')) {
	          item.priority = 0.9;
	          item.changefreq = ChangeFreqEnum.WEEKLY;
	        }
	        else if (url.includes('/posts/2025') || url.includes('/posts/2024') || url.includes('/posts/2026')) {
	          item.priority = 0.8;
	          item.changefreq = ChangeFreqEnum.WEEKLY;
	        }
	        else if (url.includes('/posts/2023') || url.includes('/posts/2022') ||
	                 url.includes('/posts/2021') || url.includes('/posts/2020')) {
	          item.priority = 0.6;
	          item.changefreq = ChangeFreqEnum.MONTHLY;
	        }
	        else if (url.includes('/posts/201')) {
	          item.priority = 0.4;
	          item.changefreq = ChangeFreqEnum.YEARLY;
	        }
	        else if (url.includes('/tags/')) {
	          item.priority = 0.1;
	          item.changefreq = ChangeFreqEnum.YEARLY;
	        }
	        else if (url.match(/\/page\/\d+$/)) {
	          item.priority = 0.4;
	          item.changefreq = ChangeFreqEnum.WEEKLY;
	        }

        return item;
      }
    }),
    react(),
    AstroPWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "daz.jpg"],
      manifest: {
        name: "Darryl Munro",
        short_name: "darrylmunro",
        description: SITE.desc,
        theme_color: "#191918",
        background_color: "#191918",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "favicon.ico",
            sizes: "48x48",
            type: "image/x-icon",
          },
          {
            src: "daz.jpg",
            sizes: "192x192",
            type: "image/jpeg",
            purpose: "any",
          },
          {
            src: "daz.jpg",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/404",
        globPatterns: ["**/*.{css,js,html,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
        navigateFallbackAllowlist: [/^\//],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
