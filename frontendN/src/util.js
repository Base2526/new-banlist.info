import _ from "lodash"

import i18n from './translations/i18n';

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
export const convertFileToBase64 = file =>
new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    console.log("convertFileToBase64 :", file)
    reader.onload = () => resolve({
        fileName:_.isEmpty(file.fileName) ? (_.isEmpty(file.title) ? file.name: "") : file.fileName,
        base64: reader.result,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
    });
    reader.onerror = reject;
});

export const convertDate = (date) =>{
    const monthNamesThai = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.", "ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
    const monthNameEnglish = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    if(i18n.language.toLowerCase() == 'th'){

        date = date.split(" ")
        let x = date[1];
        let vx = _.findIndex(monthNameEnglish, (month) => {
          return x.toLowerCase() == month.toLowerCase();
        });
      
        date[1] = monthNamesThai[vx];

        let year = ( parseInt(date[2]) + 543 ).toString();
        date[2] = year.substring(year.length-2, year.length);  

        return date.join(" ")
    }

    date = date.split(" ")
    let year = date[2].toString();
    date[2] = year.substring(year.length-2, year.length);  

    return date.join(" ");
}

export const numberCurrency = (number) =>{
    let THBBaht = new Intl.NumberFormat("th-TH", {
        minimumFractionDigits: 2
    });

    return THBBaht.format(number)
}

export const getCurrentLanguage = () => i18n.language || localStorage.getItem("i18n")

export const getHeaders = () =>{
    return  {
                "apollo-require-preflight": true,
                "Content-Type": "application/json",
                authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
            }
}