

// 设置菜单
setMenu({
    Menu:[
        {firstTitle:'综合信息分析',firstHref:'主页.html',subMenu:[],subHref:[]},
        { firstTitle: '学生健康画像', firstHref:'学生健康画像.html'},
        {
        	firstTitle:'报表统计',
        	firstHref:'形态机能汇总表.html',
        	subMenu:['学生形态机能汇总表','学生营养状况汇总表','学生近视情况汇总表','学生龋齿状况汇总表','中小学生健康体检基础数据统计表'],
        	subHref:['形态机能汇总表.html','营养状况汇总表.html','近视情况汇总表.html','龋齿状况汇总表.html','健康体检基础数据表.html']
        },
        {
            firstTitle:'源数据',
            firstHref:'',
            subMenu:['智能手环','健康小屋','学术体检表','校医体检数据','学生体质健康标准评分表'],
            subHref:['智能手环.html','健康小屋.html','学术体检表.html','校医体检数据.html','学生体质健康标准评分表.html']},
        {firstTitle:'用户管理',firstHref:'用户管理.html'},
        {firstTitle:'设备管理',firstHref:'设备管理.html'},
        {firstTitle:'字典表维护',firstHref:'字典表维护.html'},
    ],
});

var loading = new Loading();
// loading.open()
