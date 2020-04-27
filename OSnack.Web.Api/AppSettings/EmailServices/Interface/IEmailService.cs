using System.Threading.Tasks;

namespace OSnack.Web.Api.AppSettings.EmailServices.Interface
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string htmlMessage);
    }
}