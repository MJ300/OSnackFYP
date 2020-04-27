using OSnack.Web.Api.AppSettings.CustomTypes;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace OSnack.Web.Api.Database.Models
{
    public class oToken
    {

        public int Id { get; set; }

        [Column(TypeName = "nvarchar(MAX)")]
        [Required(ErrorMessage = "Value is Required \n")]
        public string Value { get; set; } = Guid.NewGuid().ToString().Replace("-", "");

        [Required(ErrorMessage = "Token Type is Required \n")]
        public TokenType ValueType { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        [DataType(DataType.Date)]
        [Required(ErrorMessage = "Expiry Date is Required")]
        public DateTime ExpiaryDateTime { get; set; }

        public oUser User { get; set; }

        public string Email { get; set; }
    }
}
