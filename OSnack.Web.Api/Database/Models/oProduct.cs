using Newtonsoft.Json;
using OSnack.Web.Api.AppSettings.CustomTypes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    [Table("Products")]
    public class oProduct
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        [Required(ErrorMessage = "Name is Required \n")]
        [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
        public string Name { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
        public string Description { get; set; } = "";

        [Required(ErrorMessage = "Image is Required \n")]
        public string ImagePath { get; set; }

        [Column(TypeName = "decimal(7,2)")]
        [Required(ErrorMessage = "Price is Required \n")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Unit Quantity is Required \n")]
        public int UnitQuantity { get; set; }


        [Required(ErrorMessage = "Unit Type is Required \n")]
        public ProductUnitType Unit { get; set; }

        [Required(ErrorMessage = "Category is Required \n")]
        [ForeignKey("CategoryId")]
        public oCategory Category { get; set; }

        [InverseProperty("Product")]
        public ICollection<oStoreProduct> StoreProducts { get; set; }

        [NotMapped]
        public int AverageRate { get; set; }

        [NotMapped]
        public List<oComment> Comments { get; set; } = new List<oComment>();
        [NotMapped]
        [Required(ErrorMessage = "Image is Required \n")]
        public string ImageBase64 { get; set; }
    }
}