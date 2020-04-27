using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.Globalization;
using System.Threading;

namespace OSnack.Web.App.Management
{
    /// <summary>
    /// Program starts as console application
    /// </summary>
    public class Program
    {
        public static void Main(string[] args)
        {
            /// Set the application culture to GB English
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture("en-GB");
            Thread.CurrentThread.CurrentUICulture = CultureInfo.CreateSpecificCulture("en-GB");

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                    webBuilder.UseStartup<Startup>()
                );
    }
}
