import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: '557pc8xd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);
const projectId = '557pc8xd';
const dataset = 'production';

export function urlFor(source: any) {
  return builder.image(source);
}

export function fileUrl(source: any): string {
  if (!source?.asset?._ref) return '';
  const ref = source.asset._ref;
  const [type, id, extension] = ref.split('-');
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${extension}`;
}

export interface SanityProduct {
  _id: string;
  productName: string;
  slug: { current: string };
  productImages: Array<{
    image: any;
    caption: string;
  }>;
  specifications: Array<{
    width: number;
    depth: number;
    height: number;
  }>;
  finishOptions: Array<{
    finishReference: { _type: 'reference'; _ref: string };
    selectedFinishes: Array<{
      finishName: string;
      enabled: boolean;
    }>;
  }>;
  price: Array<{
    name: string;
    price: string;
  }>;
  tearsheet: any;
  productNotes: Array<{ note: string }>;
  customCharges: any;
  contractQuality: any;
  disclaimer: any;
}

export async function getProducts(): Promise<SanityProduct[]> {
  const query = `*[_type == "products"]{
    _id,
    productName,
    slug,
    productImages,
    specifications,
    finishOptions,
    price,
    tearsheet,
    productNotes,
    customCharges,
    contractQuality,
    disclaimer
  }`;
  return sanityClient.fetch(query);
}

export async function getProductBySlug(slug: string): Promise<SanityProduct | null> {
  const query = `*[_type == "products" && slug.current == $slug][0]{
    _id,
    productName,
    slug,
    productImages,
    specifications,
    finishOptions[]{
      finishReference->{
        title,
        finish[]{
          name,
          image
        }
      },
      selectedFinishes
    },
    price,
    tearsheet,
    productNotes,
    customCharges,
    contractQuality,
    disclaimer
  }`;
  return sanityClient.fetch(query, { slug });
}

export interface FinishItem {
  name: string;
  image: any;
  category: string;
}

const responsiveWidths = [400, 800, 1200, 1600, 2000];

export interface ResponsiveImageOptions {
  source: any;
  defaultWidth?: number;
}

export function srcsetUrl(source: any, width: number): string {
  return builder.image(source).width(width).auto('format').url();
}

export function responsiveSrcset(source: any): string {
  return responsiveWidths.map(w => `${srcsetUrl(source, w)} ${w}w`).join(', ');
}

export function responsiveSizes(): string {
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
}

export function responsiveSizesFinish(): string {
  return '(max-width: 768px) 50vw, 33vw';
}
