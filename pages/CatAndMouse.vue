<template>
  <v-container
    fluid
    class="full-height no-cursor"
    @mousemove="onMouseMove"
  >
    <p style="position: absolute">
      Very much a work in progress
      <br />
      Mouse x: {{ mouse.getPixelPosition().x }} y: {{ mouse.getPixelPosition().y }}
      <br />
      Cat x: {{ cat.getPixelPosition().x }} y: {{ cat.getPixelPosition().y }} speed:
      {{ `${cat.speed.toString()}px/${catRefreshInterval}ms` }}
    </p>
    <v-dialog
      v-model="paused"
      width="auto"
      persistent
    >
      <v-card>
        <v-card-title>Cat And Mouse Game</v-card-title>
        <v-card-subtitle
          v-if="score > 0"
          class="mx-auto"
        >
          <v-icon
            icon="$skull"
            aria-label="Game Over"
          />
        </v-card-subtitle>
        <v-card-text
          v-if="score > 0"
          class="mx-auto"
        >
          <p>Score: {{ score }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            variant="flat"
            class="mx-auto"
            @click="startRunning"
          >Start</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="mouse">
      <v-icon
        :icon="mouseIcon"
        class="mouse-icon"
        aria-label="The mouse"
      />
    </div>
    <div class="cat">
      <v-icon
        icon="$cat"
        class="cat-icon"
        aria-label="The cat"
      />
    </div>
    <div
      ref="container"
      class="cat-border"
    ></div>
  </v-container>
</template>
<script setup lang="ts">
import { useResizeObserver, useWindowFocus } from '@vueuse/core';

import { Boundary, Position } from '@/objects/abstract';
import { Cat, Mouse } from '@/objects/animals';

const windowFocused = useWindowFocus();

const count = ref(0);
const mouse = reactive(new Mouse(new Position(0, 0), 20));
const container = ref<HTMLDivElement>();
const iconSize = 50;
const catMargins = 60;
const catRefreshInterval = ref(50);
const catBorderMargins = ref(`${catMargins}px`);
const cat = reactive(new Cat(new Position(0, 0), new Boundary(0, 0, 0, 0), 10));
const iconMargin = iconSize / 2 - 1;
const paused = ref(true);
const score = computed(() => Math.floor(count.value));
const mouseIcon = ref('$mouse');

const { pause: pauseGameInterval, resume: resumeGameInterval } = useIntervalFn(() => {
  cat.updateVelocity(mouse.position);
  if (mouse.caughtBy(cat.position)) {
    paused.value = true;
    mouseIcon.value = '$skull';
    pauseGameInterval();
    return;
  }
  count.value += catRefreshInterval.value / 500;
}, catRefreshInterval);

onMounted(() => {
  // on mount, interestingly, the container's bounding rectangle is not properly known. So, wait a bit
  setTimeout(() => resetCatBoundaries(), 100);
  pauseGameInterval();
});

watch(windowFocused, isFocused => {
  if (paused.value) return;
  if (isFocused) resumeGameInterval();
  else pauseGameInterval();
});

useResizeObserver(container, () => resetCatBoundaries());

function startRunning(event: MouseEvent) {
  paused.value = false;
  count.value = 0;
  mouseIcon.value = '$mouse';
  cat.randomizePosition();
  onMouseMove(event);
  resumeGameInterval();
}
function resetCatBoundaries() {
  if (!container.value) return;
  const rect = container.value.getBoundingClientRect();
  cat.boundary = Boundary.createBoundary(rect, iconMargin);
}
function onMouseMove(event: MouseEvent) {
  if (paused.value || !windowFocused) return;
  mouse.position = new Position(event.x, event.y);
}
</script>
<style lang="scss" scoped>
$icon-size: 50px;

.full-height {
  height: 100%;
  padding: 1px;
}

.no-cursor {
  cursor: none;
}

.add-cursor {
  cursor: pointer;
}

.cat-border {
  margin: v-bind('catBorderMargins');
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  height: calc(100% - (v-bind('catBorderMargins') * 2));
}

.mouse {
  position: absolute;
  left: v-bind('mouse.getPixelPosition().x');
  top: v-bind('mouse.getPixelPosition().y');

  .mouse-icon {
    height: $icon-size;
    width: $icon-size;
    position: absolute;
    left: 50%;
    // stylelint-disable-next-line declaration-property-value-no-unknown
    margin-left: calc(-1 * $icon-size / 2);
    top: 50%;
    // stylelint-disable-next-line declaration-property-value-no-unknown 
    margin-top: calc(-1 * $icon-size / 2);
  }
}

.cat {
  position: absolute;
  left: v-bind('cat.getPixelPosition().x');
  top: v-bind('cat.getPixelPosition().y');

  .cat-icon {
    // stylelint-disable-next-line declaration-property-value-no-unknown  
    height: calc($icon-size * 1.2);
    // stylelint-disable-next-line declaration-property-value-no-unknown 
    width: calc($icon-size * 1.2);
    position: absolute;
    left: 50%; // stylelint-disable-next-line declaration-property-value-no-unknown 
    margin-left: calc(-1 * $icon-size / 2);
    top: 50%; // stylelint-disable-next-line declaration-property-value-no-unknown 
    margin-top: calc(-1 * $icon-size / 2);
  }
}
</style>
