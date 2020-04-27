using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    public class oRole
    {
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        [Required(ErrorMessage = "Role Name is Required \n")]
        public string Name { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        [Required(ErrorMessage = "Access Claim is Required \n")]
        public string AccessClaim { get; set; }
    }
}
