require('../src/db/mongoose')
const User = require('../src/models/user')

//
// User.findByIdAndUpdate('5e9daad4b05d87314c345e30',{age:1}).then((user)=>{
//    return User.countDocuments({age:1})
// }).then((c)=>{
//    console.log(c)
// })

const updateAgeAndCount = async (id, age) => {
   const user = await User.findByIdAndUpdate(id, {
      age
   })
   const counted = await User.countDocuments({
      age
   })
   return counted
}
updateAgeAndCount('5e9daad4b05d87314c345e30', 2).then((res) => {
   console.log(res)
}).catch((e) => {
   console.log(e)
})