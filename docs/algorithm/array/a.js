var arr = [];

for (var i = 0; i < 20; i++) {
  var randomNum = Math.floor(Math.random() * 1000);
  arr.push(randomNum);
}

console.log(11, arr)

/**
 * 算法描述：
 * 在未排序序列中找到最小（大）元素，存放到排序序列的起始位置
 * 从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾
 * 重复第二步，直到所有元素均排序完毕
 * @param {*} arr 
 */
function selectSort(arr) {
  var len = arr.length,
    value;

  for (var i = 0; i < len - 1; i++) {
    for (var j = i + 1; j < len; j++) {
      if (arr[j] < arr[i]) {
        value = arr[i];
        arr[i] = arr[j];
        arr[j] = value;
      }
    }
  }

  return arr;
}

console.log(22, selectSort(arr))
