const fs = require('fs')
const path = require('path')
const Diff = require('diff');

const old_folder = './old'
const new_folder = './new'
const patch_folder = './patch'
let old_files = fs.readdirSync(path.resolve(old_folder))
let new_files = fs.readdirSync(path.resolve(new_folder))

const file_test = /^.*\..*\.\w+$/


const remove_from_files = (file_name, file_arrary)=>{
	const index = file_arrary.indexOf(file_name)
	if(index > -1){
		file_arrary.splice(index,1)
	}
}

const get_file_content = (file)=>{
	const old_find = fs.existsSync(path.resolve(old_folder, file))
	const new_find = fs.existsSync(path.resolve(new_folder, file))
	if(!old_find && !new_find) return;
	if(old_find) return fs.readFileSync(path.resolve(old_folder, file), {encoding: 'utf-8'});
	if(new_find) return fs.readFileSync(path.resolve(new_folder, file), {encoding: 'utf-8'})
}
const get_file = (path_to_file)=>{
	const file = fs.existsSync(path_to_file)
	if(!file) return;
	return fs.readFileSync(path_to_file, {encoding: 'utf-8'})
}
const create_patch_file = (file_name, file_content, additional)=>{
	const folder_exists = fs.existsSync(path.resolve(patch_folder))
	if(!folder_exists){
		fs.mkdirSync(patch_folder)
	}
	if(additional){
		return fs.appendFileSync(path.resolve(patch_folder, file_name), file_content+ '\n', {encoding: 'utf-8'})
	}
	fs.writeFileSync(path.resolve(patch_folder, file_name), file_content + '\n', {encoding: 'utf-8'})
}

const merge = ()=>{
	let old_file = get_file(path.resolve('./old/a.1.js'))
	let new_file = get_file(path.resolve('./new/a.2.js'))
	// let patch_file = get_file(path.resolve('./patch/a.1.js.patch'))
	const diff = Diff.createPatch('a.1.js',old_file,new_file )
	
	// const ccc = Diff.parsePatch(JSON.parse(patch_file))
	console.log(diff)

	const a = Diff.applyPatch(old_file, Diff.parsePatch(diff));
	// fs.writeFileSync(path.resolve('./a.js'), a, {encoding: 'utf-8'})
	console.log(a)
}
merge()