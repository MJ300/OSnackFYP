using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    public class oStoreProduct
    {
        [Key, Column(Order = 0)]
        public int StoreId { get; set; }

        [Key, Column(Order = 1)]
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public oProduct Product { get; set; } = new oProduct();

        [ForeignKey("StoreId")]
        public oStore Store { get; set; } = new oStore();

        public int Quantity { get; set; } = 0;

        public bool Status { get; set; } = false;
    }
}