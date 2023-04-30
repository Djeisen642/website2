<template>
  <v-container fluid class="full-height no-cursor" @mousemove="onMouseMove">
    <p style="position: absolute">
      Very much a work in progress
      <br />
      Mouse x: {{ mouse.getPixelPosition().x }} y: {{ mouse.getPixelPosition().y }}
      <br />
      Cat x: {{ cat.getPixelPosition().x }} y: {{ cat.getPixelPosition().y }} speed:
      {{ `${cat.speed.toString()}px/${catRefreshInterval}ms` }}
    </p>
    <div class="mouse">
      <v-icon icon="$mouse" class="mouse-icon" aria-label="The mouse" />
    </div>
    <div class="cat">
      <v-icon icon="$cat" class="cat-icon" aria-label="The cat" />
    </div>
    <div ref="container" class="cat-border"></div>
  </v-container>
</template>
<script setup lang="ts">
import { useResizeObserver, useWindowFocus } from '@vueuse/core';

import { Boundary, Position } from '@/objects/abstract';
import { Cat, Mouse } from '@/objects/animals';

const windowFocused = useWindowFocus();

const mouse = reactive(new Mouse(new Position(0, 0)));
const container = ref<HTMLDivElement>();
const iconSize = 50;
const catMargins = 60;
const catRefreshInterval = ref(50);
const catBorderMargins = ref(`${catMargins}px`);
const cat = reactive(new Cat(new Position(0, 0), new Boundary(0, 0, 0, 0), 10));
const iconMargin = iconSize / 2 - 1;
onMounted(() => {
  // on mount, interestingly, the container's bounding rectangle is not properly known. So, wait a bit
  setTimeout(() => resetCatBoundaries(), 100);
});
const { pause, resume } = useIntervalFn(() => {
  cat.updateVelocity(mouse.position);
}, catRefreshInterval);
watch(windowFocused, isFocused => {
  if (isFocused) resume();
  else pause();
});

useResizeObserver(container, () => resetCatBoundaries());
function resetCatBoundaries() {
  if (!container.value) return;
  const rect = container.value.getBoundingClientRect();
  cat.boundary = Boundary.createBoundary(rect, iconMargin);
}
function onMouseMove(event: MouseEvent) {
  if (!windowFocused) return;
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
    margin-left: calc(-1 * $icon-size / 2);
    top: 50%;
    margin-top: calc(-1 * $icon-size / 2);
  }
}

.cat {
  position: absolute;
  left: v-bind('cat.getPixelPosition().x');
  top: v-bind('cat.getPixelPosition().y');

  .cat-icon {
    height: calc($icon-size * 1.2);
    width: calc($icon-size * 1.2);
    position: absolute;
    left: 50%;
    margin-left: calc(-1 * $icon-size / 2);
    top: 50%;
    margin-top: calc(-1 * $icon-size / 2);
  }
}
</style>
