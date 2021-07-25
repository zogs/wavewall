<script>
  import Icon from 'svelte-awesome';
  import { ellipsisH } from 'svelte-awesome/icons';
  import { ellipsisV } from 'svelte-awesome/icons';
  import ButtonVisualMode from './ButtonVisualMode.svelte';
  import { fly } from 'svelte/transition';

  let opened = false;

  function switchMenu() {
    opened = !opened;
  }
</script>

<button class="menu" on:click={switchMenu}>

  {#if opened}<Icon data={ellipsisV} scale="3"/>{:else}<Icon data={ellipsisH} scale="3"/>{/if}
  {#if opened}
  <div class="menu" transition:fly="{{ y: 40, duration: 200 }}">
    <ButtonVisualMode></ButtonVisualMode>
  </div>
  {/if}
</button>

<style>
  button.menu { position:absolute; right: 10px; top:0; }
  div.menu { position: absolute; bottom:100%; width:100%; height:auto; display:flex; flex-direction:column; }
  :global(div.menu button) { margin: 20px 0; }
</style>