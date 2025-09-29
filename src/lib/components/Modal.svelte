<script lang="ts">
  import type { Snippet } from 'svelte';

  type ModalProps = {
    children: Snippet;
    onClose?: () => void;
  };

  let { children, onClose }: ModalProps = $props();

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };
</script>

<div
  class="fixed inset-0 z-50 overflow-y-auto"
  onclick={handleOverlayClick}
  onkeydown={(e) => {
    if (e.key === 'Escape' && onClose) onClose();
  }}
  role="presentation"
>
  <div
    class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
  >
    <!-- Background overlay -->
    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
      <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>

    <!-- Centering trick -->
    <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true"
      >&#8203;</span
    >

    <!-- Modal content -->
    <div
      class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      {@render children()}
    </div>
  </div>
</div>
