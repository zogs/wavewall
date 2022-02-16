<script>

  export let width = 800;
  export let height = 800;

  const foamDuration = 2;
  const foamCount = 4;

  const shineDuration = 2;
  const shineCount = 4;

  const reflectDuration = 2.5;
  const reflectCount = 7;

</script>

<div>
  <svg xmlns="http://www.w3.org/2000/svg" width="{width}px" height="{height}px" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid" transform="rotate(0)">
    <defs>
      <filter id="contourFilter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
        <feTurbulence type="turbulence" baseFrequency="0.01 0.05" numOctaves="2" seed="2" stitchTiles="noStitch" result="turbulence"/>
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="20" xChannelSelector="G" yChannelSelector="A" result="displacementMap"/>
      </filter>
      <filter id="turbulenceFilter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
        <feTurbulence type="turbulence" baseFrequency="0.01 0.05" numOctaves="2" seed="2" stitchTiles="noStitch" result="turbulence"/>
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" xChannelSelector="G" yChannelSelector="A" result="displacementMap"/>
      </filter>
      <filter id="flouFilter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
        <feGaussianBlur stdDeviation="10 10" x="0%" y="0%" width="100%" height="100%" in="blur" edgeMode="none" result="blur1"/>
      </filter>
      <linearGradient id="GradientBackgroup" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#c0d4ab"/>
        <stop offset="18%" stop-color="#f7f8bb"/>
        <stop offset="30%" stop-color="#e5c483"/>
        <stop offset="31%" stop-color="#3ab4d5" />
        <stop offset="58%" stop-color="#1f6074"/>
        <stop offset="100%" stop-color="#51c0cf"/>
      </linearGradient>
      <linearGradient id="GradientWave" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#189fb3"/>
        <stop offset="100%" stop-color="#60bdcb"/>
      </linearGradient>
      <clipPath id="foamClip">
        <path d="M1100 280 Q550 350 500 600 L10 600 Q-65 125 500 0" />
      </clipPath>
      <clipPath id="waveClip">
        <path d="M1100 280 Q550 350 500 600 L10 600 Q-20 450 40 305" />
      </clipPath>
      <clipPath id="reflectPath">
        <path d="M1100 280 L1100 600 L300 600 L40 305" fill="#000" fill-opacity="1">
      </clipPath>
      <clipPath id="backgroundClip">
        <circle cx="500" cy="500" r="490"></circle>
      </clipPath>
    </defs>
    <circle cx="500" cy="500" fill-opacity="1" r="490" fill="url(#GradientBackgroup)" filter="url(#contourFilter)"></circle>
    <g id="wave-shines" clip-path="url(#reflectPath)" filter="url(#turbulenceFilter)">
      {#each Array(reflectCount) as _,i }
      <path d="M400 300 Q600 380 450 600 Q600 340 200 300" fill="#fff" fill-opacity="0.3">
        <animateTransform attributeType="xml" attributeName="transform" type="translate" dur="{reflectDuration}s" begin="-{reflectDuration/reflectCount*i}s" values="0,0;800,-20;" repeatCount="indefinite" />
        <animate attributeType="xml" attributeName="fill-opacity" values="0.3;0;0" keySplines="0,.91,.97,1" dur="{reflectDuration}s" begin="-{reflectDuration/reflectCount*i}s" repeatCount="indefinite" />
        {#if width == 0}
        <g></g>
        {/if}
      </path>
      {/each}
    </g>
    <path id="pathWave" d="M1100 280 Q550 350 500 600 L10 600 Q-20 450 40 305" fill="url(#GradientWave)" clip-path="url(#backgroundClip)"></path>
    <path id="pathLip1" d="M1100 280 Q550 330 470 600 L480 600 Q550 340 1100 280" fill="#E0E0E0" fill-opacity="1" clip-path="url(#backgroundClip)"></path>
    <path id="pathLip2" d="M1100 280 Q550 350 500 600 L480 600 Q550 340 1100 280" fill="#FFF" fill-opacity="1" clip-path="url(#backgroundClip)"></path>
    <g id="lip-shines" clip-path="url(#waveClip)" filter="url(#turbulenceFilter)">
      {#each Array(shineCount) as _,i }
      <path d="M900 280 Q600 330 500 480 Q600 300 800 280 L900 280" fill="#70c4d0" fill-opacity="0">
        <animateTransform attributeType="xml" attributeName="transform" type="translate" dur="{shineDuration}s" begin="-{shineDuration/shineCount*i}s" values="0,0;-750,0;" repeatCount="indefinite" />
        <animate attributeType="xml" attributeName="fill-opacity" values="0;1" keySplines="0,.1" dur="{shineDuration}s" begin="-{shineDuration/shineCount*i}s" repeatCount="indefinite" />
      </path>
      {/each}
    </g>
    <g id="foams" clip-path="url(#foamClip)" filter="url(#contourFilter)" >
      {#each Array(foamCount) as _,i }
      <circle cx="500" cy="600" fill-opacity="1" r="0" fill="#fff" id="cervc-{i}" stroke="#FAFAFA" stroke-width="10" filter="url(#flouFilter)" >
        <animate attributeType="xml" attributeName="r" from="0" to="300" dur="{shineDuration}s" begin="-{shineDuration/foamCount*i}s" repeatCount="indefinite" />
        <animate attributeType="xml" attributeName="cx" values="500;-200" calcMode="spline" keySplines=".08,.01,.4,.0" dur="{shineDuration}" begin="-{shineDuration/foamCount*i}s" repeatCount="indefinite" />
      </circle>
      {/each}
    </g>
    <g id="clouds" clip-path="url(#backgroundClip)">
      <path fill="#2da8ba" fill-opacity="0.1" d="m797,-57c-44,48 -53,86 -113,97c-60,11 -34,-3 -79,-3c-45,0 -64,44 -113,49c-49,5 -39,23 -96,21c-57,-2 -81,39 -120,42c-39,3 -54,44 -157,34c-103,-10 -206,-95 -195,-106c11,-11 -55,47 -55,47c0,0 81,0 81,3c0,3 74,58 183,69c109,11 113,-25 131,-26c18,-1 49,-35 106,-21c57,14 96,-60 210,-49c114,11 166,16 208,-23c42,-39 78,-1 124,-52c46,-51 -24,-90 -26,-90c-2,0 -45,-40 -89,8z"></path>
      <path fill="#2da8ba" fill-opacity="0.1" d="m1038,-26c-228,152 -233,186 -418,184c-185,-2 -116,-10 -238,25c-122,35 -88,9 -147,26c-59,17 -120,57 -262,54c-142,-3 -76,40 -13,26c63,-14 149,-39 234,-51c85,-12 -4,-24 199,-35c203,-11 -8,-41 350,-36c358,5 327,-120 329,-120c2,0 194,-225 -34,-73z" />
    </g>
  </svg>
</div>

<style>
  div { width:800px; height:800px; position:relative; background:transparent;}
  div:after { content:''; position:absolute; top:0; left:0; bottom:0; right:0; border-radius:50%; background-image: linear-gradient(126deg, rgba(0,0,0,0.05) 25%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05) 100%);
background-size: 4.94px 6.81px; }

</style>