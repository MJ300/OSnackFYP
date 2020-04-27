using OSnack.Web.Api.AppSettings.CustomAttributes;
using OSnack.Web.Api.AppSettings.CustomTypes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    public class oCategory
    {
        public int Id { get; set; }


        private string _Name;
        [Column(TypeName = "nvarchar(256)")]
        [Required(ErrorMessage = "Name is Required \n")]
        [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
        public string Name { get { return _Name; } set { _Name = value.Trim(); } }


        [Column(TypeName = "decimal(7,2)")]
        [Required(ErrorMessage = "Default Price is Required \n")]
        [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
        [PositiveDecimalIncludingZero(ErrorMessage = "Invalid Currency \n")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Unit Type is Required \n")]
        public ProductUnitType Unit { get; set; }

        [Display(Name = "Display Image")]
        [Required(ErrorMessage = "Image is Required \n")]
        public string ImagePath { get; set; }

        public bool Active { get; set; } = false;

        public ICollection<oProduct> Products { get; set; }

        [NotMapped]
        public string ByteString { get; set; }
    }
}