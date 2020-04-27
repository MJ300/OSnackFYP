using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace OSnack.Web.Api.Database.Models
{
    public class oAppLog
    {
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        [DataType(DataType.Date)]
        public DateTime TimeStamp { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "nvarchar(256)")]
        [Required(ErrorMessage = "Log Type Is Required. \n")]
        public string Massage { get; set; }

        [Column(TypeName = "nvarchar(MAX)")]
        public string JsonObject { get; set; }

        public oUser User { get; set; }
    }
}
