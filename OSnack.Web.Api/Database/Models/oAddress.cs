using Newtonsoft.Json;
using OSnack.Web.Api.Controllers;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    [Table("Addresses")]
    public class oAddress
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        [Required(ErrorMessage = "Name is Required \n")]
        [StringLength(256, ErrorMessage = "Must be less than 257 Characters \n")]
        public string Name { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        [Required(ErrorMessage = "First Line is Required \n")]
        [StringLength(500, ErrorMessage = "Must be less than 500 Characters \n")]
        public string FirstLine { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        [StringLength(500, ErrorMessage = "Must be less than 500 Characters \n")]
        public string SecondLine { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        [Required(ErrorMessage = "City is Required \n")]
        [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
        public string City { get; set; }

        [Column(TypeName = "nvarchar(8)")]
        [Required(ErrorMessage = "Postcode is Required \n")]
        [StringLength(8, ErrorMessage = "Must be less than 8 Characters \n")]
        public string Postcode { get; set; }

        [Required(ErrorMessage = "User is Required \n")]
        [JsonIgnore]
        public oUser User { get; set; }

        [InverseProperty("Address")]
        public ICollection<oOrder> Orders { get; set; }

        [NotMapped]
        public int UserId { get; set; }
    }
}
