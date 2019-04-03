<%@ page language="C#" autoeventwireup="true" inherits="Common_ExcelToData_1CExcel, App_Web_rsyqgrq1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Excel入库</title>
    <script src="/Common/js/6cweb/LoadPubFile_base.js" type="text/javascript"></script>
</head>
<body style="text-align: center">
    <center>
    <form id="form1" runat="server">
    <div>
        <table style="width: 576px; border-collapse: separate; text-align: center">
            <tr>
                <td colspan="3">
                    <h2 style="padding-top:10px">
                    导入6C问题库数据
                        </h2>
                        </td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: center">
                    <asp:FileUpload ID="FileUpload1" runat="server" style="border:1px #43a1da solid; border-radius:5px; width:305px;padding-top: 4px;padding-left: 4px; "/>
                    &nbsp; &nbsp;
                    <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="导入" class="btn btn-primary"/></td>
            </tr>
        </table>  
    </div>
    </form>
   </center>
</body>
</html>
