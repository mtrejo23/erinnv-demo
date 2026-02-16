import { getProductBySlug } from '$lib/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const slug = url.searchParams.get('product') || 'kensey-table';
  const product = await getProductBySlug(slug);
  
  return {
    product
  };
}
