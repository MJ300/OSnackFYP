using OSnack.Web.Api.AppSettings.CustomTypes;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace OSnack.Web.Api.Database.Models
{
    public class oNewsletterSubscription
    {
        public oNewsletterSubscription() { }
        public oNewsletterSubscription(oUser user, string email)
        {
            if (user != null)
                DisplayName = $"{user.FirstName} {user.Surname}";
            Email = user.Email;
        }

        public void SetToken() => Token = new oToken
        {
            ExpiaryDateTime = DateTime.UtcNow.AddYears(500),
            Email = Email,
            ValueType = TokenType.Subscription,
        };

        [Key]
        [DataType(DataType.EmailAddress, ErrorMessage = "Invalid Email \n")]
        [Required(ErrorMessage = "Email is Required \n")]
        [RegularExpression(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
            ErrorMessage = "Invalid Email \n")]
        public string Email { get; set; }

        public string DisplayName { get; set; }

        [JsonIgnore]
        public oToken Token { get; set; }

    }
}
