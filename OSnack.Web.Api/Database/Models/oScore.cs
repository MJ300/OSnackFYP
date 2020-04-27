using Shared.Lib.CustomValidationAttributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    public class oScore
    {
        public int OrderItemId { get; set; }

        [IntRange(ErrorMessage = "", MinValue = 0, MaxValue = 5)]
        public int Rate { get; set; } = 5;

        [NotMapped]
        public int UserId { get; set; }
    }
}
