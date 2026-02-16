<script lang="ts">
	import Lightbox from './Lightbox.svelte';

	function buildSrcset(baseUrl: string, widths: number[]): string {
		return widths.map(w => {
			const separator = baseUrl.includes('?') ? '&' : '?';
			return `${baseUrl}${separator}w=${w} ${w}w`;
		}).join(', ');
	}

	const defaultSrcset = buildSrcset('https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-07-1.jpg', [400, 800, 1200, 1600, 2000]);

	interface Image {
		src: string;
		srcset?: string;
		sizes?: string;
		alt: string;
		caption: string;
	}

	interface Props {
		images?: Image[];
	}

	let { images: propImages }: Props = $props();

	const images = propImages || [
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-07-1.jpg',
			srcset: buildSrcset('https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-07-1.jpg', [400, 800, 1200, 1600, 2000]),
			sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-01-1.jpg',
			srcset: buildSrcset('https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-01-1.jpg', [400, 800, 1200, 1600, 2000]),
			sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-02.jpg',
			srcset: buildSrcset('https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-02.jpg', [400, 800, 1200, 1600, 2000]),
			sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-03.jpg',
			srcset: buildSrcset('https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-03.jpg', [400, 800, 1200, 1600, 2000]),
			sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-04.jpg',
			srcset: buildSrcset('https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-04.jpg', [400, 800, 1200, 1600, 2000]),
			sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-05.jpg',
			srcset: buildSrcset('https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-05.jpg', [400, 800, 1200, 1600, 2000]),
			sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
			alt: 'Kensey Table - Two Drawers',
			caption: 'Shown in Two Drawers in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-06-1.jpg',
			srcset: buildSrcset('https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-06-1.jpg', [400, 800, 1200, 1600, 2000]),
			sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		}
	];

	let selectedIndex = $state<number | null>(null);
	let currentSlide = $state(0);
	let direction = $state<'next' | 'prev' | 'none'>('none');

	function openLightbox(index: number) {
		selectedIndex = index;
		direction = 'none';
	}

	function closeLightbox() {
		selectedIndex = null;
	}

	function prevImage() {
		if (selectedIndex !== null && selectedIndex > 0) {
			direction = 'prev';
			selectedIndex--;
		}
	}

	function nextImage() {
		if (selectedIndex !== null && selectedIndex < images.length - 1) {
			direction = 'next';
			selectedIndex++;
		}
	}

	function prevSlide() {
		direction = 'prev';
		currentSlide = currentSlide > 0 ? currentSlide - 1 : images.length - 1;
	}

	function nextSlide() {
		direction = 'next';
		currentSlide = currentSlide < images.length - 1 ? currentSlide + 1 : 0;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (selectedIndex === null) return;
		if (e.key === 'ArrowLeft') prevImage();
		if (e.key === 'ArrowRight') nextImage();
		if (e.key === 'Escape') closeLightbox();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Mobile Slider -->
<div class="mobile-slider md:hidden">
	<div class="relative">
		<button 
			class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
			onclick={prevSlide}
			aria-label="Previous image"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
		
		<div class="overflow-hidden">
			{#key currentSlide + direction}
				<div class="slider-track" class:slide-left={direction === 'next'} class:slide-right={direction === 'prev'}>
					<button 
						class="w-full cursor-pointer"
						onclick={() => openLightbox(currentSlide)}
					>
						<div class="product-image">
							<img 
								src={images[currentSlide].src} 
								srcset={images[currentSlide].srcset} 
								sizes={images[currentSlide].sizes}
								alt={images[currentSlide].alt} 
								class="w-full h-auto block"
								loading="eager"
							/>
						</div>
						<figcaption class="text-gray-500 text-sm mt-3 leading-relaxed">{images[currentSlide].caption}</figcaption>
					</button>
				</div>
			{/key}
		</div>
		
		<button 
			class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
			onclick={nextSlide}
			aria-label="Next image"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>
	
	<div class="flex justify-center gap-2 mt-4">
		{#each images as _, i}
			<button 
				class="w-2 h-2 rounded-full transition-colors {i === currentSlide ? 'bg-gray-800' : 'bg-gray-300'}"
				onclick={() => { currentSlide = i; direction = 'none'; }}
				aria-label="Go to image {i + 1}"
			></button>
		{/each}
	</div>
</div>

<!-- Desktop Grid -->
<div class="hidden md:grid md:grid-cols-2 gap-8">
	{#each images as image, i}
		<button 
			class="{i === 0 ? 'md:col-span-2' : ''} text-left cursor-pointer"
			onclick={() => openLightbox(i)}
		>
			<div class="product-image">
				<img 
					src={image.src} 
					srcset={image.srcset} 
					sizes={image.sizes}
					alt={image.alt} 
					class="w-full h-auto block hover:opacity-95 transition-opacity" 
					loading={i < 2 ? 'eager' : 'lazy'}
				/>
			</div>
			<figcaption class="text-gray-500 text-sm mt-3 leading-relaxed">{image.caption}</figcaption>
		</button>
	{/each}
</div>

{#if selectedIndex !== null}
	<Lightbox 
		src={images[selectedIndex].src} 
		alt={images[selectedIndex].alt}
		caption={images[selectedIndex].caption}
		onclose={closeLightbox}
		onprev={prevImage}
		onnext={nextImage}
		hasprev={selectedIndex > 0}
		hasnext={selectedIndex < images.length - 1}
		{direction}
	/>
{/if}

<style lang="scss">
	.product-image {
		position: relative;
		display: flex;
		justify-content: center;
		aspect-ratio: 1.58/1;
		overflow: hidden;
		img {
			width: auto;
			max-height: 100%;
		}
	}
	figcaption {
		text-align: center;
	}

	.mobile-slider {
		position: relative;
		
		.slider-track {
			transition: transform 0.3s ease-out;
		}
		
		.slide-left {
			animation: slideInLeft 0.3s ease-out;
		}
		
		.slide-right {
			animation: slideInRight 0.3s ease-out;
		}
	}

	@keyframes slideInLeft {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes slideInRight {
		from {
			transform: translateX(-100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>
