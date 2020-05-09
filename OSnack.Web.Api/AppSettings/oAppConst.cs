using Newtonsoft.Json;
using OSnack.Web.Api.AppSettings.AppModels;
using System;
using System.IO;
using System.Reflection;

namespace OSnack.Web.Api.AppSettings
{
    /// <summary>
    /// Web API Only constant variable
    /// </summary>
    internal static class oAppConst
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


        /// <summary>
        /// Get the information from the appSettings json file
        /// </summary>
        public static oSettings AppSettings
        {
            get
            {
                /// Get the directory of the app settings.json file
                var jsonFilePath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + @"\AppSettings\AppItems\oSettings.json";
                /// If above file does not exists check the android path.
                if (!File.Exists(jsonFilePath))
                    jsonFilePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"AppSettings\AppItems\oSettings.json");
                /// Read the json file from that directory
                /// de-serialise the json string into an object of AppSettings and return it
                return JsonConvert.DeserializeObject<oSettings>(File.ReadAllText(jsonFilePath));
            }
        }
    }
}
