/*/ http://www.jeasyui.net/plugins/183.html  参数具体使用api
// 多层子表格需要应用    \datagrid-detailview.js
render重写增加一个折叠展示按钮增加至每一行头部








*/
var testJson={"rows":[{"id":17746890,"title":"Exapunks","points":170,"user":"yumaikas","time":1534113932,"time_ago":"7 hours ago","comments_count":23,"type":"link","url":"http://www.zachtronics.com/exapunks/","domain":"zachtronics.com"},{"id":17743960,"title":"One man designed and built the ultimate bush plane","points":73,"user":"privong","time":1534074498,"time_ago":"18 hours ago","comments_count":16,"type":"link","url":"https://arstechnica.com/cars/2018/08/one-man-designed-and-built-the-ultimate-bush-plane/","domain":"arstechnica.com"},{"id":17745779,"title":"Dijkstra's in Disguise","points":204,"user":"ColinWright","time":1534099545,"time_ago":"11 hours ago","comments_count":9,"type":"link","url":"https://blog.evjang.com/2018/08/dijkstras.html","domain":"blog.evjang.com"},{"id":17746013,"title":"Growers Are Beaming Over the Success of Lasers to Stave Off Birds","points":122,"user":"ryan_j_naughton","time":1534102306,"time_ago":"10 hours ago","comments_count":91,"type":"link","url":"https://www.npr.org/sections/thesalt/2018/08/12/633065620/growers-are-beaming-over-the-success-of-lasers-to-stave-off-thieving-birds","domain":"npr.org"},{"id":17745726,"title":"Frink","points":160,"user":"tosh","time":1534099048,"time_ago":"11 hours ago","comments_count":35,"type":"link","url":"https://frinklang.org/","domain":"frinklang.org"},{"id":17743913,"title":"Real-Time Grass and Other Procedural Objects on Terrain (2015)","points":21,"user":"mpweiher","time":1534073427,"time_ago":"18 hours ago","comments_count":4,"type":"link","url":"http://jcgt.org/published/0004/01/02/","domain":"jcgt.org"},{"id":17747273,"title":"In a Town of 11 People, Mysterious Disappearance Turns Neighbor Against Neighbor","points":106,"user":"danso","time":1534120108,"time_ago":"5 hours ago","comments_count":44,"type":"link","url":"https://www.nytimes.com/2018/08/11/world/australia/larrimah-mystery.html","domain":"nytimes.com"},{"id":17747635,"title":"AssemblyAI: speech-to-text API","points":34,"user":"juancampa","time":1534126825,"time_ago":"3 hours ago","comments_count":15,"type":"link","url":"http://assemblyai.com","domain":"assemblyai.com"},{"id":17739349,"title":"What Does Immersing Yourself in a Book Do to Your Brain?","points":83,"user":"dpflan","time":1533988772,"time_ago":"2 days ago","comments_count":28,"type":"link","url":"https://lithub.com/what-does-immersing-yourself-in-a-book-do-to-your-brain/","domain":"lithub.com"},{"id":17744150,"title":"Academic Torrents – Making 27TB of research data available","points":833,"user":"jacquesm","time":1534078612,"time_ago":"16 hours ago","comments_count":108,"type":"link","url":"http://academictorrents.com/","domain":"academictorrents.com"},{"id":17743742,"title":"User-space RCU","points":11,"user":"ingve","time":1534068552,"time_ago":"19 hours ago","comments_count":1,"type":"link","url":"https://lwn.net/Articles/573424/","domain":"lwn.net"}]}

$(function(){

    




    $('#xx').datagrid({
        view: detailview,
        height: 500,
        loadMsg:'loading···',
        fit: true,//宽度响应
        striped: true,  //斑马线
        data:testJson,
        autoRowHeight:true,
        fitColumns:true,//是否横向滚动条
        singleSelect:true,//是否单选
        rownumbers:true,//是否显示序号
        rowStyler:function(index,row){
            if (row.listprice>1){
            return 'background-color:pink;color:blue;font-weight:bold;';
            }
            },
// 					height:'auto',
        columns:[[
            {field:'id',title:'id',width:100,align:'center',resizable:true,hidden:false,editor:'text'},
            {field:'title',title:'title',width:100,styler:cellStyler},
            {field:'points',title:'points',width:100},
            {field:'user',title:'user',width:100},
            {field:'time',title:'time',width:100,editor:'text'}
        ]],
        detailFormatter:function(index,row){// 详细表 容器
            return '<div style=""><table id="ddv-' + index + '" ></table></div>';
        },
        onExpandRow: function(index,row){//嵌套第一层  展开详细
            var ddv = $(this).datagrid('getRowDetail',index).find('#ddv-'+index);//获取容器
            ddv.datagrid({
                view: detailview,
                data:testJson,
                autoRowHeight:true,
                fitColumns:true,//是否横向滚动条
                singleSelect:true,//单选
                rownumbers:true,
// 					height:'auto',
                columns:[[
                    {field:'title',title:'名字',width:100},
                    {field:'time_ago',title:'时间',width:100},
                    {field:'comments_count',title:'合计',width:100},
                    {field:'type',title:'类型',width:100},
                    {field:'url',title:'地址',width:100}
                ]],
                detailFormatter:function(index,row2){//子集容器
                    return '<div"><table id="ddv2-' + index + '" style=""></table></div>';
                },
                onExpandRow: function(index2,row2){//嵌套第二层
                    var ddv2 = $(this).datagrid('getRowDetail',index2).find('#ddv2-'+index2);//获取容器
                    ddv2.datagrid({
                        view: detailview,
                        data:testJson,
                        autoRowHeight:true,
                        fitColumns:true,
                        singleSelect:false,
                        rownumbers:true,
                        loadMsg:'8787',
// 							height:'auto',
                        columns:[[
                            {field:'time',title:'time',width:100},
                            {field:'comments_count',title:'comments_count',width:100,align:'right'},
                            {field:'type',title:'type',width:100,align:'right'},
                            {field:'url',title:'url',width:100,align:'right'},
                            {field:'domain',title:'domain',width:100,align:'right'}
                        ]],
                        detailFormatter:function(index2,row3){// 返回行明细内容的格式化函数。
                            return '<div"><table id="ddv3-' + index2 + '" style=""></table></div>';
                        },
                        onExpandRow: function(index3,row3){//当展开一行时触发
                            var ddv3 = $(this).datagrid('getRowDetail',index3).find('#ddv3-'+index3);//
                            ddv3.datagrid({//最后一层 没有detailview
                                data:testJson,
                                autoRowHeight:true,
                                fitColumns:true,//
                                singleSelect:false,
                                rownumbers:true,
                                loadMsg:'',
// 									height:'auto',
                                columns:[[
                                    {field:'id',title:'id',width:100},
                                    {field:'title',title:'title',width:100,align:'right'},
                                    {field:'points',title:'points',width:100,align:'right'},
                                    {field:'user',title:'user',width:100,align:'right'},
                                    {field:'time',title:'time',width:50,align:'right'},
                                    {field:'time_ago',title:'time_ago',width:100,align:'right'},
                                    {field:'comments_count',title:'comments_count',width:100,align:'right'},
                                    {field:'type',title:'type',width:100,align:'right'},
                                    {field:'url',title:'url',width:250,},
                                    {field:'domain',title:'domain',align:'right'}
                                ]],
                                detailFormatter:function(index3,row){//严重注意喔
                                    return '<div style="padding:2px"><table id="ddv3-' + index3 + '"></table></div>';//严重注意喔
                                },
                                onResize:function(){//展开折叠时
                                    ddv2.datagrid('fixDetailRowHeight',index3);
                                        ddv.datagrid('fixDetailRowHeight',index2);
                                    $('#dg').datagrid('fixDetailRowHeight',index);
                                },
                                onLoadSuccess: function () {
                                    ddv2.datagrid('fixDetailRowHeight', index3);
                                    ddv2.datagrid('fixRowHeight', index3);
                                    ddv.datagrid('fixDetailRowHeight', index2);
                                    ddv.datagrid('fixRowHeight', index2);
                                    $('#dg').datagrid('fixDetailRowHeight', index);
                                    $('#dg').datagrid('fixRowHeight', index);
                                }
                            });//严重注意喔
                            ddv2.datagrid('fixDetailRowHeight',index);
                            ddv.datagrid('fixDetailRowHeight',index);
                            $('#dg').datagrid('fixDetailRowHeight',index);
                        },
                        onCollapseRow: function(index3,row3){//严重注意喔
                            var ddv3 = $(this).datagrid('getRowDetail',index3).find('#ddv3-'+index3);
                            ddv3.datagrid({
                                onResize:function(){
                                    ddv2.datagrid('fixDetailRowHeight',index3);
                                    ddv.datagrid('fixDetailRowHeight',index2);
                                        $('#dg').datagrid('fixDetailRowHeight',index);
                                }
                            });//严重注意喔
                            ddv2.datagrid('fixDetailRowHeight',index);
                            ddv.datagrid('fixDetailRowHeight',index);
                            $('#dg').datagrid('fixDetailRowHeight',index);
                        },
                        onResize:function(){//严重注意喔
                            ddv.datagrid('fixDetailRowHeight',index2);
                            $('#dg').datagrid('fixDetailRowHeight',index);
                        },
                        onLoadSuccess:function(){//严重注意喔
                                ddv.datagrid('fixDetailRowHeight',index2);
                                ddv.datagrid('fixRowHeight',index2);
                                $('#dg').datagrid('fixDetailRowHeight',index);
                                $('#dg').datagrid('fixRowHeight',index);
                        }
                    });//严重注意喔
                     ddv.datagrid('fixDetailRowHeight',index2);
                     $('#dg').datagrid('fixDetailRowHeight',index);
                },
                onCollapseRow: function(index2,row2){//严重注意喔
                    var ddv2 = $(this).datagrid('getRowDetail',index2).find('#ddv2-'+index2);
                    ddv2.datagrid({
                        onResize:function(){
                            ddv.datagrid('fixDetailRowHeight',index2);
                            // $('#dg').datagrid('fixDetailRowHeight',index);
                        }
                    });//严重注意喔
                    //  ddv.datagrid('fixDetailRowHeight',index2);
                    //  $('#dg').datagrid('fixDetailRowHeight',index);
                },
                // onResize:function(){
                //      $('#dg').datagrid('fixDetailRowHeight',index);
                // },
                onLoadSuccess:function(){
                        // $('#dg').datagrid('fixDetailRowHeight',index);
                        // $('#dg').datagrid('fixRowHeight',index);

                }
            });
              $('#dg').datagrid('fixDetailRowHeight',index);
        },
        onLoadSuccess:function(){//加载完成
            //设置当前层级展开------------start
            // var row = $("#dg").datagrid("getRows");
            // for (var r = 0; r < row.length; r++)
            // {
            //     $("#dg").datagrid("expandRow",r);
            // }
             //设置当前层级展开------------end
             
             //设置当前层级折叠------------start
            // var row = $("#dg").datagrid("getRows");
            // for (var r = 0; r < row.length; r++)
            // {
            //     $("#dg").datagrid("collapseRow",r);
            // }
             //设置当前层级折叠------------end
        },
        onResize:function(){//展开折叠时
           console.log('resize')
            //设置当前层级折叠------------start
            var row = $("#dg").datagrid("getRows");
            for (var r = 0; r < row.length; r++)
            {
                $("#dg").datagrid("collapseRow",r);
            }
             //设置当前层级折叠------------end
                ;
            console.log('resize'+arguments)
             
            
             
        },
        onCollapseRow:function(index,row){//关闭子集触发
            console.log('关闭'+arguments)

        },
        onClickCell:function(){//单元格单击触发
             console.log(arguments)
        },
        onClickRow:function(index){//行单击触发
            // console.log('单击行'+arguments)
        
            
        },
        onDblClickRow:function(){//行双击触发
            // console.log('双击行'+arguments)
            // $(this).datagrid('loading');//loading状态
            // setTimeout(function(){
            //     $('#dg').datagrid('loaded');//loading状态关闭
            // },1000)
        },

        // onDblClickCell: function(index,field,value){
        //     $(this).datagrid('beginEdit', index);
        //     var This=this;
        //     var ed = $(this).datagrid('getEditor', {index:index,field:field});
        //     $(ed.target).blur(function(){
        //         $(This).datagrid('endEdit', index);//cancelEdit 等类似

        //     })
        // },
        onBeforeEdit:function(){
            console.log(arguments)
        },
        onAfterEdit:function(){
            console.log(arguments)

        },
        onCancelEdit:function(){
            console.log(arguments)

        }
      
    });
});
//设置style
function cellStyler(value,row,index){
        return 'background-color:blue;color:white;height:50px';
    
}

loaddatagrid('dg',{
    data:testJson,
    onClickCell:function(){//单元格单击触发
        console.log(arguments)
   },
    columns:[[
        {field:'id',title:'id',width:100,align:'center',resizable:true,hidden:false,editor:'text'},
        {field:'title',title:'title',width:100,styler:cellStyler},
        {field:'points',title:'points',width:100},
        {field:'user',title:'user',width:100},
        {field:'time',title:'time',width:100,editor:'text'}
    ]]

},{
    data:testJson,
    columns:[[
        {field:'title',title:'名字',width:100},
        {field:'time_ago',title:'时间',width:100},
        {field:'comments_count',title:'合计',width:100},
        {field:'type',title:'类型',width:100},
        {field:'url',title:'地址',width:100}
    ]]

},{
    data:testJson,
    columns:[[
        {field:'time',title:'time',width:100},
        {field:'comments_count',title:'comments_count',width:100,align:'right'},
        {field:'type',title:'type',width:100,align:'right'},
        {field:'url',title:'url',width:100,align:'right'},
        {field:'domain',title:'domain',width:100,align:'right'}
    ]],
},{
    data:testJson,
    columns:[[
        {field:'time',title:'xxxxxx',width:100},
        {field:'comments_count',title:'xxxxxxxx',width:100,align:'right'},
        {field:'type',title:'xxxx',width:100,align:'right'},
        {field:'url',title:'xxxxxx',width:100,align:'right'},
        {field:'domain',title:'xxxxxx',width:100,align:'right'}
    ]],
})
