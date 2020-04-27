using Newtonsoft.Json;
using OSnack.Web.Api.AppSettings.CustomTypes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    public class oProduct
    {
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

        public bool Active { get; set; } = false;

        [Column(TypeName = "decimal(7,2)")]
        [Required(ErrorMessage = "Price is Required \n")]
        public decimal Price { get; set; }

        public int UnitQuantity { get; set; }


        [Required(ErrorMessage = "Unit Type is Required \n")]
        public ProductUnitType Unit { get; set; }

        [Required(ErrorMessage = "Category is Required \n")]
        public oCategory Category { get; set; }

        //[JsonIgnore]
        //public ICollection<oOrderItem> OrderItems { get; set; }

        [ForeignKey("ProductId"), Column(Order = 1)]
        public ICollection<oStorageItem> StorageItems { get; set; }

        [NotMapped]
        public int AverageRate { get; set; }

        [NotMapped]
        public List<oComment> Comments { get; set; } = new List<oComment>();
    }
}