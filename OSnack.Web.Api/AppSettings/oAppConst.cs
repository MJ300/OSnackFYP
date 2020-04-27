namespace OSnack.Web.Api.AppSettings
{
    /// <summary>
    /// Web API Only constant variable
    /// </summary>
    internal class oAppConst
    {
        /// <summary>
        /// Get all records from search API
        /// </summary>
        public const string GetAllRecords = "***GET-ALL***";

        /// <summary>
        /// Three Levels of access within the system.<br /> 
        /// * Admin<br/>
        /// * Manager<br/> 
        /// * Staff<br/> 
        /// * Customer  
        /// </summary>
        public struct AccessClaims
        {
            public const string Type = "Role";
            public const string Admin = "Admin";
            public const string Manager = "Manager";
            public const string Staff = "Staff";
            public const string Customer = "Customer";
            public static readonly string[] All =
            { Type, Admin, Manager, Staff, Customer  };
        }

        /// <summary>
        /// Three Levels of access policies within the system.<br /> 
        /// </summary>
        public struct AccessPolicies
        {
            /// <summary>
            /// * Level One includes Admin
            /// </summary>
            public const string LevelOne = "LevelOne";
            /// <summary>
            /// * Level Two includes Admin and Manager
            /// </summary>
            public const string LevelTwo = "LevelTwo";
            /// <summary>
            /// * Level Three includes Admin, Manager and staff
            /// </summary>
            public const string LevelThree = "LevelThree";
            /// <summary>
            /// * Level Four includes Admin, Manager , staff and customer
            /// </summary>
            public const string LevelFour = "LevelFour";
        }

        public struct CommonErrors
        {
            /// <summary>
            /// * Level One includes Admin
            /// </summary>
            public const string ServerError = "Server Error. Please Contact Administrator.";

        }
    }
}
