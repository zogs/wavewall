<script>
    import Icon from 'svelte-awesome';
    import { tint } from 'svelte-awesome/icons';

    export let mode;

    $: console.log(mode)

    $: window.localStorage.setItem('visualMode', mode);

    if(window.localStorage.getItem('visualMode')) {
        mode = window.localStorage.getItem('visualMode');
    }

    function switchMode() {
        if(mode == 'color') mode = 'grayscale';
        else if(mode == 'grayscale') mode = 'color';
    }


</script>

<button class="blackandwhite" on:click={switchMode} style='margin-left:auto'>
  <Icon data={tint} scale="6"/>
</button>