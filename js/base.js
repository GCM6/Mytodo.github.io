;(function () {
var $form_adda_task = $('#sub');
var $body = $('body');
var $window = $(window);
    var  task_list = [];
    var dels_task;
    var det_task;
    var task_det_mask = $('.task-det-mask');
    var task_det = $('.task-det');
    var current_index;
    var update_form;
    var task_det_content;
    var task_det_content_input;
    var checkbox_completes;
    var msg1 = $('.msg');
    var msg_content = msg1.find('.msg-content');
    var msg_confrom = msg1.find('.confirme');
    var alerter = $('#al');
  init();
  function pops(arg) {
      if(!arg)
      {
          console.error('pops title is required ');
      }
      var conf = {},
          $box,
          $mask,
          confros;

      /* 返回一个对象dfd */
      var dfd = $.Deferred();
      if(typeof arg === 'string') {
          conf.title = arg;
      } else {
          conf = $.extend(conf, arg)
      }
        $box = $('<div>' +
            '<div class="pop-title">' +conf.title +'</div>'+
            '<div class="pop-content">'+
            '<div class="ma-pop"><button class="pop-button confirm">确定</button>' +
            '<button class="pop-button1 confirm2">取消</button>' +
            '</div>'+
            '</div>'+
            '</div>')
            .css({
                color: '#444',
                position: 'fixed',
                width: 300,
                height: 100,
                padding: '15px 10px',
                background: '#fff',
                'border-radius': 3,
                'box-shadow': '0 2px 3px rgba(0,0,0,0.4)'
            });
        var _title = $box.find('.pop-title').css({
            padding: '5px 10px',
            'font-weight': '900',
            'font-size': '20',
            'text-align': 'center'
        });
      var _content = $box.find('.pop-content').css({
          padding: '5px 10px',
          'text-align': 'center'
      });
      var $confirm = _content.find('button.confirm');
      var _cancel = _content.find('button.confirm2')
      $confirm.on('click',function () {
          confros = true
      });
      _cancel.on('click',function () {
          confros = false
      });
      var timers = setInterval(function () {
          if (confros !== undefined) {
              /* 把confros传到上面的.then的res */
              dfd.resolve(confros);
              clearInterval(timers);
              dismiss_pop()
          }
      },50);
      $mask = $('<div></div>')
          .css({
              position: 'fixed',
              background: 'rgba(0,0,0,.5)',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
          });
      $mask.on('click',function () {
          confros = false
      });
      function dismiss_pop() {
          /* 将mask和box删除 */
          $mask.remove();
          $box.remove();

      }
      function aj_box_position() {
          var window_width = $window.width();
          var window_height= $window.height();
          var box_width= $box.width();
          var box_height= $box.height();
          var move_x, move_y;
          move_x = (window_width - box_width)/2;
          move_y = (window_height - box_height)/2 - 20;
          $box.css({
              left: move_x,
              top: move_y
          })
      }
      /* 动态计算 */
      $window.on('resize',function () {
          aj_box_position();
      });
      $mask.appendTo($body);
      $box.appendTo($body);
      $window.resize();
      return dfd.promise();
  }
    $form_adda_task.click( function (e) {
        var  new_task = {};
        e.preventDefault();/* 阻止元素发生默认的行为 */
        var contents = $('#textcontent');
         new_task.content = contents.val();/* 获取输入的值 */
        /* 如果获取的值为空则直接返回，否则继续执行 */
        if(!new_task) return;
       /* console.log('new_task',new_task);*/
        /* 存入新的值Task */
        /* 如果为真则调用re_task_list方法 */
        if(add_task(new_task)) {
           /* re_task_list();*/
            contents.val(null)
        }
    });
    function add_task(new_task) {
        /* 将新的值推进task_list中 */
        task_list.push(new_task);
        r_task_list();
        return true;
    }
    /*
    * 刷新localStorage并更新视图
    * */
    function r_task_list() {
        /* 存进localstore中 */
        store.set('task_list', task_list);
        re_task_list()
    }
    /*  监听删除事件 */
    function listion_delete() {
        /* 给页面所以的删除注册一个按钮点击删除的时候触发 */
        dels_task.on('click', function () {
            var th  = $(this);
            /* 获取到的父亲的父亲 */
            var it = th.parent().parent();
            var index = it.data('index');
            pops('确定要删除么？').then(function (res) {
                /* 如果确定则执行删除，否则就返回null */
                res ? del_task(index): null
            });

        });
    }
    function del_task(index) {
        /* 如果index的值为undefined,注意0的时候，或者不存在则直接返回 */
        if(index === undefined || !task_list[index]) return;
        /* 使用splice */
        task_list.splice(index,1);
        /* 存进localstore中 */
        r_task_list();
    }
    function init() {
        /*store.clear();*/
        task_list = store.get('task_list') || [];
        linten_event();
        if(task_list.length) {
            re_task_list();
            task_re_check()
        }
    }
    function task_re_check() {
        var curr_time;
        var itl = setInterval(function () {
            for(var i=0; i<task_list.length; i++) {
                var item1 = task_list[i];
                if(!item1 || !item1.tasktime || item1.informed )/* informed是内置的不能随便个 更改 */
                    continue;
                    curr_time = (new Date()).getTime();
                    var timemap = (new Date(item1.tasktime)).getTime();
                    if (curr_time - timemap >= 1) {
                        updtaetask(i, {informed: true});
                        show_msg(item1.content)
                    }
            }
        }, 300)
    }
    function show_msg(msg) {
        if(!msg) return;
        msg_content.html(msg);
        alerter.get(0).play();
        msg1.show()
    }
    function hide_msg() {
        msg1.hide()
    }
    function linten_event() {
        msg_confrom.on('click', function () {
            hide_msg();
        })
    }
    function re_task_list() {
        /* 获取任务清单列表的task-list */
        var tasklist = $('.task-list');
        /* 注意，添加之前必须将原来的html添加的数据为空 */
        tasklist.html('');
        var completes_items = [];
        /* 遍历localstore中的task_list数组 */
       for(var i = 0;i<task_list.length; i++) {
          var item = task_list[i];
          if(item && item.completes) {
              completes_items[i] = item
          } else {
              /* 将遍历的数据遍历到下面的模板 */
              var list = render(item, i);
              /* 将数据添加到节点 */
              tasklist.prepend(list)
          }
       }
       for(var j =0; j<completes_items.length; j++) {
           list = render(completes_items[j], j);
           if(!list) continue;
           list.addClass('completed');
           /* 将数据添加到节点 */
           tasklist.append(list)
       }
        /* 因为jq里是动态渲染的只能在这里获取dom */ 
        dels_task = $('.action');
        det_task = $('.action1');
        checkbox_completes = $('.completes');
        /* 因为jq不会自动去绑定数据和视图的变化 */
        listion_delete();
        listion_task_det();
        listion_checkbox_complete()
    }
    /* 循环模板 */
    function render(data, index) {
        /* 如果Data为空或者indexundefined等于则直接返回 */
        if(!data || index ===undefined) return;
        var ren_task = '<div class="tast-item" data-index="' + index + '">' +
            '<span><input  class="completes"' + (data.completes? 'checked':'') + ' type="checkbox"></span>'+
            '<span class="task-container">'+data.content+'</span>'+
            '<span class="fl">'+
        '<span class="action" >  删除</span>'+
            '<span class="action1" > 详情</span>'+
            '</span>'+
            '</div>';
        return $(ren_task)
    }
    /*  监听task */
    function listion_task_det() {
        var task_item = $('.tast-item');
        var index;
        /* 双击出现详情页面 */
        task_item.on('dblclick', function () {
            index  = $(this).data('index');
            show_det(index)
        });
        det_task.on('click', function () {
            var th  = $(this);
            /* 获取到的父亲的父亲 */
            var it = th.parent().parent();
             index = it.data('index');
            show_det(index)
        });
        task_det_mask.on('click', function () {
            hide_det();
        })
    }
    /* 查看详情 */
    function show_det(index) {
        current_index = index;
        task_det_mask.show();
        task_det.show();
        ren_task_det( index );

    }
    function hide_det() {
        task_det_mask.hide();
        task_det.hide()

    }
    function ren_task_det( index ) {
        if(index === undefined || !task_list[index]) return;
        var item = task_list[index];
        var tpl =  '<form>'+
            '<div class="content">'+ item.content +
            '</div>'+
            '<div class="input-item">'+
            '<input style="display: none" type="text" name="content" value="'+ (item.content || '') +'">'+
            '</div>'+
            '<div>'+
            '<div class="desc input-item">'+
            '<textarea cols="10" rows="3.5" name="desc">' + (item.desc || '') + '</textarea>'+
            '</div>'+
            '</div>'+
            '<div class="task-time input-item">'+
            '<label>提醒时间</label>'+
            '<input class="datetime" type="text" name="tasktime" value="'+ (item.tasktime || '') +'"autocomplete="off">'+
            '<button type="submit" class="input-item input-items">更新</button>'+
            '</div>'+
            '</form>';
        task_det.html(null);
        task_det.html(tpl);
        $('.datetime').datetimepicker();
        /* 注册form */
        update_form = task_det.find('form');
        /* 找到.content样式 */
        task_det_content = update_form.find('.content');
        /* 找到input */
        task_det_content_input = update_form.find('[name=content]');
        /* 双击那个元素则进入输入的文本框 */
        task_det_content.on('dblclick',function () {
            /* 文本框显示 */
            task_det_content_input.show();
            /* 显示的隐藏 */
            task_det_content.hide()
        });
        /* 注册按钮 */
        update_form.on('submit',function (e) {
            /* 将默认行为阻止 */
            e.preventDefault();
            var data = {};
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.tasktime = $(this).find('[name=tasktime]').val();
            updtaetask(index, data);
            hide_det()
        })
    }
    function updtaetask(index, data) {
        if(index ===undefined || !task_list[index]) return;
        task_list[index] = $.extend({},task_list[index], data);
        /* 更新数据 */
        r_task_list();
    }
    /* 监听完成的task事件 */
    function  listion_checkbox_complete() {
        checkbox_completes.on('click', function () {
            var th = $(this);
            var index = th.parent().parent().data('index');
            var item = store.get('task_list')[index];
           if(item.completes) {
               updtaetask(index, {completes: false});
           } else {
               updtaetask(index, {completes: true});
           }

        })
    }
})();
