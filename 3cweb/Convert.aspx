<%@ page language="C#" autoeventwireup="true" inherits="Convert2, App_Web_lx43dfva" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
     <asp:Literal runat="server" ID="lab_re"></asp:Literal>
     <asp:TextBox ID="TextBox1" runat="server" Width="400" Text="11150.597577,4052.153692"></asp:TextBox>
     <asp:Button ID="Button1"  runat="server" Text="转换" onclick="Button1_Click" />

      新下拉框： <input id="txt_new" type="text"  />
    </form>
</body>
</html>
<script>
    $(function () {

        $('#txt_new').mySelectTree_Level2({});

    })

</script>