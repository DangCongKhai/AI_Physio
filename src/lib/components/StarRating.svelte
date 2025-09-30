<script lang="ts">
  // Interactive star rating component for input
  type StarRatingProps = {
    rating: number; // Current rating value (0-5)
    interactive?: boolean; // Whether stars are clickable
    size?: 'small' | 'medium' | 'large'; // Size of stars
    showLabel?: boolean; // Show rating number label
    onRatingChange?: (rating: number) => void; // Callback for rating changes
  };

  let {
    rating = 0,
    interactive = false,
    size = 'medium',
    showLabel = false,
    onRatingChange
  }: StarRatingProps = $props();

  let hoveredRating = $state(0);

  // Size classes for stars
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (interactive) {
      hoveredRating = starRating;
    }
  };

  const handleStarLeave = () => {
    if (interactive) {
      hoveredRating = 0;
    }
  };

  // Get the display rating (hovered rating when hovering, otherwise current rating)
  const displayRating = $derived(interactive && hoveredRating > 0 ? hoveredRating : rating);

  // Generate stars array
  const stars = $derived(
    Array.from({ length: 5 }, (_, i) => ({
      index: i + 1,
      filled: i + 1 <= displayRating,
      halfFilled: i + 0.5 < displayRating && i + 1 > displayRating
    }))
  );
</script>

<div class="flex items-center gap-1">
  <!-- Stars -->
  <div class="flex items-center">
    {#each stars as star (star.index)}
      <button
        type="button"
        class="transition-all duration-150 {sizeClasses[size]} {interactive
          ? 'cursor-pointer hover:scale-110'
          : 'cursor-default'}"
        onclick={() => handleStarClick(star.index)}
        onmouseenter={() => handleStarHover(star.index)}
        onmouseleave={handleStarLeave}
        disabled={!interactive}
        aria-label={interactive
          ? `Rate ${star.index} star${star.index > 1 ? 's' : ''}`
          : `${star.index} star rating`}
      >
        {#if star.filled}
          <span class="text-yellow-400">★</span>
        {:else if star.halfFilled}
          <span class="relative">
            <span class="text-gray-300">★</span>
            <span class="absolute inset-0 w-1/2 overflow-hidden text-yellow-400">★</span>
          </span>
        {:else}
          <span class="text-gray-300">☆</span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Rating label -->
  {#if showLabel}
    <span class="ml-2 text-sm text-gray-600">
      {interactive && hoveredRating > 0 ? hoveredRating : rating.toFixed(1)}
      {#if !interactive}
        <span class="text-gray-400">/ 5</span>
      {/if}
    </span>
  {/if}
</div>

<!-- Accessible screen reader text -->
{#if interactive}
  <div class="sr-only" aria-live="polite">
    {hoveredRating > 0
      ? `Hovering over ${hoveredRating} star${hoveredRating > 1 ? 's' : ''}`
      : `Currently rated ${rating} out of 5 stars`}
  </div>
{/if}
