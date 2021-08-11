<script>
  import ButtonAddSpot from './ButtonAddSpot.svelte'
  import FaArrowRight from 'svelte-icons/fa/FaArrowRight.svelte'
  import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
  import Icon from 'svelte-awesome';
  import { page, nbPages } from '../stores/AppStore';

  function nextPanel() {
    $page = $page + 1;
  }

  function prevPanel() {
    $page = $page - 1;
  }
</script>


<button class="nav" class:active={$page >= $nbPages} on:click={prevPanel}><FaArrowLeft /></button>

<button class="current-panel">
  <ButtonAddSpot />
 <span class='number'>{$page}</span>
</button>

<button class="nav" class:active={$page < $nbPages} on:click={nextPanel}><FaArrowRight /></button>


<style>
  span.number { font-size: 30px; font-weight:bold; }
  button.nav { opacity: 0.2; pointer-events: none; }
  button.nav.active { opacity: 1; pointer-events: all; }
  :global(button.current-panel > button) { position:absolute; transform: translate(0, -50%) scale(0.5); }
</style>