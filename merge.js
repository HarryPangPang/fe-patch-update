const fs = require('fs')
const path = require('path')
const Diff = require('diff');

const old_folder = './dist1'
const new_folder = './dist2'
const patch_folder = './patch'
let old_dir = fs.readdirSync(path.resolve(old_folder))
let new_dir = fs.readdirSync(path.resolve(new_folder))

const get_file = (path_to_file)=>{
	const file = fs.existsSync(path_to_file)
	if(!file) return;
	return fs.readFileSync(path_to_file, {encoding: 'utf-8'})
}

const get_new_file = (name)=> get_file(path.resolve(new_folder+'/'+ name))

const merge = ()=>{
	const history = get_file(path.resolve(patch_folder+'/history.json'))
	if(history){
		const patch_history = JSON.parse(history)
		const add_index = patch_history.add_index
		const remove_index = patch_history.remove_index
		const change_index = patch_history.change_index
		if(add_index&&Array.isArray(add_index)){
			try {
				add_index.forEach(add=>{
					fs.writeFileSync(path.resolve(old_folder+'/'+ add), get_new_file(add),{encoding: 'utf-8'})
				})
			} catch (error) {
				
			}
		}
		if(remove_index&&Array.isArray(remove_index)){
			try {
				remove_index.forEach(remove=>{
					fs.unlinkSync(path.resolve(old_folder+'/'+ remove))
				})
			} catch (error) {
				
			}
		}
		if(change_index&&Array.isArray(change_index)){
			change_index.forEach(change => {
				const from = change.from
				const to = change.to
				const old_file = get_file(path.resolve(old_folder+ '/'+  from))
				const patch_file = get_file(path.resolve('./patch/' + from + '.patch'))
				const parsePatch = Diff.parsePatch(patch_file)
				const merge_content = Diff.applyPatch(old_file,parsePatch)
				fs.writeFileSync(path.resolve(old_folder+ '/' +  to), merge_content, {encoding: 'utf-8'})
				fs.unlinkSync(path.resolve(old_folder+'/'+ from))
			});
		}

	}
}

merge()