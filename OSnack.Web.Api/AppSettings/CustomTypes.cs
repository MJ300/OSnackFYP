namespace OSnack.Web.Api.AppSettings.CustomTypes
{
    public enum CouponType
    {
        FreeDelivery = 0,
        DiscountPrice = 1,
        PercentageOfTotal = 2
    }

    public enum TokenType
    {
        ResetPassword = 0,
        ConfirmEmail = 1,
        Subscription = 2
    }

    public enum OrderStatusType
    {
        Placed = 0,
        Hold = 1,
        Confirmed = 2,
        Delivered = 3,
        Canceled = 4
    }

    public enum ProductUnitType
    {
        Kg = 0,
        Grams = 1,
        PerItem = 2
    }

    public enum SortByType
    {
        product = 0,
        category = 1,
        price = 2,
        unit = 3,
        unitQuantity = 4,
        status = 5,
    }
}
