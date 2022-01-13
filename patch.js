const fs = require('fs')
const path = require('path')
const Diff = require('diff');

const old_folder = './dist1'
const new_folder = './dist2'
const patch_folder = './patch'
let old_files = fs.readdirSync(path.resolve(old_folder))
let new_files = fs.readdirSync(path.resolve(new_folder))

// const file_test = /^.*\..*\.\w+$/
const file_test = /^.*\..*\w+$/


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

const create_patch_file = (file_name, file_content, additional)=>{
	const folder_exists = fs.existsSync(path.resolve(patch_folder))
	if(!folder_exists){
		fs.mkdirSync(patch_folder)
	}
	if(additional){
		return fs.appendFileSync(path.resolve(patch_folder, file_name), file_content, {encoding: 'utf-8'})
	}
	fs.writeFileSync(path.resolve(patch_folder, file_name), file_content, {encoding: 'utf-8'})
}
//test1=>test2
const file_diff = Diff.diffArrays(old_files,new_files)

const unchanged_files = []
const added_files = []
const removed_files = []


file_diff.forEach(diff=>{
	if(diff.added){
		added_files.push(...diff.value)
	}else if(diff.removed){
		removed_files.push(...diff.value)
	}else{
		unchanged_files.push(...diff.value)
	}
})
const change_log = {
	add_index: [...added_files],
	remove_index: [...removed_files],
	change_index: []
}

const file_changes=[]
added_files.forEach((added_file, index_add)=>{
	removed_files.forEach((removed_file, index_remove)=>{
		if(file_test.test(added_file)&&file_test.test(removed_file)){
			const added_chunk = added_file.split('.')
			const added_chunk_name = `${added_chunk[0]}.${added_chunk[2]}`
			const removed_chunk = removed_file.split('.')
			const removed_chunk_name = `${removed_chunk[0]}.${removed_chunk[2]}`
			if(added_chunk_name === removed_chunk_name){
				change_log.change_index.push({
					from: removed_file,
					to: added_file
				})
				remove_from_files(added_file, change_log.add_index)
				remove_from_files(removed_file, change_log.remove_index)
				const added_file_content = get_file_content(added_file)
				const removed_file_content = get_file_content(removed_file)
				file_changes.push([[removed_file, removed_file_content],[added_file, added_file_content]])
			}
		}
	})
})
const create_patch = (data, old_name, new_name)=>{
	create_patch_file(`history.json`,JSON.stringify(change_log), false)
	data.forEach(d=>{
		const added_file_name = d[0][0]
		const added_file_content = d[0][1]
		const removed_file_name = d[1][0]
		const removed_file_content = d[1][1]
		const diff = Diff.createPatch(added_file_name || 'old_name', added_file_content,removed_file_content)
		create_patch_file(added_file_name+'.patch',diff)
	})
}
create_patch(file_changes)
