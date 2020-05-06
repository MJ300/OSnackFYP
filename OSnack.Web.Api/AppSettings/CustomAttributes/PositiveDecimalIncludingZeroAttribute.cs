using System.ComponentModel.DataAnnotations;
namespace OSnack.Web.Api.AppSettings.CustomAttributes
{
    /// <summary>
    /// Custom validation attribute to check the validity if price that cannot be negative number
    /// </summary>
    internal class PositiveDecimalIncludingZeroAttribute : ValidationAttribute
    {
        /// <summary>
        /// this method will be executed when the TryValidateModel(model instance) is called
        /// <bold>Returns True if valid else returns false</bold>
        /// </summary>
        /// <param name="value">The value object to be checked</param>
        public override bool IsValid(object value)
        {
            try
            {
                /// if the value is not null and if the object correctly converted to a decimal
                if (value != null)
                {
                    /// then check if the converted value is more than or equal to 0
                    /// then return true
                    if ((decimal)value >= 0) return true;
                }
            }
            catch { }
            /// else display below error massage and return false
            ErrorMessage = "Invalid Price";
            return false;
        }
    }
}