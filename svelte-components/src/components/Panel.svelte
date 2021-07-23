<script>
  import { onMount } from "svelte";

  let days = [];

  onMount(() => {

    days.push("Aujourd'hui");
    days.push("Demain");

    let today = new Date();
    for (let i = 2; i < 7; i++) {
      let date = addDays(today, i);
      let label = date.toLocaleDateString(undefined, {weekday: 'long'})
      days.push(label);
    }
    days = days;

  });

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
</script>

<div class="panel">
  <header class="dates">
    {#each days as label}
    <div>{ label }</div>
    {/each}
  </header>
  <slot></slot>
</div>

<style>
  .panel { display:flex; height:100%; flex-wrap:nowrap; flex-direction:column; justify-content:flex-start; }
  header.dates { display: flex; color:#fff; width:100%; flex-direction:row; justify-content: stretch; align-items: center; height: 30px;}
  header.dates div { width:100%; text-align:center; font-size: 10px; text-transform:uppercase; }
</style>