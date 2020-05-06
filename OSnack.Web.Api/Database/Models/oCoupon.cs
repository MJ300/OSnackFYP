using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using OSnack.Web.Api.AppSettings.CustomTypes;
namespace OSnack.Web.Api.Database.Models
{
    [Table("Coupons")]
    public class oCoupon
    {
        [Key]
        [StringLength(25, ErrorMessage = "Must be less than 25 Characters \n")]
        [Required(ErrorMessage = "Coupon Code Required \n")]
        public string Code { get; set; }

        [Required(ErrorMessage = "Coupon Type is Required \n")]
        public CouponType Type { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        [DataType(DataType.Date)]
        [Required(ErrorMessage = "Expiry Date is Required \n")]
        public DateTime ExpiryDate { get; set; }

        [JsonIgnore]
        public ICollection<oOrder> Orders { get; set; }
    }
}
