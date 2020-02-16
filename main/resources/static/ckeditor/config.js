/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	config.language = 'zh-cn';
    config.extraPlugins="my_file";
    config.height = 100;
    // ckedior窗口大小调整功能
    config.removePlugins = 'elementspath';
    config.resize_enabled = false;
    config.toolbar =
        [
            [ 'Undo', 'Redo' ],	// Defines toolbar group without name.
            { name: 'basicstyles', items: [ 'Bold', 'Italic']},
            { name: 'styles', items : ['FontSize' ] },
            { name: 'insert', items : [ 'my_file','Smiley'] }
        ]
};
