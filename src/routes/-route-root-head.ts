import type { JSX } from "react"
import { isProduction } from "#/utils/environment"
import { BASE_URL } from "#/utils/url"
import CSS from "#/styles/global.css?url"

interface LinkTagGroups {
  app: LinkTags
  favicon: LinkTags
  fonts: LinkTags
  stylesheets: LinkTags
}

type LinkTags = JSX.IntrinsicElements["link"][]

interface MetaTagGroups {
  app: MetaTags
  document: MetaTags
  openGraph: MetaTags
  twitter: MetaTags
}

type MetaTags = JSX.IntrinsicElements["meta"][]

interface RouteRootHead {
  links?: LinkTags
  meta?: MetaTags
}

const LINK_TAGS: LinkTagGroups = {
  app: [
    {
      href: "/assets/pwa/apple-touch-icon.png",
      rel: "apple-touch-icon",
    },
  ],
  favicon: [
    {
      href: isProduction ? "/favicon/production.ico" : "/favicon/development.ico",
      rel: "icon",
      type: "image/x-icon",
    },
  ],
  fonts: [
    /*
        Preload critical fonts to avoid FOUT and reduce layout shift on first paint

        See:
        - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload
        - https://web.dev/articles/preload-critical-assets
    */
    {
      as: "font",
      crossOrigin: "anonymous",
      href: "/fonts/body.woff2",
      rel: "preload",
      type: "font/woff2",
    },
    {
      as: "font",
      crossOrigin: "anonymous",
      href: "/fonts/code.woff2",
      rel: "preload",
      type: "font/woff2",
    },
    {
      as: "font",
      crossOrigin: "anonymous",
      href: "/fonts/heading.woff2",
      rel: "preload",
      type: "font/woff2",
    },
  ],
  stylesheets: [
    {
      href: CSS,
      rel: "stylesheet",
    },
  ],
}

const META = {
  DESCRIPTION: "Test",
  IMAGE_ALT: "Test",
  IMAGE_URL: `${BASE_URL}/assets/og-image.png`,
  TITLE: "Test",
  URL: BASE_URL,
}

const META_TAGS: MetaTagGroups = {
  app: [
    {
      content: "#e93d82",
      name: "theme-color",
    },
    {
      content: "yes",
      name: "mobile-web-app-capable",
    },
    {
      content: "yes",
      name: "apple-mobile-web-app-capable",
    },
    {
      content: "Donut",
      name: "apple-mobile-web-app-title",
    },
  ],
  document: [
    {
      charSet: "utf8",
    },
    {
      content: META.DESCRIPTION,
      name: "description",
    },
    {
      content: "initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width",
      name: "viewport",
    },
    {
      title: META.TITLE,
    },
  ],
  openGraph: [
    {
      content: META.DESCRIPTION,
      property: "og:description",
    },
    {
      content: META.IMAGE_URL,
      property: "og:image",
    },
    {
      content: META.IMAGE_ALT,
      property: "og:image:alt",
    },
    {
      content: "538",
      property: "og:image:height",
    },
    {
      content: "1024",
      property: "og:image:width",
    },
    {
      content: "Donut",
      property: "og:site_name",
    },
    {
      content: META.TITLE,
      property: "og:title",
    },
    {
      content: "website",
      property: "og:type",
    },
    {
      content: META.URL,
      property: "og:url",
    },
  ],
  twitter: [
    {
      content: "summary_large_image",
      name: "twitter:card",
    },
    {
      content: META.DESCRIPTION,
      name: "twitter:description",
    },
    {
      content: META.IMAGE_URL,
      name: "twitter:image",
    },
    {
      content: META.IMAGE_ALT,
      name: "twitter:image:alt",
    },
    {
      content: META.TITLE,
      name: "twitter:title",
    },
  ],
}

export function RouteRootHead(): RouteRootHead {
  return {
    links: [...LINK_TAGS.fonts, ...LINK_TAGS.stylesheets, ...LINK_TAGS.favicon, ...LINK_TAGS.app],
    meta: [...META_TAGS.document, ...META_TAGS.app, ...META_TAGS.openGraph, ...META_TAGS.twitter],
  }
}
