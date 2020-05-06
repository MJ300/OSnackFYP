using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Threading.Tasks;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using MailKit.Security;
using System.Net.Security;
using HtmlCreator.EmailServices;
using OSnack.Web.Api.AppSettings.CustomTypes;
using System.Collections.Generic;
using OSnack.Web.Api.AppSettings.EmailServices.Interface;
using OSnack.Web.Api.AppSettings.CustomExtentions;
using Newtonsoft.Json;
using OSnack.Web.Api.Database.Context;
using OSnack.Web.Api.Database.Models;

namespace OSnack.Web.Api.AppSettings.EmailServices
{
    public class oEmailService : IEmailService
    {

        private byte[] Attachment { set; get; }
        private EmailHtmlCreator HtmlCreator { get; set; }

        #region *** Read only properties ***
        private EmailSettings EmailSettings { get; }
        private AppDbContext DbContext { get; }
        private string DomainUrl { get; }
        #endregion

        /// <summary>
        ///     Class Constructor
        /// </summary>
        /// <param name="emailSettings">Email Settings Middle-ware which has the information about email server </param>
        /// <param name="httpContext">Current HttpContext</param>
        /// <param name="dbContext">Entity framework custom DbContext to interact with the database </param>
        internal oEmailService(
            EmailSettings emailSettings,
            HttpContext httpContext,
            AppDbContext dbContext)
        {
            /// Set the class attributes with the objects received from their 
            /// corresponding middle-ware
            EmailSettings = emailSettings;
            DomainUrl = "https://" + httpContext.Request.Host.Value;
            DbContext = dbContext;

            /// instantiate a new object of "EmailHtmlCreator" to be 
            /// available for the current Email service
            HtmlCreator = new EmailHtmlCreator();
            /// Add logo to the HtmlCreator in order to display it at the top of the email
            HtmlCreator.AddLogo(DomainUrl, "OSnack", DomainUrl + "/Images/Core/Logo.png");
        }

        /// <summary>
        ///     This method is used to email a token value to the user in order to rest their password
        /// </summary>
        /// <param name="user">User object</param>
        /// <param name="ExpiaryDate">The expiry DateTime of the token</param>
        /// <returns>bool: true (if email is send correctly) else false</returns>
        internal async Task<bool> PasswordResetAsync(oUser user, DateTime ExpiaryDate)
        {
            try
            {
                /// Create the URL for the user to go to in order to reset their password
                string PasswordResetUrl = await GetUrlWithToken(
                    user,
                    TokenType.ResetPassword,
                    ExpiaryDate).ConfigureAwait(false);

                /// The following methods must be called in order to create the email. 
                /// The order in which this methods are called will determine 
                /// the layout of the email from top to bottom.
                string htmlMessage = HtmlCreator
                    .HeaderText($"Hello {user.FirstName.FirstCap()} {user.Surname.FirstCap()} \n")
                    .BodyText("If you have requested to reset your password, " +
                        "please use the link below. Otherwise Ignore this email. \n")
                    .Button("Reset Password", PasswordResetUrl)
                    .BodyTextLight("The link will expire on " + ExpiaryDate)
                    .FooterFinal("", "oSnack.co.uk")
                    .GetFinalHtml();

                /// pass the information to be used to send the email.
                await SendEmailAsync(user.Email, "Password Reset", htmlMessage).ConfigureAwait(false);

                /// if all goes well then return true
                return true;
            }
            catch (Exception err)
            {
                /// if there are any exceptions, Log the exception error 
                /// on the database and return false to the caller
                await DbContext.AppLogs.AddAsync(new oAppLog
                {
                    Massage = err.Message,
                    JsonObject = JsonConvert.SerializeObject(err),
                    User = user
                });
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                return false;
            }
        }

        /// <summary>
        ///     This method is used to send token to the user after registration in order to
        ///     validate their email address.
        /// </summary>
        /// <param name="user">The user object</param>
        /// <param name="ExpiaryDate">The expiry date for token</param>
        /// <returns>bool: true (if email is send correctly) else false</returns>
        internal async Task<bool> EmailConfirmationAsync(oUser user, DateTime ExpiaryDate)
        {
            try
            {
                /// Create the URL for the user to go to in order to confirm email address
                var EmailConfirmUrl = await GetUrlWithToken(user, TokenType.ConfirmEmail, ExpiaryDate).ConfigureAwait(false);

                /// The following methods must be called in order to create the email. 
                /// The order in which this methods are called will determine 
                /// the layout of the email from top to bottom.
                var htmlMessage = HtmlCreator
                    .HeaderText(string.Format("Hello {0} {1}<br />"
                        , user.FirstName.FirstCap()
                        , user.Surname.FirstCap()))
                    .HeaderText("Welcome to oSnack.")
                    .BodyText("Please use the link below to confirm your email address. <br />")
                    .Button("Confirm Email", EmailConfirmUrl)
                    .FooterFinal("", "oSnack.co.uk")
                    .GetFinalHtml();

                /// pass the information to be used to send the email.
                await SendEmailAsync(user.Email, "Confirm Email", htmlMessage);

                /// if all goes well then return true
                return true;
            }
            catch (Exception err)
            {
                /// if there are any exceptions, Log the exception error 
                /// on the database and return false to the caller
                await DbContext.AppLogs.AddAsync(new oAppLog
                {
                    Massage = err.Message,
                    JsonObject = JsonConvert.SerializeObject(err),
                    User = user
                });
                await DbContext.SaveChangesAsync();
                return false;
            }
        }

        /// <summary>
        ///     This method is used to send emails by using the email settings passed to this class
        /// </summary>
        /// <param name="email">The Receiver Email</param>
        /// <param name="subject">Subject of the email</param>
        /// <param name="htmlMessage">the body of the email which can include HTML tags</param>
        /// <returns>void</returns>
        private async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            /// This method will use the "MimeKit" and "MailKit" libraries are used
            /// in order to send emails. Both libraries are Licensed under MIT
            /// MimeKit and MailKit are Copyright © 2013-2020 Jeffrey Stedfast
            /// http://www.mimekit.net/docs/html/License.htm

            /// Create a MineMessage object to setup an instance of email to be send
            MimeMessage message = new MimeMessage();

            /// Add the email settings for the sender of the email
            message.From.Add(new MailboxAddress(EmailSettings.SenderName, EmailSettings.Sender));

            /// Add the destination email to the message
            message.To.Add(new MailboxAddress(email));

            /// Add the subject of the email
            message.Subject = subject;

            /// Set the body of the email and type
            TextPart body = new TextPart("html")
            {
                Text = htmlMessage
            };

            /// Create a multi part email body in order to enable attachment 
            Multipart multiPartEmail = new Multipart("Mail");
            /// Add the body to the multi part email
            multiPartEmail.Add(body);

            /// if Email must have an attachment then add it to the multi part email
            if (Attachment != null)
            {
                /// Open a memory stream for 
                using (MemoryStream attSteam = new MemoryStream(Attachment))
                {
                    MimePart attachment = new MimePart("application", "PDF");
                    attachment.Content = new MimeContent(attSteam, ContentEncoding.Default);
                    attachment.ContentDisposition = new ContentDisposition(ContentDisposition.Attachment);
                    attachment.ContentTransferEncoding = ContentEncoding.Base64;
                    attachment.FileName = "Invoice";
                    multiPartEmail.Add(attachment);
                }
            }

            /// Set the message body to the value of multi part email
            message.Body = multiPartEmail;

            /// Create a disposable "SmtpClient" object in order to send the email
            using (SmtpClient client = new SmtpClient())
            {
                /// call back method that validates the server certificate for security purposes
                client.ServerCertificateValidationCallback = (sender, certificate, chain, errors) =>
                {
                    /// if there are no errors in the certificate then validate the check
                    if (errors == SslPolicyErrors.None)
                        return true;
                    /// else the certificate is either a self-signed or has errors
                    /// which both should be denied
                    return false;
                };

                /// Try connecting to the smtp server using SSL connection
                await client.ConnectAsync(
                    EmailSettings.MailServer,
                    EmailSettings.MailPort,
                    SecureSocketOptions.SslOnConnect).ConfigureAwait(false);

                /// Pass the authentication information to the connected server to perform outgoing email request
                await client.AuthenticateAsync(EmailSettings.Sender, EmailSettings.Password);

                /// use the smtp client to send the email
                await client.SendAsync(message);

                /// disconnect the smpt client connection
                await client.DisconnectAsync(true);
            }
        }

        /// <summary>
        ///     This method is used to generate a URL to verify the user's request such as
        ///     password reset and user's email validation.
        /// </summary>
        /// <param name="user">Register the token with a specific user</param>
        /// <param name="requestType">The type of the request </param>
        /// <param name="ExpiaryDate">The expiry of the token</param>
        /// <returns>The Generate URL</returns>
        private async Task<string> GetUrlWithToken(oUser user, TokenType requestType, DateTime ExpiaryDate)
        {
            /// First check if the user has a token for the requested token type
            IEnumerable<oToken> tokenValues = DbContext.Tokens
                .Where(vs => vs.User.Id == user.Id && vs.ValueType == requestType)
                .AsNoTracking()
                .AsEnumerable();

            /// If the user already has a token for the requested type
            /// then remove all of them
            if (tokenValues != null)
                DbContext.Tokens.RemoveRange(tokenValues);

            /// Create a new token
            var token = new oToken
            {
                User = user,
                ValueType = requestType,
                ExpiaryDateTime = ExpiaryDate,
                Value = Guid.NewGuid().ToString().Replace("-", "")
            };

            /// Add the new token the context
            await DbContext.AddAsync(token);
            /// Save the changes to the database
            await DbContext.SaveChangesAsync();

            /// return the requested URL 
            return string.Format(@"{0}/{1}/{2}", DomainUrl, requestType, token.Value);
        }

        Task IEmailService.SendEmailAsync(string email, string subject, string htmlMessage)
        {
            throw new NotImplementedException();
        }
    }
}
