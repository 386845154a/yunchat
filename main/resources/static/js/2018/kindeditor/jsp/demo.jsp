<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
request.setCharacterEncoding("UTF-8");
String htmlData = request.getParameter("content1") != null ? request.getParameter("content1") : "";
%>
<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<title>KindEditor JSP</title>
	<script type="text/javascript" src="/assets/js/jquery-1.11.3.min.js"></script>
	<link rel="stylesheet" href="/js/kindeditor/themes/default/default.css" />
	<link rel="stylesheet" href="/js/kindeditor/plugins/code/prettify.css" />
	<script type="text/javascript" src="/js/kindeditor/kindeditor.js"></script>
	<script type="text/javascript" src="/js/kindeditor/kindeditor-min.js"></script>
	<script type="text/javascript" src="/js/kindeditor/lang/zh_CN.js"></script>
	<script type="text/javascript" src="/js/kindeditor/plugins/code/prettify.js"></script>
	<script type="text/javascript" src="/js/kindeditor/setkindeditor.js"></script>
	<script>
	var kindEditor = null;
	var basePath_ = ".";
	var uploadUrl = "";
	$(function() {
		setKindEditor($('textarea[name="content1"]'));
		$('input[name=getHtml]').click(function(e) {
			alert(kindEditor.html());
		});
		$('input[name=isEmpty]').click(function(e) {
			alert(kindEditor.isEmpty());
		});
		$('input[name=getText]').click(function(e) {
			alert(kindEditor.text());
		});
		$('input[name=selectedHtml]').click(function(e) {
			alert(kindEditor.selectedHtml());
		});
		$('input[name=setHtml]').click(function(e) {
			kindEditor.html('<h3>Hello KindEditor</h3>');
		});
		$('input[name=setText]').click(function(e) {
			kindEditor.text('<h3>Hello KindEditor</h3>');
		});
		$('input[name=insertHtml]').click(function(e) {
			kindEditor.insertHtml('<strong>插入HTML</strong>');
		});
		$('input[name=appendHtml]').click(function(e) {
			kindEditor.appendHtml('<strong>添加HTML</strong>');
		});
		$('input[name=clear]').click(function(e) {
			kindEditor.html('');
		});
	});
</script>
</head>
<body>
	<%=htmlData%>
	<form name="example" method="post" action="demo.jsp">
		<textarea name="content1" style="width:600px;height:100px;"></textarea>
		<br />
		<input type="submit" name="button" value="提交内容" /> (提交快捷键: Ctrl + Enter)
		
		<p>
				<input type="button" name="getHtml" value="取得HTML" />
				<input type="button" name="isEmpty" value="判断是否为空" />
				<input type="button" name="getText" value="取得文本(包含img,embed)" />
				<input type="button" name="selectedHtml" value="取得选中HTML" />
				<br />
				<br />
				<input type="button" name="setHtml" value="设置HTML" />
				<input type="button" name="setText" value="设置文本" />
				<input type="button" name="insertHtml" value="插入HTML" />
				<input type="button" name="appendHtml" value="添加HTML" />
				<input type="button" name="clear" value="清空内容" />
				<input type="reset" name="reset" value="Reset" />
			</p>
	</form>
</body>
</html>
<%!
private String htmlspecialchars(String str) {
	str = str.replaceAll("&", "&amp;");
	str = str.replaceAll("<", "&lt;");
	str = str.replaceAll(">", "&gt;");
	str = str.replaceAll("\"", "&quot;");
	return str;
}
%>