<script>

  import { onMount } from 'svelte';
  import Loader from './Loader.svelte';

  export let name;
  export let url;
  export let reload;

  let _content = null;

  // on mount, fetch the image
  onMount(async() => {
    fetchImage();
  });

  // on reload request, re-fetch the image
  $: {
    fetchImage(reload);
  }


  async function fetchImage() {
    _content = null;
    const res = await fetch('/fetch?url='+encodeURI(url));
    const html = await res.text();
    _content = html;
  }

</script>

<div class="surfometer">
  {#if _content == null }<div class="loader"><Loader></Loader></div>{/if}
  <div class="spotname">{ name }</div>
  <div class="container">
    {@html _content }
  </div>
</div>

<style>

</style>