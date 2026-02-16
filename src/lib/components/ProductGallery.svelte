<script lang="ts">
	import Lightbox from './Lightbox.svelte';

	interface Image {
		src: string;
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
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-01-1.jpg',
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-02.jpg',
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-03.jpg',
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-04.jpg',
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-05.jpg',
			alt: 'Kensey Table - Two Drawers',
			caption: 'Shown in Two Drawers in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		},
		{
			src: 'https://wp.erinnv.com/wp-content/uploads/2021/07/kensey-table-06-1.jpg',
			alt: 'Kensey Table - Smoked Silver Leaf',
			caption: 'Shown in Smoked Silver Leaf with Antiqued Drawer Front Detail, Hand Hammered Polished Nickel Pull'
		}
	];

	let selectedIndex = $state<number | null>(null);
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

	function handleKeydown(e: KeyboardEvent) {
		if (selectedIndex === null) return;
		if (e.key === 'ArrowLeft') prevImage();
		if (e.key === 'ArrowRight') nextImage();
		if (e.key === 'Escape') closeLightbox();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
	{#each images as image, i}
		<button 
			class="{i === 0 ? 'md:col-span-2' : ''} text-left cursor-pointer"
			onclick={() => openLightbox(i)}
		>
			<div class="product-image">
				<img src={image.src} alt={image.alt} class="w-full h-auto block hover:opacity-95 transition-opacity" />
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
</style>
