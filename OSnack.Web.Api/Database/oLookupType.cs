using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OSnack.Web.Api.Models
{
    public class oLookupType
    {
        public int LookupTypeID { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        [Display(Name = "Name")]
        [Required(ErrorMessage = "* Required")]
        [StringLength(256, ErrorMessage = "Must be less than 256 Characters")]
        public string LookupTypeName { get; set; }
    }
}
