<template>
  <v-container fluid>
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
import {
  NUMS_THAT_CAN_BE_ADDED_AT_RANDOM,
  NUM_SQUARES_PER_SIDE,
  WIN_NUMBER,
} from '@/utils/constants_2048';

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
const rows = computed(() => {
  return getArrayOfArrays(Direction.Left);
});
const gameState = ref(GameState.Ongoing);
const gameStateText = computed(() => {
  return gameState.value === GameState.Lost ? 'You Lost!!!' : 'You Won!!!';
});

function getColorStyle() {
  // (value: number | null) {
  // const baseBackground = getRGBColor(
  //   window.getComputedStyle(document.body, null).getPropertyValue('--v-theme-secondary'),
  // );
  // const backgroundColorRGB = value
  //   ? {
  //       r: baseBackground.r + (value % 256),
  //       g: baseBackground.g + (value % 256),
  //       b: baseBackground.b + (value % 256),
  //     }
  //   : baseBackground;

  // return {
  //   color: getTextColor(backgroundColorRGB),
  //   'background-color': toHexRGB(backgroundColorRGB),
  // };
  return {
    color: 'rgb(var(--v-theme-primary))',
    'background-color': 'rgb(var(--v-theme-secondary))',
  };
}

// type RGBObject = {
//   r: number;
//   g: number;
//   b: number;
// };
// function getRGBColor(colorVariable: string): RGBObject {
//   const [rDec, gDec, bDec] = colorVariable.split(',');
//   // Split the color variable into its red, green, and blue values.
//   const r = parseInt(rDec);
//   const g = parseInt(gDec);
//   const b = parseInt(bDec);

//   // Return the RGB hex value.
//   return { r, g, b };
// }
// function toHexRGB(color: RGBObject) {
//   const r = color.r.toString(16);
//   const g = color.g.toString(16);
//   const b = color.b.toString(16);

//   // Return the RGB hex value.
//   return `#${r}${g}${b}`;
// }

// function getTextColor(backgroundColor: RGBObject) {
//   // Calculate the luminance of the background color.
//   const luminance =
//     backgroundColor.r * 0.299 + backgroundColor.g * 0.587 + backgroundColor.b * 0.114;

//   // If the luminance is greater than 186, use black text.
//   // Otherwise, use white text.
//   return luminance > 186 ? 'rgb(var(--v-theme-primary))' : 'rgb(var(--v-theme-secondary))';
// }

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
setRandomEmptySquare();

function checkEndGame() {
  const hasWinNumber = allValues.value.includes(WIN_NUMBER);
  if (hasWinNumber) {
    gameState.value = GameState.Won;
    return;
  }
  const numEmpty = allValues.value.filter(value => !value).length;
  if (numEmpty === 0) gameState.value = GameState.Lost;
}

function onDirectionalKeyStroke(e: KeyboardEvent, direction: Direction) {
  if (gameState.value !== GameState.Ongoing) return;
  e.preventDefault();
  const arrayOfArrays = getArrayOfArrays(direction);
  const collapseResult = collapse(arrayOfArrays);
  allValues.value = fromArrayOfArrays(direction, collapseResult);
  setRandomEmptySquare();
  checkEndGame();
}

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
