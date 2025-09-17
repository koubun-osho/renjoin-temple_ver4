/**
 * JSON-LD構造化データの型定義
 * SEO向上とGoogle検索結果の最適化のための型安全性を確保
 */

// 基本的なThing型
interface Thing {
  "@type": string;
  name?: string;
  description?: string;
  url?: string;
  image?: string | string[];
}

// Organization型
export interface Organization extends Thing {
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  address?: PostalAddress;
  contactPoint?: ContactPoint[];
  sameAs?: string[];
}

// PostalAddress型
export interface PostalAddress {
  "@type": "PostalAddress";
  addressCountry: string;
  addressRegion: string;
  addressLocality: string;
  streetAddress: string;
  postalCode: string;
}

// ContactPoint型
export interface ContactPoint {
  "@type": "ContactPoint";
  telephone?: string;
  email?: string;
  contactType: string;
  availableLanguage?: string[];
}

// WebPage型
export interface WebPage extends Thing {
  "@type": "WebPage";
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf?: WebSite;
  breadcrumb?: BreadcrumbList;
}

// WebSite型
export interface WebSite extends Thing {
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  inLanguage: string;
  publisher?: Organization;
}

// BreadcrumbList型
export interface BreadcrumbList {
  "@type": "BreadcrumbList";
  itemListElement: ListItem[];
}

// ListItem型
export interface ListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item?: string;
}

// Event型
export interface Event extends Thing {
  "@type": "Event";
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: Place | string;
  organizer?: Organization;
  eventStatus?: string;
  eventAttendanceMode?: string;
}

// Place型
export interface Place extends Thing {
  "@type": "Place";
  name: string;
  address?: PostalAddress;
  geo?: GeoCoordinates;
}

// GeoCoordinates型
export interface GeoCoordinates {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
}

// BlogPosting型
export interface BlogPosting extends Thing {
  "@type": "BlogPosting";
  headline: string;
  description: string;
  author?: Organization | Person;
  datePublished: string;
  dateModified?: string;
  publisher?: Organization;
  mainEntityOfPage?: string;
}

// Person型
export interface Person extends Thing {
  "@type": "Person";
  name: string;
  email?: string;
  jobTitle?: string;
  worksFor?: Organization;
}

// JSON-LDのルート構造
export interface JsonLd {
  "@context": string;
  "@graph"?: (Organization | WebPage | WebSite | BreadcrumbList | Event | Place | BlogPosting | Person)[];
}

// 単一のJSON-LDオブジェクト
export type JsonLdObject = Organization | WebPage | WebSite | BreadcrumbList | Event | Place | BlogPosting | Person;

// ページ固有のJSON-LD型
export interface PageJsonLd extends JsonLd {
  "@context": "https://schema.org";
  "@graph": [WebSite, Organization, WebPage, BreadcrumbList];
}

// イベントページ用のJSON-LD型
export interface EventPageJsonLd extends JsonLd {
  "@context": "https://schema.org";
  "@graph": [WebSite, Organization, WebPage, BreadcrumbList, ...Event[]];
}

// ブログ投稿用のJSON-LD型
export interface BlogPostJsonLd extends JsonLd {
  "@context": "https://schema.org";
  "@graph": [WebSite, Organization, WebPage, BreadcrumbList, BlogPosting];
}