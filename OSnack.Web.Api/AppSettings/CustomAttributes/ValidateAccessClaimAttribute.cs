using OSnack.Web.Api.AppSettings;
using System.ComponentModel.DataAnnotations;
namespace Shared.Lib.CustomValidationAttributes
{
    /// <summary>
    /// Custom validation attribute to check the Access claim property for Roles
    /// </summary>
    public class ValidateAccessClaim : ValidationAttribute
    {
        /// <summary>
        /// this method will be executed when the TryValidateModel(model instance) is called
        /// this method will check if the value of the property is a valid access claim value
        /// <bold>Returns True if valid else returns false</bold>
        /// </summary>
        /// <param name="value">The value object to be checked</param>
        public override bool IsValid(object value)
        {
            switch ((string)value)
            {
                case oAppConst.AccessClaims.Admin:
                case oAppConst.AccessClaims.Manager:
                case oAppConst.AccessClaims.Staff:
                case oAppConst.AccessClaims.Customer:
                    return true;
            }
            ErrorMessage = "Invalid Access Claim Level";
            return false;
        }
    }
}
