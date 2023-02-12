// setTimeout(()=>{
//   console.log('timer1')

//   Promise.resolve().then(function() {
//       console.log('promise1')
//   })
// }, 100)

// setTimeout(()=>{
//   console.log('timer2')

//   Promise.resolve().then(function() {
//       console.log('promise2')
//   })
// },100)

// const obj = { a: 1, b: 2 }
// JSON.stringify(obj, (key, val) => {
//   console.log(123);
//   console.log(key, val)
//   return val
// })



// console.log('outer');

// setTimeout(() => {
//   console.log('setTimeout');
// }, 4);

// setImmediate(() => {
//   console.log('setImmediate');
// });


const arr = Array(100000)
  .fill(0)
arr[9999] = {}
arr[99999] = []
arr[3333] = 123

console.time()
arr.includes(123)
// for (let i = 0;i < 100000;i++) {
//   if (arr[i] === 123) break 
// }
// arr.findIndex((val) => val === 123)
console.timeEnd()