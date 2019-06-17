const insertSort = arr => {
  for(let i =1, len = arr.length; i < len; i++) {
    let temp = arr[i];
    let j = i -1;
    while(j >= 0 && arr[i] < arr[j]) {
      arr[j + 1] = arr[j];
      j = j -1;
    }
    arr[j + 1] = temp;
  }
  return arr;
};
