using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    public class oStorage
    {
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        [Required(ErrorMessage = "* Required")]
        public string Name { get; set; }

        [JsonIgnore]
        [ForeignKey("StorageId"), Column(Order = 1)]
        public ICollection<oStorageItem> StorageItems { get; set; }
    }
}
