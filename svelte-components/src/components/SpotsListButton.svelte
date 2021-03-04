<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from 'svelte-awesome';
  import { plusSquare } from 'svelte-awesome/icons';

  const dispatch = createEventDispatcher();

  function openList() {
    dispatch('open-list', {});
  }
</script>


<button  on:click={openList} title="Liste des spots" style='margin-left:auto'>
 <Icon data={plusSquare} scale="4"/>
</button>