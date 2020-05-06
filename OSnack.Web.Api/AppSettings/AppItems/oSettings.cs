using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using OSnack.Web.Api.AppSettings.EmailServices;
using System;

namespace OSnack.Web.Api.AppSettings.AppModels
{
    /// <summary>
    /// class used to have the app setting information in memory
    /// </summary>
    public class oSettings
    {
        /// <summary>
        /// API base URL
        /// </summary>
        //[JsonProperty(PropertyName = "api_base_url")]
        //public string API_BASE_URL { get; private set; }

        /// <summary>
        /// Value determining whether SSL should be check 
        /// when calling the API endpoint
        /// </summary>
        [JsonProperty(PropertyName = "SSL_check")]
        internal bool SSL_Check { get; private set; }

        /// <summary>
        /// The array of allowed CORs (Cross-Origin Request) URL
        /// which are allowed to connect to the web API
        /// </summary>
        [JsonProperty(PropertyName = "Allowed_CORS")]
        internal string[] Allowed_CORS { get; private set; }


        [JsonProperty(PropertyName = "EmailSettings")]
        internal EmailSettings EmailSettings { get; set; }

        /// <summary>
        /// The array of allowed CORs (Cross-Origin Request) URL
        /// which are allowed to connect to the web API
        /// </summary>
        [JsonProperty(PropertyName = "DbConnectionStrings")]
        private string[] _DbConnectionStrings { get; set; }

        internal string DbConnectionString()
        {
            bool checkConnection(string connectionString)
            {
                try
                {
                    using (var con = new SqlConnection(connectionString))
                    {
                        con.Open();
                    }
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }

            string SelectedConnection = "";
            foreach (string connection in _DbConnectionStrings)
            {
                if (checkConnection(connection))
                {
                    SelectedConnection = connection;
                    break;
                }
            }
            return SelectedConnection;
        }


    }
}
