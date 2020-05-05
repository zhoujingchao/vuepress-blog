// 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
// 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
// 注意：给定 n 是一个正整数。

// 思考
// 当我们从第 n-1 阶楼梯爬到第 n 阶楼梯时，需要1步；
// 当我们从第 n-2 阶楼梯爬到第 n 阶楼梯时，需要2步.
// 也就是说 到达第 n 阶楼梯的方法数等于到达第 n-1 阶楼梯的方法数加上到达第 n-2 阶楼梯的方法数，
// 即 f(n) = f(n - 1) + f(n - 2)}，其正好符合斐波那契通项。

function fn(n) {
  if (n === 1) return 1
  if (n === 2) return 2
  return fn(n - 1) + fn(n - 2)
}

function fn(n) {
  const result = [1, 2]
  for (let i = 2; i < n; i++) {
    result.push(result[n - 1] + result[n - 2])
  }
  return result[n - 1]
}

function fn(n) {
  let a = b = 1
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b]
  }
  return a
}