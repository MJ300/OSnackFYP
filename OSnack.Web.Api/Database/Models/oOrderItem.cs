using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    public class oOrderItem
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Quantity is Required")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Order is Required")]
        public oOrder Order { get; set; }

        [Required(ErrorMessage = "Product is Required")]
        public oProduct Product { get; set; }

        public ICollection<oComment> Comments { get; set; }

        [ForeignKey("OrderItemId"), Column(Order = 0)]
        public ICollection<oScore> Scores { get; set; }
    }
}