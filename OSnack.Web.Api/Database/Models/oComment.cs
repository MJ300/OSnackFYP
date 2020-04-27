using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    public class oComment
    {
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        [Required(ErrorMessage = "* Required")]
        public string Description { get; set; }

        public oOrderItem OrderItem { get; set; }
    }
}
