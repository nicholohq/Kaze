<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<svg viewBox="0 0 60 60" class={className} preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <g id="koshi-bar">
      <rect x="0" y="0" width="6" height="60" fill="currentColor" opacity="0.25" />
      <rect x="10" y="0" width="4" height="60" fill="currentColor" opacity="0.15" />
      <rect x="16" y="0" width="8" height="60" fill="currentColor" opacity="0.2" />
      <rect x="28" y="0" width="4" height="60" fill="currentColor" opacity="0.12" />
    </g>
  </defs>
  <rect width="60" height="60" fill="none" />
  <use href="#koshi-bar" x="0" y="0" />
  <use href="#koshi-bar" x="30" y="0" />
  <use href="#koshi-bar" x="0" y="60" />
  <use href="#koshi-bar" x="30" y="60" />
</svg>
