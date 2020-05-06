using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    [Table("Comments")]
    public class oComment
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        [Required(ErrorMessage = "* Required")]
        public string Description { get; set; }

        [ForeignKey("OrderItemId")]
        public oOrderItem OrderItem { get; set; }
    }
}
