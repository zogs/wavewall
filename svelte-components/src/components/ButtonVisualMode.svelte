<script>
    import Icon from 'svelte-awesome';
    import { faYinYang } from '@fortawesome/free-solid-svg-icons';
    import {visualMode} from '../stores/AppStore';


    function switchMode() {
        if($visualMode == 'color') $visualMode = 'grayscale';
        else if($visualMode == 'grayscale') $visualMode = 'color';
        window.localStorage.setItem('visualMode', $visualMode);
    }


</script>

<button class="blackandwhite" on:click|stopPropagation={switchMode}>
  <Icon data={faYinYang} scale="3"/>
</button>

<style>
</style>