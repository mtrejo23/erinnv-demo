<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	
	let { 
		src, 
		srcset = '',
		sizes = '',
		alt, 
		caption = '',
		onclose, 
		onprev, 
		onnext,
		hasprev = false,
		hasnext = false,
		direction = 'none'
	}: { 
		src: string; 
		srcset?: string;
		sizes?: string;
		alt: string; 
		caption?: string;
		onclose: () => void; 
		onprev?: () => void;
		onnext?: () => void;
		hasprev?: boolean;
		hasnext?: boolean;
		direction?: 'next' | 'prev' | 'none';
	} = $props();
</script>

<div 
	class="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-4"
	onclick={onclose}
	role="dialog"
	aria-modal="true"
	in:fade={{ duration: 200 }}
	out:fade={{ duration: 200 }}
>
	<button class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10" onclick={onclose} aria-label="Close">&times;</button>
	
	{#if hasprev}
		<button 
			class="absolute left-4 text-white text-5xl hover:text-gray-300 p-4 z-10" 
			onclick={(e) => { e.stopPropagation(); onprev?.(); }}
			aria-label="Previous"
		>&#8249;</button>
	{/if}
	
	{#if hasnext}
		<button 
			class="absolute right-4 text-white text-5xl hover:text-gray-300 p-4 z-10" 
			onclick={(e) => { e.stopPropagation(); onnext?.(); }}
			aria-label="Next"
		>&#8250;</button>
	{/if}

	<div class="h-[80vh] w-full flex items-center justify-center overflow-hidden relative mx-16" onclick={(e) => e.stopPropagation()}>
		{#key src + direction}
			<img 
				{src}
				srcset={srcset}
				sizes={sizes}
				{alt} 
				class="max-w-full max-h-[80vh] object-contain absolute"
				loading="eager"
				in:fly={{ x: direction === 'next' ? 300 : direction === 'prev' ? -300 : 0, duration: direction === 'none' ? 0 : 300, easing: cubicOut }}
			/>
		{/key}
	</div>
	
	{#if caption}
		<p class="text-white text-center mt-4 text-sm max-w-2xl">{caption}</p>
	{/if}
</div>
