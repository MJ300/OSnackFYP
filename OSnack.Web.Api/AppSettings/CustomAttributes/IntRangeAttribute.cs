using System.ComponentModel.DataAnnotations;
namespace Shared.Lib.CustomValidationAttributes
{
    /// <summary>
    /// Custom validation attribute to check the values are in between given range
    /// </summary>
    public class IntRangeAttribute : ValidationAttribute
    {
        public int MinValue { get; set; }
        public int MaxValue { get; set; }

      /// <summary>
      /// Int Range Check
      /// </summary>
      /// <param name="value"></param>
      /// <returns></returns>
        public override bool IsValid(object value)
        {

            if ((int)value >= MinValue && (int)value <= MaxValue)
                return true;
            ErrorMessage = $"Range Must be in [{MinValue} - {MaxValue}]";
            return false;
        }
    }
}
