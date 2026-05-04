# JavaScript 异步编程：从回调到 async/await

## 概述

JavaScript 的异步编程经历了多个阶段的演进：回调函数 → Promise → async/await。理解这一演进过程，有助于写出更健壮的异步代码。

## 回调函数（Callback）

最早的异步解决方案，直接将函数作为参数传入：

```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback(null, 'data')
  }, 1000)
}

fetchData((err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})
```

**问题**：回调地狱（Callback Hell）——深层嵌套的回调使代码难以阅读和维护。

## Promise

Promise 将回调嵌套拍平为链式调用：

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('data')
    }, 1000)
  })
}

fetchData()
  .then(data => {
    console.log(data)
    return process(data)
  })
  .then(result => {
    console.log(result)
  })
  .catch(err => {
    console.error(err)
  })
```

**改进**：链式调用更清晰，`.catch()` 集中处理错误。

## async/await

async/await 是 Promise 的语法糖，写起来像同步代码：

```javascript
async function getData() {
  try {
    const data = await fetchData()
    console.log(data)
    const result = await process(data)
    console.log(result)
  } catch (err) {
    console.error(err)
  }
}
```

## 注意事项

1. **错误处理**：async 函数中用 `try/catch` 包裹 `await`
2. **并行执行**：多个不相关的异步操作用 `Promise.all()` 并行执行，而非逐个 `await`
3. **避免阻塞**：不要在循环中无意义地使用 `await`

```javascript
// 正确：并行执行
const [a, b] = await Promise.all([fetchA(), fetchB()])

// 不推荐：串行执行，速度慢
const a = await fetchA()
const b = await fetchB()
```

## 小结

- 回调函数：基础但易引发回调地狱
- Promise：链式调用，错误集中处理
- async/await：最现代的方式，代码可读性最佳

实际项目中，**async/await + try/catch** 是推荐写法。
