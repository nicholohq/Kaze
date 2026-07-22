<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<div class="koshi-banner {className}">
  <div class="koshi-banner__bg" aria-hidden="true">
    <div class="koshi-banner__bars">
      {#each Array(32) as _, i (i)}
        <span class="bar" style="--i:{i}" aria-hidden="true"></span>
      {/each}
    </div>
    <div class="koshi-banner__glow" aria-hidden="true"></div>
  </div>
</div>

<style>
  .koshi-banner { width: 100%; height: 220px; overflow: hidden; position: relative; }
  .koshi-banner__bg {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, var(--wave-deep) 0%, var(--koshi) 50%, var(--engawa) 100%);
    display: flex; align-items: center; justify-content: center;
  }
  .koshi-banner__bars {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    gap: 6px;
    padding: 0 10%;
  }
  .bar {
    flex: 1; max-width: 14px; height: 80%;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.08) 0%,
      rgba(255,255,255,0.14) 40%,
      rgba(255,255,255,0.06) 100%
    );
    border-radius: 2px;
    transform: scaleY(0.92);
    transition: transform 0.3s ease;
  }
  .bar:nth-child(odd) { height: 72%; }
  .bar:nth-child(3n+1) { height: 66%; }
  .bar:nth-child(5n+2) { height: 78%; }
  .bar:nth-child(7n+4) { height: 85%; }
  .koshi-banner__glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 50% 60% at 50% 50%, rgba(197,160,89,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
</style>
