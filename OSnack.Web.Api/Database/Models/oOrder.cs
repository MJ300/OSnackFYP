using OSnack.Web.Api.AppSettings.CustomTypes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    public class oOrder
    {
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required(ErrorMessage = "Status is required \n")]
        public OrderStatusType Status { get; set; }

        [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
        [Column(TypeName = "decimal(7,2)")]
        public decimal TotalPrice { get; set; }

        [Required(ErrorMessage = "Address is required \n")]
        public oAddress Address { get; set; }

        [Required(ErrorMessage = "Payment is required \n")]
        [ForeignKey("Id")]
        public oPayment Payment { get; set; }

        public oCoupon Coupon { get; set; }
        public ICollection<oOrderItem> OrderItems { get; set; }

    }
}
