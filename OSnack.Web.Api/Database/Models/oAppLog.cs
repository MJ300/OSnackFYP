using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace OSnack.Web.Api.Database.Models
{
    [Table("AppLogs")]
    public class oAppLog
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        [DataType(DataType.Date)]
        public DateTime TimeStamp { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "nvarchar(256)")]
        [Required(ErrorMessage = "Log Type Is Required. \n")]
        public string Massage { get; set; }

        [Column(TypeName = "nvarchar(MAX)")]
        public string JsonObject { get; set; }

        [ForeignKey("UserId")]
        public oUser User { get; set; }
    }
}
