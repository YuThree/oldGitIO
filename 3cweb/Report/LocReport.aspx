<%@ page language="C#" enablesessionstate="true" autoeventwireup="true" inherits="Report_LocReport, App_Web_bayfktcg" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="/Lib/jquery-1.7.2/jquery-1.7.2.min.js" type="text/javascript"></script>
    <link href="/Common/js/CommonPerson/CommonPerson.css" rel="stylesheet" type="text/css" />
    <script src="/Common/js/CommonPerson/CommonPerson.js" type="text/javascript"></script>
    <script src="/Common/js/6cweb/MasterJs.js" type="text/javascript"></script>
    <link href="/Lib/ymPrompt/skin/qq/ymPrompt.css" rel="stylesheet" type="text/css" />
    <link href="/Lib/scrollBar/scrollStyle.css" rel="stylesheet" />
    <script src="/Lib/ymPrompt/ymPrompt.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(document).ready(function () {
            fullShow();
        });
        function showmeg() {
            ymPrompt.errorInfo('未查询到相关信息！', null, null, '提示信息', null);
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <rsweb:ReportViewer ID="reportViewer" runat="server" Font-Names="Verdana" Font-Size="8pt"
            InteractiveDeviceInfos="(集合)" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt"
            Width="100%" OnDrillthrough="reportViewer_Drillthrough" Height="430px" BackColor="White"
            PageCountMode="Actual" OnPreRender="reportViewer_PreRender" Visible="false" ShowRefreshButton="False">
            <LocalReport ReportPath="Report\rdlc\LocReport.rdlc">
            </LocalReport>
        </rsweb:ReportViewer>
    </div>
    </form>
</body>
</html>
<script>

</script>
