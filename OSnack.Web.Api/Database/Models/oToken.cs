using OSnack.Web.Api.AppSettings.CustomTypes;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace OSnack.Web.Api.Database.Models
{
    [Table("Tokens")]
    public class oToken
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(MAX)")]
        [Required(ErrorMessage = "Value is Required \n")]
        public string Value { get; set; }

        [Required(ErrorMessage = "Token Type is Required \n")]
        public TokenType ValueType { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        [DataType(DataType.Date)]
        [Required(ErrorMessage = "Expiry Date is Required")]
        public DateTime ExpiaryDateTime { get; set; }

        [ForeignKey("UserId")]
        public oUser User { get; set; }

        [ForeignKey("Email")]
        public string Email { get; set; }

        /// <summary>
        /// Returns a random token in "X-0-00-000"
        /// </summary>
        public string GetToken()
        {
            string prefix = "X";
            switch (ValueType)
            {
                case TokenType.ConfirmEmail:
                    prefix = "CM";
                    break;
                case TokenType.ResetPassword:
                    prefix = "RP";
                    break;
                case TokenType.Subscription:
                    prefix = "S";
                    break;
                default:
                    prefix = "DX";
                    break;
            }

            Random rn = new Random();
            return $"{prefix}-{rn.Next(100, 999)}-{rn.Next(100, 999)}-{rn.Next(100, 999)}";
        }
    }
}
