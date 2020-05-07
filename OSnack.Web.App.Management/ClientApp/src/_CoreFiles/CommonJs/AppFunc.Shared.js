import { API_URL, MANAGEMENT_URL } from "./AppConst.Shared";

//#region *** 'Cookie Management' ***
export const getCookieValue = (name) => {
   var cookies = document.cookie;
   try {
      var FirstSplit = cookies.split(';');
      var cookieValue = '';
      for (var i = 0; i < FirstSplit.length; i++) {
         if (~FirstSplit[i].indexOf(name + '=')) {
            cookieValue = FirstSplit[i].replace(name + '=', '');
         }
      }
      return cookieValue.replace(' ', '');
   } catch (err) {
      return '';
   }
};
//#endregion

export class apiCaller {
   static async get(apiUrl) {
      return fetch(`${API_URL}${apiUrl}`, {
         method: "GET",
         Accept: 'application/json',
         'content-type': 'application/json',
      }).catch(err => console.log(err));
   }
   static async post(apiUrl, bodyObject = "") {
      return fetch(`${API_URL}${apiUrl}`, {
         method: "POST",
         headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
            'X-AntiForgery-TOKEN': getCookieValue("AntiForgery-TOKEN"),
         },
         body: JSON.stringify(bodyObject),
      }).catch(err => console.log(err));
   }
   static async put(apiUrl, bodyObject = "") {
      return fetch(`${API_URL}${apiUrl}`, {
         method: "PUT",
         headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
            'X-AntiForgery-TOKEN': getCookieValue("AntiForgery-TOKEN"),
         },
         body: JSON.stringify(bodyObject),
      }).catch(err => console.log(err));
   }
   static async delete(apiUrl, bodyObject = "") {
      return fetch(`${API_URL}${apiUrl}`, {
         method: "DELETE",
         headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
            'X-AntiForgery-TOKEN': getCookieValue("AntiForgery-TOKEN"),
         },
         body: JSON.stringify(bodyObject),
      }).catch(err => console.log(err));
   }
}

export const getBase64fromUrlImage = url =>
   new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = url;
      image.onload = () => {
         let canvas = document.createElement('canvas');
         canvas.width = image.width;
         canvas.height = image.height;
         let ctx = canvas.getContext("2d");
         ctx.drawImage(image, 0, 0);
         var imgBase64 = canvas.toDataURL();
         resolve(imgBase64);
      };
      image.onerror = error => reject(error);
   });

///// Code used from https://www.isummation.com/blog/convert-arraybuffer-to-base64-string-and-vice-versa/
//export const ArrayBufferToBase64 = (buffer) => {
//   var binary = '';
//   var bytes = new Uint8Array(buffer);
//   var len = bytes.byteLength;
//   for (var i = 0; i < len; i++) {
//      binary += String.fromCharCode(bytes[i]);
//   }
//   return window.btoa(binary);
//};

//export const Base64ToArrayBuffer = (base64) => {
//   console.log(base64);
//   var binary_string = window.atob(base64);
//   var len = binary_string.length;
//   var bytes = new Uint8Array(len);
//   for (var i = 0; i < len; i++) {
//      bytes[i] = binary_string.charCodeAt(i);
//   }
//   console.log(bytes.buffer);
//   return bytes.buffer;
//};

//export const StringBase64ToBlob = (base64) => {
//   var byteCharacters = window.atob(base64);
//   const byteNumbers = new Array(byteCharacters.length);
//   for (let i = 0; i < byteCharacters.length; i++) {
//      byteNumbers[i] = byteCharacters.charCodeAt(i);
//   }
//   const byteArray = new Uint8Array(byteNumbers);
//   return new Blob([byteArray]);
//};