<template>
  <v-container fluid class="full-height no-cursor" @mousemove="logEvent">
    <p style="position: absolute">
      Very much a work in progress
      <br />
      Mouse x: {{ mousePosition.x }} y: {{ mousePosition.y }}
      <br />
      Cat x: {{ catPosition.x }} y: {{ catPosition.y }}
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
const mousePosition = ref({ x: '0px', y: '0px' });
const catPosition = ref({ x: '200px', y: '300px' });
const follow = ref(true);
const container = ref();
const iconSize = 50;
const catMargins = 60;
const catBorderMargins = computed(() => `${catMargins}px`);
const iconMargin = iconSize / 2 - 2;
const boundaries = ref({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});
onMounted(() => {
  // on mount, interestingly, the container's bounding rectangle is not properly known. So, wait a bit
  setTimeout(() => resetCatBoundaries(), 100);
});
window.addEventListener('resize', () => resetCatBoundaries());
function resetCatBoundaries() {
  const rect = container.value.getBoundingClientRect();
  boundaries.value = {
    top: rect.y + iconMargin,
    bottom: rect.y + rect.height - iconMargin,
    left: rect.x + iconMargin,
    right: rect.x + rect.width - iconMargin,
  };
}
function logEvent(event: MouseEvent) {
  if (!follow.value) return;
  mousePosition.value.x = `${event.x}px`;
  mousePosition.value.y = `${event.y}px`;
  const catX = Math.min(Math.max(boundaries.value.left, event.x), boundaries.value.right);
  const catY = Math.min(Math.max(boundaries.value.top, event.y), boundaries.value.bottom);
  catPosition.value.x = `${catX}px`;
  catPosition.value.y = `${catY}px`;
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

.cat-border {
  margin: v-bind('catBorderMargins');
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  height: calc(100% - (v-bind('catBorderMargins') * 2));
}

.mouse {
  position: absolute;
  top: v-bind('mousePosition.y');
  left: v-bind('mousePosition.x');

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
  top: v-bind('catPosition.y');
  left: v-bind('catPosition.x');

  .cat-icon {
    height: $icon-size;
    width: $icon-size;
    position: absolute;
    left: 50%;
    margin-left: calc(-1 * $icon-size / 2);
    top: 50%;
    margin-top: calc(-1 * $icon-size / 2);
  }
}
</style>
