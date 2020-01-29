
function imageOnClick(){

    document.getElementById('foto').click();//my_photo隐藏的input[file]的id

}


$("#avatar_file").change(function () {
	//avatar_file  input[file]的ID    
	// 获取上传文件对象    
	var file = $(this)[0].files[0];    
	// 读取文件URL   
	var reader = new FileReader();    
	reader.readAsDataURL(file);   
	// 阅读文件完成后触发的事件   
	reader.onload = function () {       
	   // 读取的URL结果：this.result      
	   $("#avatar_img").attr("src", this.result);
	   //avatar_img  img标签的ID    
}});
