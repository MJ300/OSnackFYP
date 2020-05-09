using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace OSnack.Web.Api.AppSettings
{
    /// <summary>
    /// Web API Only constant Functions
    /// </summary>
    public static class oAppFunc
    {

        /// <summary>
        /// this method is used to generate random password with the parameters given
        /// </summary>
        /// <param name="length"></param>
        /// <param name="capLetters">Must contain at least one. It is also used as default if all conditions fails</param>
        /// <param name="lowerLetters">Must contain at least one. It is also used as default if all conditions fails</param>
        /// <param name="digits">optional 0-9</param>
        /// <param name="symbols">optional "!@#$%^&*()_-+=[{]};:<>|./?"</param>
        /// <returns></returns>
        public static string passwordGenerator(
            int length = 4,
            int capLetters = 1,
            int lowerLetters = 1,
            int digits = 1,
            int symbols = 1)
        {
            const string cap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string low = "abcdefghijklmnopqrstuvwxyz";
            const string dig = "0123456789";
            const string sym = "!@#$%^&*()_-+=[{]};:<>|./?";
            string all = cap + low + dig + sym;

            string password = "";

            int capLetterCount = capLetters;
            int lowerLettersCount = lowerLetters;
            int digitsCount = digits;
            int symbolsCount = symbols;

            Random rn = new Random();
            char getRandomChar() => all[rn.Next(all.Length)];
            StringComparison SC = StringComparison.InvariantCulture;

            bool firstCheck(char newChar)
            {
                if (capLetterCount > 0 && cap.Contains(newChar, SC))
                {
                    capLetterCount--;
                    password += newChar;
                    return true;
                }
                if (lowerLettersCount > 0 && low.Contains(newChar, SC))
                {
                    lowerLettersCount--;
                    password += newChar;
                    return true;
                }
                if (digitsCount > 0 && dig.Contains(newChar, SC))
                {
                    digitsCount--;
                    password += newChar;
                    return true;
                }
                if (symbolsCount > 0 && sym.Contains(newChar, SC))
                {
                    symbolsCount--;
                    password += newChar;
                    return true;
                }
                return false;
            }
            for (int i = 0; i < length; i++)
            {
                char selectedChar = getRandomChar();


                if (firstCheck(selectedChar)) continue;
                else
                {
                    if (capLetterCount > 0 || lowerLetters > 0 || digitsCount > 0 || symbolsCount > 0)
                    {
                        bool trigger = true;
                        while (trigger)
                        {
                            char newChar = getRandomChar();
                            if (firstCheck(newChar)) trigger = false;
                        }
                        continue;
                    }
                }

                if (cap.Contains(selectedChar, SC) || low.Contains(selectedChar, SC))
                {
                    password += selectedChar;
                    continue;
                }
                if (dig.Contains(selectedChar, SC) && digits == 0)
                {
                    bool trigger = true;
                    while (trigger)
                    {
                        char newChar = getRandomChar();
                        if (!dig.Contains(newChar, SC))
                        {
                            password += newChar;
                            trigger = false;
                        }
                    }
                    continue;
                }
                if (sym.Contains(selectedChar, SC) && symbols == 0)
                {
                    bool trigger = true;
                    while (trigger)
                    {
                        char newChar = getRandomChar();
                        if (!sym.Contains(newChar, SC))
                        {
                            password += newChar;
                            trigger = false;
                        }
                    }
                    continue;
                }

                if (rn.Next(0, 1) == 0)
                {
                    password += cap[rn.Next(cap.Length)];
                }
                else
                {
                    password += low[rn.Next(low.Length)];
                }
            }

            return password;
        }

        public static void DeleteImage(string path, string webRootPath) =>
            File.Delete(string.Format(@"{0}\{1}", webRootPath, path));

        public static string SaveImageToWWWRoot(string fileName, string webRootPath, string imgBase64, string folderName)
        {
            byte[] imgBytes = Convert.FromBase64String(imgBase64.Split("base64,")[1]);

            var SelectedFolder = Path.Combine(webRootPath, string.Format(folderName));
            var path = string.Format(@"{0}\{1}-{2}.png", SelectedFolder, fileName, new Random().Next(0, 100));

            if (!Directory.Exists(SelectedFolder))
                Directory.CreateDirectory(SelectedFolder);

            using (var fs = new FileStream(string.Format(path), FileMode.Create))
            {
                fs.Write(imgBytes);
            }

            return path.Split(@"wwwroot\")[1];
        }

        /// <summary>
        /// This method is used to extract the errors form model state
        /// </summary>
        /// <param name="ModelState">The instance of model state which contains the errors</param>
        /// <param name="errorList">the reference of error list to add the errors to </param>
        public static void ExtractErrors(ModelStateDictionary ModelState, ref List<oError> errorList)
        {
            int count = 0;
            // Loop through the Model state values
            foreach (var prop in ModelState.Values)
            {
                /// add each error in the model state to the error list
                Error(ref errorList,
                      prop.Errors.FirstOrDefault().ErrorMessage,
                      ModelState.Keys.ToArray()[count]);
                count++;
            }
        }

        /// <summary>
        /// Used to create a anonymous type and adding it to the referenced error list
        /// </summary>
        /// <param name="Key">Id of the error</param>
        /// <param name="Message">The error message</param>
        /// <param name="errors">Reference of the error list used to add the error</param>
        public static void Error(ref List<oError> errors, string value, string key = "")
        {
            if (string.IsNullOrWhiteSpace(key))
                key = new Random().Next(1, 20).ToString();
            errors.Add(new oError(key, value));
        }
        public class oError
        {
            /// <summary>
            /// Method to create an error object to be send to client side
            /// </summary>
            /// <summary>
            /// Constructor to create a new instance of error object
            /// </summary>
            /// <param name="key">The key value of the error (ID)</param>
            /// <param name="value">"The Value of the error (Message)"</param>
            public oError(string key, string value)
            {
                Key = key;
                Value = value;
            }
            /// <summary>
            /// Error Key (ID)
            /// </summary>
            public string Key { get; set; } = "0";
            /// <summary>
            /// Error Value (Message)
            /// </summary>
            public string Value { get; set; }
        }
    }
}
