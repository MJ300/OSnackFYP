using System;
using System.ComponentModel.DataAnnotations;

namespace OSnack.Web.Api.Database.Models
{
    public class oPayment
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Provider is required \n")]
        public string PaymentProvider { get; set; }

        [Required(ErrorMessage = "Reference is required \n")]
        public string Reference { get; set; }

        [Required(ErrorMessage = "Date is required \n")]
        public DateTime DateTime { get; set; }

        [Required(ErrorMessage = "Order is required \n")]
        public oOrder Order { get; set; }
    }
}
