using Newtonsoft.Json;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace OSnack.Web.Api.AppSettings.CustomExtentions
{
    public static class StringExtention
    {
        /// <summary>
        /// Capitalize the first letter of the string
        /// </summary>
        /// <param name="input">input value</param>
        public static string FirstCap(this String input)
        {
            /// if the input is Not null or empty. capitalize the first letter of the string
            /// and return the value
            if (!string.IsNullOrEmpty(input))
                return input.First().ToString().ToUpper() + input.Substring(1);

            /// else just return the value
            return input;
        }

        /// <summary>
        /// Used for decrypting an encrypted string value which used 
        /// the Encrypt method of StringExtention class for encryption 
        /// </summary>
        /// <param name="input">The string value to be encrypted</param>
        /// <returns>encrypted value</returns>
        /// <exception cref="ArgumentException">input cannot be encrypted</exception>
        public static string Encrypt(this String input)
        {
            try
            {
                /// salt
                byte[] aditionalEntropy = { 42, 50, 78, 46, 30 };
                /// encode input string to byte array
                byte[] inputeByteArr = Encoding.Unicode.GetBytes(input);
                /// use the Protect method from ProtectedData class (System.Security.Cryptography) to encrypt the string
                byte[] encyptedData = ProtectedData.Protect(inputeByteArr, aditionalEntropy, DataProtectionScope.CurrentUser);
                /// convert the encrypted byte array to json string and return that value
                return JsonConvert.SerializeObject(encyptedData);
            }
            catch (Exception)
            {
                /// catch the exception and throw argumentException
                throw new ArgumentException();
            }
        }

        /// <summary>
        /// Used for decrypting an encrypted string value which used 
        /// the Encrypt method of StringExtention class for encryption 
        /// </summary>
        /// <param name="encryptedValue">The encrypted value</param>
        /// <returns>decrypted value</returns>
        /// <exception cref="ArgumentException">Invalid encrypted value</exception>
        public static string Decrypt(this String encryptedValue)
        {
            try
            {
                /// Add the salt value used to encrypt the data
                byte[] aditionalEntropy = { 42, 50, 78, 46, 30 };
                /// convert the encrypted data from json string to byte array
                byte[] jsonToByte = JsonConvert.DeserializeObject<byte[]>(encryptedValue);
                /// use the Unprotect method from ProtectedData class (System.Security.Cryptography) to decrypt the string
                byte[] decyptedData = ProtectedData.Unprotect(jsonToByte, aditionalEntropy, DataProtectionScope.CurrentUser);

                /// decode from byte array to string
                return Encoding.Unicode.GetString(decyptedData);
            }
            catch (Exception)
            {
                /// catch the exception and throw argumentException
                throw new ArgumentException();
            }
        }
    }
}
