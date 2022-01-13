const fs = require('fs')
const path = require('path')
const Diff = require('diff');

let old_files = fs.readdirSync(path.resolve('./test1'))
let new_files = fs.readdirSync(path.resolve('./test2'))

const old_file_hash_name = {}

const random_string = (obj)=>{
	const str = Math.random().toString(36).substring(2)
	if(obj&&typeof(obj)==="object"&&obj.hasOwnProperty(str)){
		random_string(obj)
	}
	return str
}

old_files.forEach((file)=>{
	if(/^.*\..*\.\w+$/.test(file)){
		const cache = file.split('.')
		const key = random_string(old_file_hash_name)
		old_file_hash_name[key]=cache[1]
	}
})

console.log(old_files)
console.log(old_file_hash_name)

// test1=>test2

const need_diff_files = []
const add_files = []
const delete_files = []
const unchanged_files = []

// const old_files_str = old_files.join('===')
// const new_files_str = new_files.join('===')

// const file_names_diff = Diff.diffArrays(old_files, new_files)
// // console.log(file_names_diff)
// file_names_diff.forEach(diff=>{
// 	if(diff.added){
// 		add_files.push(...diff.value)
// 	}else if(diff.removed){
// 		delete_files.push(...diff.value)
// 	}else{
// 		unchanged_files.push(...diff.value)
// 	}
// })


// console.log(delete_files)
// console.log(add_files)
// console.log(unchanged_files)

// console.log(new_files)
// const diff = Diff.diffChars('111222333','432231443')

// console.log(diff)