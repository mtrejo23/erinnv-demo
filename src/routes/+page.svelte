<script lang="ts">
	import ProductGallery from '$lib/components/ProductGallery.svelte';
	import ProductSidebar from '$lib/components/ProductSidebar.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import { urlFor, responsiveSrcset, srcsetUrl } from '$lib/sanity';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	
	let selectedFinishIndex = $state<number | null>(null);
	let selectedFinishCategory = $state<string>('');
	let finishDirection = $state<'next' | 'prev' | 'none'>('none');

	function getImages() {
		if (!data.product?.productImages) return [];
		return data.product.productImages.map((img: any) => ({
			src: img.image ? urlFor(img.image).width(1200).url() : '',
			srcset: img.image ? responsiveSrcset(img.image) : '',
			sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
			alt: img.caption || '',
			caption: img.caption || ''
		}));
	}

	function getFinishImages() {
		if (!data.product?.finishOptions) return [];
		const finishes: Array<{ name: string; image: string; srcset: string; sizes: string; category: string }> = [];
		data.product.finishOptions.forEach((opt: any) => {
			const finishCollection = opt.finishReference;
			const collectionTitle = finishCollection?.title?.toLowerCase() || '';
			if (finishCollection?.finish) {
				finishCollection.finish.forEach((f: any) => {
					const selected = opt.selectedFinishes?.find((s: any) => s.finishName === f.name);
					if (!selected || selected.enabled !== false) {
						const category = getCategory(f.name, collectionTitle);
						finishes.push({ 
							name: f.name, 
							image: f.image ? urlFor(f.image).width(1200).url() : '',
							srcset: f.image ? responsiveSrcset(f.image) : '',
							sizes: '(max-width: 768px) 50vw, 33vw',
							category
						});
					}
				});
			}
		});
		return finishes;
	}

	function getCategory(name: string, collectionTitle: string): string {
		const n = name.toLowerCase();
		const title = collectionTitle;
		
		if (title.includes('oak') || n.includes('oak')) return 'Oak';
		if (title.includes('walnut') || n.includes('walnut')) return 'Walnut';
		if (title.includes('lacquer') || n.includes('lacquer')) return 'Lacquer';
		if (title.includes('leaf') || n.includes('leaf')) return 'Leaf';
		return 'Other';
	}

	function getFinishesByCategory(finishes: Array<{ name: string; image: string; srcset: string; sizes: string; category: string }>) {
		return {
			Oak: finishes.filter(f => f.category === 'Oak'),
			Walnut: finishes.filter(f => f.category === 'Walnut'),
			Lacquer: finishes.filter(f => f.category === 'Lacquer'),
			Leaf: finishes.filter(f => f.category === 'Leaf')
		};
	}

	function getFinishCategories() {
		const categories: string[] = [];
		if (finishesByCategory.Oak.length > 0) categories.push('Oak');
		if (finishesByCategory.Walnut.length > 0) categories.push('Walnut');
		if (finishesByCategory.Lacquer.length > 0) categories.push('Lacquer');
		if (finishesByCategory.Leaf.length > 0) categories.push('Leaf');
		return categories;
	}

	function getPricing() {
		if (!data.product?.price) return [];
		return data.product.price.map((p: any) => ({ name: p.name, price: p.price }));
	}

	function getProductNotes() {
		if (!data.product?.productNotes) return [];
		return data.product.productNotes.map((n: any) => n.note).filter(Boolean);
	}

	function getSpecs() {
		if (!data.product?.specifications?.[0]) return { width: 0, depth: 0, height: 0 };
		const spec = data.product.specifications[0];
		return {
			width: spec.width,
			depth: spec.depth,
			height: spec.height
		};
	}

	function openFinishLightbox(category: string, index: number) {
		selectedFinishCategory = category;
		selectedFinishIndex = index;
		finishDirection = 'none';
	}

	function closeFinishLightbox() {
		selectedFinishIndex = null;
		selectedFinishCategory = '';
	}

	function prevFinish() {
		if (selectedFinishIndex === null || !selectedFinishCategory) return;
		const categoryFinishes = finishesByCategory[selectedFinishCategory as keyof typeof finishesByCategory];
		finishDirection = 'prev';
		if (selectedFinishIndex > 0) {
			selectedFinishIndex = selectedFinishIndex - 1;
		} else {
			selectedFinishIndex = categoryFinishes.length - 1;
		}
	}

	function nextFinish() {
		if (selectedFinishIndex === null || !selectedFinishCategory) return;
		const categoryFinishes = finishesByCategory[selectedFinishCategory as keyof typeof finishesByCategory];
		finishDirection = 'next';
		if (selectedFinishIndex < categoryFinishes.length - 1) {
			selectedFinishIndex = selectedFinishIndex + 1;
		} else {
			selectedFinishIndex = 0;
		}
	}

	function handleFinishKeydown(e: KeyboardEvent) {
		if (selectedFinishIndex === null) return;
		if (e.key === 'ArrowLeft') prevFinish();
		if (e.key === 'ArrowRight') nextFinish();
		if (e.key === 'Escape') closeFinishLightbox();
	}

	const images = $derived(getImages());
	const finishImages = $derived(getFinishImages());
	const specs = $derived(getSpecs());
	const finishes = $derived(getFinishImages());
	const finishesByCategory = $derived(getFinishesByCategory(finishImages));
	const finishCategories = $derived(getFinishCategories());
	const pricing = $derived(getPricing());
	const productNotes = $derived(getProductNotes());
	const tearsheet = $derived(data.product?.tearsheet || null);
	const customCharges = $derived(data.product?.customCharges || null);
	const contractQuality = $derived(data.product?.contractQuality || null);
	const disclaimer = $derived(data.product?.disclaimer || null);

	const currentFinish = $derived(
		selectedFinishIndex !== null && selectedFinishCategory 
			? finishesByCategory[selectedFinishCategory as keyof typeof finishesByCategory][selectedFinishIndex] 
			: null
	);
	const hasPrevFinish = $derived(
		selectedFinishIndex !== null && selectedFinishCategory
			? finishesByCategory[selectedFinishCategory as keyof typeof finishesByCategory].length > 1
			: false
	);
	const hasNextFinish = $derived(hasPrevFinish);
</script>

<svelte:head>
	<title>{data.product?.productName || 'Erinn V.'}</title>
</svelte:head>

<svelte:window onkeydown={handleFinishKeydown} />

<main class="px-4 sm:px-6 lg:px-8 py-8">
	{#if data.product}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2">
				<ProductGallery {images} />
			</div>
			<div class="lg:col-span-1">
				<ProductSidebar 
					productName={data.product.productName} 
					{specs}
					notes={productNotes}
					{finishCategories}
					{pricing}
					{tearsheet}
					{customCharges}
					{contractQuality}
					{disclaimer}
				/>
			</div>
		</div>

		{#if finishImages.length > 0}
			<div class="mt-16">
				<h2 class="font-serif text-2xl font-normal mb-8">Finish Options</h2>
				
				{#each Object.entries(finishesByCategory) as [category, categoryFinishes]}
					{#if categoryFinishes.length > 0}
						<div id="finish-{category.toLowerCase()}" class="mb-8">
							<h3 class="font-serif text-xl font-normal mb-4">{category}</h3>
							<div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4">
								{#each categoryFinishes as finish, index}
									<button class="text-center cursor-pointer" onclick={() => openFinishLightbox(category, index)}>
										{#if finish.image}
											<img src={finish.image} srcset={finish.srcset} sizes={finish.sizes} alt={finish.name} class="w-full aspect-square object-cover border border-gray-200 hover:opacity-90 transition-opacity" loading="lazy" />
										{:else}
											<div class="w-full aspect-square bg-gray-100 border border-gray-200"></div>
										{/if}
										<p class="text-xs uppercase mt-2 text-center">{finish.name}</p>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	{:else}
		<div class="text-center py-20">
			<h1 class="text-2xl font-serif">No product found</h1>
		</div>
	{/if}
</main>

{#if currentFinish}
	<Lightbox 
		src={currentFinish.image}
		srcset={currentFinish.srcset}
		sizes={currentFinish.sizes}
		alt={currentFinish.name}
		caption={currentFinish.name}
		onclose={closeFinishLightbox}
		onprev={prevFinish}
		onnext={nextFinish}
		hasprev={hasPrevFinish}
		hasnext={hasNextFinish}
		direction={finishDirection}
	/>
{/if}
