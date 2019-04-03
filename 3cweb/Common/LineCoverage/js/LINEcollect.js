$(function () {
    $.fn.extend({
        //表格合并单元格，colIdx要合并的列序号，从0开始  
        "rowspan": function (colIdx) {
            return this.each(function () {
                var that;
                $('tr', this).each(function (row) {
                    $('td:eq(' + colIdx + ')', this).filter(':visible').each(function (col) {
                        if (that != null && $(this).html() == $(that).html()) {
                            rowspan = $(that).attr("rowSpan");
                            if (rowspan == undefined) {
                                $(that).attr("rowSpan", 1);
                                rowspan = $(that).attr("rowSpan");
                            }
                            rowspan = Number(rowspan) + 1;
                            $(that).attr("rowSpan", rowspan);
                            $(this).hide();
                        } else {
                            that = this;
                        }
                    });
                });
            });
        }
    });

    //$("#dataTable_table").rowspan(0)
    //$("#dataTable_table").rowspan(1)
    //$("#dataTable_table").rowspan(2)
    //$("#dataTable_table").rowspan(3)
    //$("#dataTable_table").rowspan(4)
    //$("#dataTable_table").rowspan(5)
    //$("#dataTable_table").rowspan(6)
    //$("#dataTable_table").rowspan(7)
    for (var i = 0; i < 8; i++) {
        $("#dataTable_table").rowspan(i)
    }
})