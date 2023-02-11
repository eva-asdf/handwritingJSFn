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



console.log('outer');

setTimeout(() => {
  console.log('setTimeout');
}, 4);

setImmediate(() => {
  console.log('setImmediate');
});