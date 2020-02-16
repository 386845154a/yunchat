$(function() {

});

function msgcontent(id) {
    //根据id，向后台请求聊天内容所有属性
    //历史消息，对方等级
    //json格式
    document.getElementById('msgcontent').innerHTML = '<div class="box box-danger direct-chat direct-chat-danger">\n' +
        '  <div class="box-header with-border">\n' +
        '    <h3 class="box-title">Direct Chat</h3>\n' +
        '    <div class="box-tools pull-right">\n' +
        '      <span data-toggle="tooltip" title="3 New Messages" class="badge bg-red">3</span>\n' +
        '      <button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>\n' +
        '      <!-- In box-tools add this button if you intend to use the contacts pane -->\n' +
        '      <button class="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle"><i class="fa fa-comments"></i></button>\n' +
        '      <button class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>\n' +
        '    </div>\n' +
        '  </div><!-- /.box-header -->\n' +
        '  <div class="box-body">\n' +
        '    <!-- Conversations are loaded here -->\n' +
        '    <div class="direct-chat-messages">\n' +
        '      <!-- Message. Default to the left -->\n' +
        '      <div class="direct-chat-msg">\n' +
        '        <div class="direct-chat-info clearfix">\n' +
        '          <span class="direct-chat-name pull-left">Alexander Pierce</span>\n' +
        '          <span class="direct-chat-timestamp pull-right">23 Jan 2:00 pm</span>\n' +
        '        </div><!-- /.direct-chat-info -->\n' +
        '        <img class="direct-chat-img" src="../dist/img/user1-128x128.jpg" alt="message user image"><!-- /.direct-chat-img -->\n' +
        '        <div class="direct-chat-text">\n' +
        '          Is this template really for free? That\'s unbelievable!\n' +
        '        </div><!-- /.direct-chat-text -->\n' +
        '      </div><!-- /.direct-chat-msg -->\n' +
        '\n' +
        '      <!-- Message to the right -->\n' +
        '      <div class="direct-chat-msg right">\n' +
        '        <div class="direct-chat-info clearfix">\n' +
        '          <span class="direct-chat-name pull-right">Sarah Bullock</span>\n' +
        '          <span class="direct-chat-timestamp pull-left">23 Jan 2:05 pm</span>\n' +
        '        </div><!-- /.direct-chat-info -->\n' +
        '        <img class="direct-chat-img" src="../dist/img/user3-128x128.jpg" alt="message user image"><!-- /.direct-chat-img -->\n' +
        '        <div class="direct-chat-text">\n' +
        '          You better believe it!\n' +
        '        </div><!-- /.direct-chat-text -->\n' +
        '      </div><!-- /.direct-chat-msg -->\n' +
        '    </div><!--/.direct-chat-messages-->\n' +
        '\n' +
        '    <!-- Contacts are loaded here -->\n' +
        '    <div class="direct-chat-contacts">\n' +
        '      <ul class="contacts-list">\n' +
        '        <li>\n' +
        '          <a href="#">\n' +
        '            <img class="contacts-list-img" src="../dist/img/user1-128x128.jpg" alt="Contact Avatar">\n' +
        '            <div class="contacts-list-info">\n' +
        '              <span class="contacts-list-name">\n' +
        '                Count Dracula\n' +
        '                <small class="contacts-list-date pull-right">2/28/2015</small>\n' +
        '              </span>\n' +
        '              <span class="contacts-list-msg">How have you been? I was...</span>\n' +
        '            </div><!-- /.contacts-list-info -->\n' +
        '          </a>\n' +
        '        </li><!-- End Contact Item -->\n' +
        '      </ul><!-- /.contatcts-list -->\n' +
        '    </div><!-- /.direct-chat-pane -->\n' +
        '  </div><!-- /.box-body -->\n' +
        '  <div class="box-footer">\n' +
        '    <div class="input-group">\n' +
        '      <input type="text" name="message" placeholder="Type Message ..." class="form-control">\n' +
        '      <span class="input-group-btn">\n' +
        '        <button type="button" class="btn btn-danger btn-flat">Send</button>\n' +
        '      </span>\n' +
        '    </div>\n' +
        '  </div><!-- /.box-footer-->\n' +
        '</div><!--/.direct-chat -->';
}