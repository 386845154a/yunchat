function create_task(project_Name) {
	$("#now_pname").val(project_Name);
	if (project_Name) {
		$("#taskModal").modal();
	}
}

function commit_task() {
	var projectName = $("#now_pname").val();
	if ($("#state option:selected").val() && $("#taskId").val() && $("#taskName").val() && $("#taskDes").val() && $("#taskType").val() && $("#path").val()){
		AjaxMethod.ajax('homeController/createTask', {
			'projectName' : projectName,
			'projectId' : $("#projectId").val(),
			'remark' : $("#remark").val(),
			'taskNum' : $("#taskNum").val(),
			'taskId' : $("#taskId").val(),
			'taskName' : $("#taskName").val(),
			'taskState' : $("#taskState").val(),
			'taskType' : $("#taskType").val(),
			'path' : $("#path").val(),
			'taskDes' : $("#taskDes").val()
		}).then(function (result){
			JSInteraction.saveProject(result.projec_tName, JSON.stringify(result.pJson));
			// location.reload();
		});
	} else {
		JqdeBox.message("erro", "你有未填写的信息！");
		return false;
	}
}

