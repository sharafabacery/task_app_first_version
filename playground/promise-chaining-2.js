require('../src/db/mongoose')
const task = require('../src/models/task')

//
// task.findOneAndDelete("5e9d9605c7c25729c023b5fe").then((tas)=>{
//     console.log(tas)
//     return task.countDocuments({completed:false})
// }).then((ta)=>{
//     console.log(ta)
// }).catch((e)=>{
//     console.log(e)
// })

FindOneAndDelete=async(_id,completed)=>{
await task.findOneAndDelete(_id)
const counted=await task.countDocuments({completed})
return counted
}
FindOneAndDelete("5e9f06972f198d1504a64a60",false).then((ta)=>{
    console.log(ta)
}).catch((e)=>{
    console.log(e)
})

