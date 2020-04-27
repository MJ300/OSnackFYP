namespace OSnack.Web.Api.AppSettings.CustomTypes
{
    public enum CouponType
    {
        FreeDelivery = 1,
        DiscountPrice = 2,
        PercentageOfTotal = 3
    }

    public enum TokenType
    {
        ResetPassword = 1,
        ConfirmEmail = 2,
        Subscription = 3
    }

    public enum OrderStatusType
    {
        Placed = 1,
        Hold = 2,
        Confirmed = 3,
        Delivered = 4,
        Canceled = 5
    }

    public enum ProductUnitType
    {
        Kg = 1,
        Grams = 2,
        PerItem = 3
    }


}
