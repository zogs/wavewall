<script>

</script>

<div class="toolbar-bottom">
  <slot></slot>
</div>

<style>
  .toolbar-bottom { position: fixed; z-index:10; bottom:0; width:100%; padding: 10px 80px; display: flex; justify-content: center; }
  :global(.toolbar-bottom button) { padding:10px; background:black; width:70px; height:70px; margin: 0 5px; border:0; border-radius:100%; cursor:pointer; color:#ddd; border:3px solid rgba(255,255,255,0.8); outline:none; display:flex; justify-content: center; align-items: center; }

</style>