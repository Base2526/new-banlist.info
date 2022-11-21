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
    const monthNamesThai = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน", "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤษจิกายน","ธันวาคม"];
    const monthNameEnglish = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if(i18n.language.toLowerCase() == 'th'){

        date = date.split(" ")
        let x = date[0];
        let vx = _.findIndex(monthNameEnglish, (month) => {
          return x.toLowerCase() == month.toLowerCase();
        });
      
        date[0] = monthNamesThai[vx];
        date[2] = parseInt(date[2]) + 543;  
      
        return date.join(" ")
    }

    return date;
}