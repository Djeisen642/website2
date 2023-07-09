<template>
  <v-container ref="container" fluid>
    <v-row v-for="(cols, rowIndex) in rows" :key="rowIndex" class="row-2048" align-content="center">
      <v-spacer />
      <p
        v-for="(colValue, colIndex) in cols"
        :key="colIndex"
        color="primary"
        bg-color="secondary"
        class="col-2048"
        :style="getColorStyle(colValue)"
      >
        {{ colValue }}
      </p>
      <v-spacer />
    </v-row>
    <p v-if="gameState !== GameState.Ongoing">{{ gameStateText }}</p>
  </v-container>
</template>
<script lang="ts" setup>
import { useTheme } from 'vuetify';

import {
  NUMS_THAT_CAN_BE_ADDED_AT_RANDOM,
  NUM_SQUARES_PER_SIDE,
  WIN_NUMBER,
} from '@/utils/constants_2048';
import { RGBObject } from '@/utils/types';

const enum Direction {
  Up,
  Down,
  Left,
  Right,
}
const enum GameState {
  Won,
  Lost,
  Ongoing,
}

const allValues = ref<(number | null)[]>(
  new Array(NUM_SQUARES_PER_SIDE * NUM_SQUARES_PER_SIDE).fill(null),
);
const theme = useTheme();
const rows = computed(() => {
  return getArrayOfArrays(Direction.Left);
});
const gameState = ref(GameState.Ongoing);
const gameStateText = computed(() => {
  return gameState.value === GameState.Lost ? 'You Lost!!!' : 'You Won!!!';
});

function getArrayOfArrays(direction: Direction) {
  if ([Direction.Up, Direction.Down].includes(direction)) return getStripedArrayOfArrays(direction);
  const arrayOfArrays: (number | null)[][] = [];
  let currentArray: (number | null)[] = [];
  const arrayToUse =
    direction === Direction.Right ? allValues.value.slice().reverse() : allValues.value;
  for (let index = 0; index < arrayToUse.length; index++) {
    if (index % NUM_SQUARES_PER_SIDE === 0) {
      currentArray = [];
      arrayOfArrays.push(currentArray);
    }
    currentArray.push(arrayToUse[index]);
  }
  return arrayOfArrays;
}

function getStripedArrayOfArrays(direction: Direction) {
  const arrayOfArrays: (number | null)[][] = [];
  for (let index = 0; index < NUM_SQUARES_PER_SIDE; index++) {
    arrayOfArrays.push([]);
  }
  const arrayToUse =
    direction === Direction.Down ? allValues.value.slice().reverse() : allValues.value;
  for (let index = 0; index < arrayToUse.length; index++) {
    arrayOfArrays[index % NUM_SQUARES_PER_SIDE].push(arrayToUse[index]);
  }
  return arrayOfArrays;
}

function collapse(arrayOfArrays: (number | null)[][]) {
  const updatedArrays: (number | null)[][] = [];
  for (const array of arrayOfArrays) {
    const cleanedArray = array.filter(value => !!value);
    const collapsedValues: (number | null)[] = [];
    for (let index = 0; index < cleanedArray.length; index++) {
      const value = cleanedArray[index];
      if (value) {
        let valueToAdd = value;
        if (cleanedArray[index + 1] && cleanedArray[index + 1] === value) {
          valueToAdd = value * 2;
          index++;
        }
        collapsedValues.push(valueToAdd);
      }
    }
    collapsedValues.push(...new Array(NUM_SQUARES_PER_SIDE - collapsedValues.length).fill(null));
    updatedArrays.push(collapsedValues);
  }
  return updatedArrays;
}

function fromArrayOfArrays(direction: Direction, arrayOfArrays: (number | null)[][]) {
  if ([Direction.Up, Direction.Down].includes(direction))
    return fromStripedArrayOfArrays(direction, arrayOfArrays);
  const array: (number | null)[] = [];
  for (const row of arrayOfArrays) {
    array.push(...row);
  }
  return direction === Direction.Right ? array.reverse() : array;
}

function fromStripedArrayOfArrays(direction: Direction, arrayOfArrays: (number | null)[][]) {
  const array: (number | null)[] = new Array(NUM_SQUARES_PER_SIDE * NUM_SQUARES_PER_SIDE);
  for (let columnIndex = 0; columnIndex < arrayOfArrays.length; columnIndex++) {
    const column = arrayOfArrays[columnIndex];
    for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
      array[columnIndex + rowIndex * NUM_SQUARES_PER_SIDE] = column[rowIndex];
    }
  }
  return direction === Direction.Down ? array.reverse() : array;
}

function setRandomEmptySquare() {
  if (gameState.value !== GameState.Ongoing) return;
  const numEmpty = allValues.value.filter(value => !value).length;
  let pickEmpty = Math.floor(Math.random() * numEmpty);
  const pickANumber =
    NUMS_THAT_CAN_BE_ADDED_AT_RANDOM[
      Math.floor(Math.random() * NUMS_THAT_CAN_BE_ADDED_AT_RANDOM.length)
    ];
  for (let index = 0; index < allValues.value.length; index++) {
    if (allValues.value[index]) continue;
    if (pickEmpty === 0) {
      allValues.value[index] = pickANumber;
      return;
    }
    pickEmpty--;
  }
}

function checkEndGame() {
  const hasWinNumber = allValues.value.includes(WIN_NUMBER);
  if (hasWinNumber) {
    gameState.value = GameState.Won;
    return;
  }
  const numEmpty = allValues.value.filter(value => !value).length;
  if (numEmpty === 0) gameState.value = GameState.Lost;
}

function onDirectionalKeyStroke(e: Event, direction: Direction) {
  if (gameState.value !== GameState.Ongoing) return;
  e.preventDefault();
  const arrayOfArrays = getArrayOfArrays(direction);
  const collapseResult = collapse(arrayOfArrays);
  allValues.value = fromArrayOfArrays(direction, collapseResult);
  setRandomEmptySquare();
  checkEndGame();
}

// ---------------- Used Google Bard to guide development: start ------------- //
function rgbHexToDecimal(hexString: string) {
  // Split the hex string into three parts.
  const red = parseInt(hexString.substring(1, 3), 16);
  const green = parseInt(hexString.substring(3, 5), 16);
  const blue = parseInt(hexString.substring(5, 7), 16);

  // Return the decimal value.
  return { r: red, g: green, b: blue };
}
function getColorStyle(value: number | null) {
  const backgroundColorRGB = value
    ? hashToVividColor(generatePseudoRandomNumber(value))
    : rgbHexToDecimal(theme.current.value.colors.secondary);

  return {
    color: getTextColor(backgroundColorRGB),
    'background-color': toHexRGB(backgroundColorRGB),
  };
}

function generatePseudoRandomNumber(value: number) {
  return (1103515245 * value + 12345) % 2 ** 31;
}

function hashToVividColor(number: number) {
  // Calculate the red, green, and blue values of the color.
  let r = (number % 256) + 128;
  let g = (Math.floor((number / 256) % 255) + 128) * 0.7;
  let b = (Math.floor((number / 65536) % 255) + 128) * 0.5;

  // Check if the color is vivid.
  const isVivid = r + g + b > 500;

  // If the color is not vivid, increase the saturation.
  if (!isVivid) {
    const colorIndex = Math.floor(number % 3);
    switch (colorIndex) {
      case 0:
        r += 100;
        break;
      case 1:
        g += 100;
        break;
      case 2:
        b += 100;
        break;
    }
  }

  // Return the RGB hex value.
  return { r, g, b };
}

function toHexRGB(color: RGBObject) {
  const r = color.r;
  const g = color.g;
  const b = color.b;

  // Return the RGB hex value.
  return `rgb(${r},${g},${b})`;
}

function getTextColor(backgroundColor: RGBObject) {
  // Calculate the luminance of the background color.
  const luminance =
    backgroundColor.r * 0.299 + backgroundColor.g * 0.587 + backgroundColor.b * 0.114;

  // If the luminance is greater than 186, use black text.
  // Otherwise, use white text.
  return luminance > 186 ? 'rgb(var(--v-theme-secondary))' : 'rgb(var(--v-theme-primary))';
}
// ---------------- Used Google Bard to guide development: stop ------------- //

setRandomEmptySquare();

onKeyStroke(['s', 'ArrowDown'], e => {
  onDirectionalKeyStroke(e, Direction.Down);
});

onKeyStroke(['w', 'ArrowUp'], e => {
  onDirectionalKeyStroke(e, Direction.Up);
});

onKeyStroke(['a', 'ArrowLeft'], e => {
  onDirectionalKeyStroke(e, Direction.Left);
});

onKeyStroke(['d', 'ArrowRight'], e => {
  onDirectionalKeyStroke(e, Direction.Right);
});

const container = ref(null);
useSwipe(container, {
  onSwipeEnd(e, direction) {
    switch (direction) {
      case 'down':
        onDirectionalKeyStroke(e, Direction.Down);
        break;
      case 'up':
        onDirectionalKeyStroke(e, Direction.Up);
        break;
      case 'left':
        onDirectionalKeyStroke(e, Direction.Left);
        break;
      case 'right':
        onDirectionalKeyStroke(e, Direction.Right);
        break;
    }
  },
});
</script>
<style lang="scss" scoped>
$square-side: 100px;

.col-2048 {
  width: $square-side;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  border: 1px solid black;
}

.row-2048 {
  height: $square-side;
}
</style>
