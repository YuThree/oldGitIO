

/*分页*/
//allPage 总页数
//nowPage 当前页
//allDataNum 总数据量
//showNum 显示的数据量
//showNumArr 选择显示数据量的下拉选择
//pageBoxClass 放分页的容器的class
//showPage 显示的页数
//pageFun 当当前页改变触发的函数
//showNumFun 当选择一页数据量的时候触发的函数
pageIng({
    allDataNum: 30,
    showNum: 10,
    showNumArr: [10, 20, 30],
    pageBoxClass: "pageFather",
    allPage: 100,
    showPage: 5,
    nowPage: 2,
    pageFun: function (num, O) {
        console.log(num);
        console.log(O);
    },
    showNumFun: function (num) {
        console.log(num);
    }
});

	// 滚动条
    $(".scrollBox").panel({
        iWheelStep:32,
    });