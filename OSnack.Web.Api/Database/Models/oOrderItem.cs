using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    [Table("OrderItems")]
    public class oOrderItem
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("ProductId")]
        [Column(Order = 1)]
        public int ProductId { get; set; }
        [ForeignKey("StoreId")]
        [Column(Order = 0)]
        public int StoreId { get; set; }

        [Required(ErrorMessage = "Quantity is Required")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Order is Required")]
        [ForeignKey("OrderId")]
        public oOrder Order { get; set; }

        [Required(ErrorMessage = "Product is Required")]
        public oStoreProduct StoreProduct { get; set; }


        [InverseProperty("OrderItem")]
        public ICollection<oComment> Comments { get; set; }

        [ForeignKey("OrderItemId"), Column(Order = 0)]
        public ICollection<oScore> Scores { get; set; }
    }
}