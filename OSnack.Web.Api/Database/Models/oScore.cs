using Shared.Lib.CustomValidationAttributes;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    [Table("Score")]
    public class oScore
    {
        [Key]
        [Column(Order = 0)]
        public int OrderItemId { get; set; }

        [IntRange(ErrorMessage = "", MinValue = 0, MaxValue = 5)]
        public int Rate { get; set; } = 5;

        [NotMapped]
        public int UserId { get; set; }
    }
}
