<%@ page language="C#" enablesessionstate="true" autoeventwireup="true" inherits="Report_3CRunStatus, App_Web_bayfktcg" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>3C装置运行月度情况汇总表</title>
    <script src="/Common/js/6cweb/LoadPubFile_base.js" type="text/javascript"></script>
    <script type="text/javascript">
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
            Width="100%" Height="430px" BackColor="White" PageCountMode="Actual" OnPreRender="reportViewer_PreRender"
            Visible="false" ShowRefreshButton="False">
            <LocalReport ReportPath="Report\rdlc\3CRunStatus.rdlc">
            </LocalReport>
        </rsweb:ReportViewer>
    </div>
    </form>
</body>
</html>
