<script lang="ts">
	import { fileUrl } from '$lib/sanity';

	interface Props {
		productName?: string;
		specs?: { width: number; depth: number; height: number };
		notes?: string[];
		finishCategories?: string[];
		pricing?: Array<{ name: string; price: string }>;
		tearsheet?: any;
		customCharges?: any;
		contractQuality?: any;
		disclaimer?: any;
	}

	let { 
		productName = 'Product', 
		specs = { width: 0, depth: 0, height: 0 },
		notes = [],
		finishCategories = [],
		pricing = [],
		tearsheet = null,
		customCharges = null,
		contractQuality = null,
		disclaimer = null
	}: Props = $props();

	function getTearsheetUrl() {
		if (!tearsheet?.asset) return null;
		return fileUrl(tearsheet);
	}

	function renderPortableText(content: any): string {
		if (!content) return '';
		if (typeof content === 'string') return content;
		if (Array.isArray(content)) {
			return content.map((block: any) => {
				if (block.children) {
					return block.children.map((child: any) => child.text).join('');
				}
				return '';
			}).join('');
		}
		return '';
	}

	const tearsheetUrl = $derived(getTearsheetUrl());

	function scrollToFinish(category: string) {
		const element = document.getElementById(`finish-${category.toLowerCase()}`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<aside class="space-y-8">
	<div>
		<h1 class="text-4xl font-serif font-normal mb-2">{productName}</h1>
	</div>

	<section class="border-t border-b border-gray-200 py-6">
		<h2 class="font-serif text-xl font-normal mb-3">Specifications</h2>
		<p class="text-base mb-4">
			Width <strong>{specs.width}"</strong>&nbsp;&nbsp;&nbsp;Depth <strong>{specs.depth}"</strong>&nbsp;&nbsp;&nbsp;Height <strong>{specs.height}"</strong>&nbsp;&nbsp;
		</p>
		{#if notes.length > 0}
			<div class="border-t border-gray-200 pt-4">
				<h2 class="font-serif text-xl font-normal mb-3">Product Notes</h2>
				<ul class="list-disc list-inside text-base text-gray-600">
					{#each notes as note}
						<li>{note}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</section>

	{#if finishCategories.length > 0}
		<section class="border-b border-gray-200 pb-6">
			<h2 class="font-serif text-xl font-normal mb-3">Finish Options</h2>
			<div class="flex flex-wrap gap-2">
				{#each finishCategories as category}
					<button 
						onclick={() => scrollToFinish(category)}
						class="px-4 py-2 border border-gray-200 uppercase text-sm tracking-wider hover:border-black transition-colors"
					>
						{category}
					</button>
				{/each}
			</div>
		</section>
	{/if}

	{#if pricing.length > 0}
		<section class="border-b border-gray-200 pb-6">
			<h2 class="font-serif text-xl font-normal mb-3">Pricing</h2>
			<ul class="space-y-1">
				{#each pricing as p}
					<li class="text-base">{p.name}: <strong>{p.price}</strong></li>
				{/each}
			</ul>
		</section>
	{/if}

	<section>
		<a href="/register" class="text-black underline hover:text-gray-600">Register to view pricing and our lookbook</a>
	</section>

	<section class="flex flex-wrap gap-4">
		{#if tearsheetUrl}
			<a href={tearsheetUrl} download class="px-6 py-3 border border-black text-black uppercase text-sm tracking-wider hover:bg-black hover:text-white transition-colors">
				Download tearsheet
			</a>
		{/if}
		<a href="/showrooms" class="px-6 py-3 border border-black text-black uppercase text-sm tracking-wider hover:bg-black hover:text-white transition-colors">
			Find Your Showroom
		</a>
		<button class="px-6 py-3 bg-black text-white border border-black uppercase text-sm tracking-wider hover:bg-transparent hover:text-black transition-colors">
			Request a quote
		</button>
	</section>

	{#if customCharges || contractQuality || disclaimer}
		<section class="border-t border-gray-200 pt-8">
			{#if customCharges}
				<h3 class="font-serif text-base font-semibold mb-2">Custom Charges</h3>
				<div class="text-gray-600 text-sm mb-4">{@html renderPortableText(customCharges)}</div>
			{/if}

			{#if contractQuality}
				<h3 class="font-serif text-base font-semibold mb-2">Contract Quality</h3>
				<div class="text-gray-600 text-sm mb-4">{@html renderPortableText(contractQuality)}</div>
			{/if}

			{#if disclaimer}
				<p class="text-gray-500 text-xs leading-relaxed">{@html renderPortableText(disclaimer)}</p>
			{/if}
		</section>
	{/if}
</aside>
