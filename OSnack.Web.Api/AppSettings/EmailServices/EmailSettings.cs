namespace OSnack.Web.Api.AppSettings.EmailServices
{
    public class EmailSettings
    {
        internal string MailServer { get; set; }
        internal int MailPort { get; set; }
        internal string SenderName { get; set; }
        internal string Sender { get; set; }
        internal string Password { get; set; }
    }
}
