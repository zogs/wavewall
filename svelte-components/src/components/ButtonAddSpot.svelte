<script>
  import Icon from 'svelte-awesome';
  import { plus } from 'svelte-awesome/icons';
  import { modal } from '../stores/AppStore';

  function openList() {
    $modal = 'spots_list';
  }
</script>


<button  on:click={openList} title="Liste des spots">
 <Icon data={plus} scale="3"/>
</button>