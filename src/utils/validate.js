/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export var rule={
	checkPhone:(rule, value, callback) => {
		const rex = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
	  	if (!value) {
	   	 return callback(new Error('联系电话不能为空'))
	  	}
	  	if (rex.test(value)) {
	    	return callback()
	  	} else {
	    	return callback(new Error('联系电话输入有误，请重新输入'))
	  }
	},
	companyName:(rule, value, callback) => {
		//value=_utils.trim(value);
		const rex = /^[a-zA-Z\u4e00-\u9fa5\(\（\)\）]{1,50}$/
	  	if (!value) {
			return callback(new Error('企业名称不能为空'))
	  	}
	  	if(value.length>50){
	  		return callback(new Error('企业名称过长'))
	  	}
	  	if (rex.test(value)) {
	    	return callback()
	  	} else {
	    	return callback(new Error('含有特殊字符'))
	  }
	},
	email:(rule, value, callback) => {
		const rex =/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		if(value&&!rex.test(value)){
			return callback(new Error('请输入正确的邮箱。'));
		}else{
			return callback()
		}
	},
	signDate:(rule, value, callback) => {
		const rex =/^\d{4}-\d{2}-\d{2}$/;
		if(''==value||null==value){
			return callback(new Error('请输入授权书签订日期。'));
		}else if(!rex.test(value.format("yyyy-mm-dd"))){
			return callback(new Error('请选择正确的日期。'));
		}else{
			return callback()
		}
	}
}
