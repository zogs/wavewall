<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from 'svelte-awesome';
  import { plus } from 'svelte-awesome/icons';

  const dispatch = createEventDispatcher();

  function openList() {
    dispatch('open-list', {});
  }
</script>


<button  on:click={openList} title="Liste des spots">
 <Icon data={plus} scale="3"/>
</button>