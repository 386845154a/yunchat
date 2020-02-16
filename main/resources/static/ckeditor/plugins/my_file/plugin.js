(function(){
    //Section 1 : 按下自定义按钮时执行的代码
    var a= {
            exec:function(editor){
                updateFiles();
            }
        },
        //Section 2 : 创建自定义按钮、绑定方法
        b='my_file';
    CKEDITOR.plugins.add(b,{
        init:function(editor){
            editor.addCommand(b,a);
            editor.ui.addButton('my_file',{
                label:'my_file',
                icon: this.path + 'upload.png',
                command:b
            });
        }
    });
})();