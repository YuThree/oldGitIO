<%@ WebHandler Language="C#" Class="GetAllLineTag" %>

using System;
using System.Web;
using Api.Foundation.entity.Foundation;
using System.Collections.Generic;
using Api.Foundation.service;
using Api;
using System.Text;
using Api.Foundation.entity.Cond;

public class GetAllLineTag : ReferenceClass, IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string linecode = HttpContext.Current.Request["linecode"];
        GetLineTag(linecode);
    }
    private void GetLineTag(string linecode)
    {
        StringBuilder LineStr = new StringBuilder();
        IList<Api.Foundation.entity.Foundation.Line> lineList = Api.ServiceAccessor.GetFoundationService().getAllLine();
        LineStr.Append("<div class='tabbable tabs-below'  style='height:50px;' id='linetags'>");
        LineStr.Append("<ul class='nav nav-tabs'>");
        for (int i = 0, count = lineList.Count; i < count; i++)
        {

            if (lineList[i].LINE_CODE == linecode)
            {
                LineStr.Append("<li class='active'><a href='#' data-toggle='tab' onclick=getLineinfo('" + lineList[i].LINE_CODE + "')>" + lineList[i].LINE_NAME.ToString() + "</a></li>");
            }
            else
            {
                LineStr.Append("<li><a href='#' data-toggle='tab' onclick=getLineinfo('" + lineList[i].LINE_CODE + "')>" + lineList[i].LINE_NAME.ToString() + "</a></li>");
            }
        }
        LineStr.Append("</ul>");
        LineStr.Append("</div>");
        HttpContext.Current.Response.Write(LineStr);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}