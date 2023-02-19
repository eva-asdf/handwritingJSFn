type SortFn = (arr: number[], max?: number, min?: number) => number[];

const sort: {
  [k: string]: SortFn;
} = {};

//utils
function swap(arr: number[], i: number, j: number) {
  if (i === j) return;
  const tem = arr[i];
  arr[i] = arr[j];
  arr[j] = tem;
}
function merge(left: number[], right: number[]): number[] {
  const arr: Array<number> = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      arr.push(left.shift() as number);
    } else {
      arr.push(right.shift() as number);
    }
  }
  if (left.length) arr.push(...left);
  else if (right.length) arr.push(...right);
  return arr;
}
function partition(arr: number[], left: number, right: number) {
  let p = left;
  let idx = p + 1;
  for (let i = idx; i <= right; i++) {
    if (arr[i] < arr[p]) {
      swap(arr, i, idx);
      idx++;
    }
  }
  swap(arr, p, idx - 1);
  return idx - 1;
}
function buildHeap(arr: number[]) {
  const n = arr.length;
  for (let i = Math.floor(n / 2); i >= 0; i--) {
    headAdjust(arr, i, n - 1);
  }
}

function headAdjust(arr: number[], i: number, len: number) {
  let child = i * 2 + 1;
  while (child <= len) {
    if (child + 1 <= len && arr[child] < arr[child + 1]) {
      child = child + 1;
    }

    if (arr[i] < arr[child]) {
      const temp = arr[i];
      arr[i] = arr[child];
      arr[child] = temp;
      i = child;
      child = child * 2 + 1;
    } else {
      break;
    }
  }
}
// ------------------------------------------------------------

sort["bubbleSort"] = function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (arr[i] > arr[j]) {
        swap(arr, i, j);
      }
    }
  }
  return arr;
};

sort["selectionSort"] = function (arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (arr[i] > arr[j]) swap(arr, i, j);
    }
  }
  return arr;
};

sort["insertionSort"] = function (arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let idx = i - 1,
      current = arr[i];
    while (idx >= 0 && current < arr[idx]) {
      arr[idx + 1] = arr[idx];
      idx--;
    }
    arr[idx + 1] = current;
  }
  return arr;
};

sort["shellSort"] = function (arr) {
  const n: number = arr.length;
  let gap: number = Math.floor(n / 2);
  for (gap; gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const current = arr[i];
      let j = i - gap;
      for (j; j >= 0 && current < arr[j]; j -= gap) {
        arr[j] = arr[j + gap];
      }
      arr[j + gap] = current;
    }
  }
  return arr;
};

sort["mergeSort"] = function mergeSort(arr): number[] {
  const n = arr.length;
  if (n < 2) {
    return arr;
  }

  let idx = Math.floor(n / 2);
  let left = arr.slice(0, idx);
  let right = arr.slice(idx);
  return merge(mergeSort(left), mergeSort(right));
};

// 无序 序列排序 最优解
sort["quickSort"] = function (arr) {
  function quickSort(
    arr: number[],
    left: number = 0,
    right: number = arr.length - 1
  ): number[] {
    const n = arr.length;
    if (left < right) {
      const idx = partition(arr, left, right);
      quickSort(arr, left, idx);
      quickSort(arr, idx + 1, right);
    }
    return arr;
  }

  return quickSort(arr);
};

// 更容易理解版本
sort["quickSort1"] = function quickSort(arr): number[] {
  const n = arr.length;
  if (n < 2) return arr;
  const left: number[] = [],
    right: number[] = [];

  const pivotIndex = Math.floor(n / 2);
  const pivot = arr.splice(pivotIndex, 1)[0];
  for (let i = 0; i < n - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), ...quickSort(right)];
};

// 堆排序， 应用场景，如有很多数据如10^5 个，要求选出最大的100个数据，则堆排序是最优解
sort["heapSort"] = function (arr) {
  buildHeap(arr);
  const n = arr.length;
  if (n < 2) return arr;
  for (let i = n - 1; i >= 0; i--) {
    swap(arr, 0, i);
    headAdjust(arr, 0, i - 1);
  }
  return arr;
};

sort["countingSort"] = function (arr: Array<number>, max, min) {
  const n = arr.length;
  const ans: Array<number> = [];
  if (n < 2) return arr;
  max = max || Math.max(...arr);
  min = min || Math.min(...arr);
  const bucket = Array(max - min + 1).fill(0);
  for (let i = 0; i < n; i++) {
    bucket[arr[i] - min]++;
  }
  for (let i = 0; i < bucket.length; i++) {
    while (bucket[i]) {
      ans.push(i + min);
      bucket[i]--;
    }
  }
  return ans;
};

export default sort;
