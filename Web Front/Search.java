import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
public class Search extends HttpServlet
{
public void doGet(HttpServletRequest request,HttpServletResponse response)throws ServletException,IOException
{
String name=request.getParameter("name");
response.sendRedirect("https:/www.google.co.in/search?q="+name);
}
}
