



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
}

//#endregion
