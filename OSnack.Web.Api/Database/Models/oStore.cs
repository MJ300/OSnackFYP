using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    [Table("Stores")]
    public class oStore
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        [Required(ErrorMessage = "Name Is Required")]
        public string Name { get; set; }

        public bool Status { get; set; } = false;

        [JsonIgnore]
        [InverseProperty("Store")]
        public ICollection<oStoreProduct> StoreProducts { get; set; }
    }
}
