import CryptoJS from "crypto-js";


export function _encrypt(args){   
    const cipherText = CryptoJS.AES.encrypt(JSON.stringify(args), key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    console.log(cipherText);

    return cipherText.toString();
}

export function _decrypt(cipherText){
    // console.log(JSON.stringify(cipherText));
    const bytes = CryptoJS.AES.decrypt(cipherText.toString(), key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    const plainText = bytes.toString(CryptoJS.enc.Utf8)
    console.log(cipherText.toString());
    console.log(plainText.toString());
    return plainText.toString();
}

const opts = {
    precision: 0,
    separator: '.',
    delimiter: ',',
    unit: '₦',
    //unit: opts.unit && (opts.unit.replace(/[\s]/g,'') + " ") || "",
    suffixUnit: '',
    zeroCents: false,
    moneyPrecision: 0
};

export function amountFormatter(amount){
    if (!amount) return '';

    const number = amount.toString().replace(/[\D]/g, '');
    const clearDelimiter = new RegExp(`^(0|\\${opts.delimiter})`);
    const clearSeparator = new RegExp(`(\\${opts.separator})$`);
    let money = number.substr(0, number.length - opts.moneyPrecision);
    let masked = money.substr(0, money.length % 3);
    const cents = new Array(opts.precision + 1).join('0');

    money = money.substr(money.length % 3, money.length);
    for (let i = 0, len = money.length; i < len; i++) {
        if (i % 3 === 0) {
            masked += opts.delimiter;
        }
        masked += money[i];
    }
    masked = masked.replace(clearDelimiter, '');
    masked = masked.length ? masked : '0';

    const unitToApply = opts.unit[opts.unit.length - 1] === ' ' ?
        opts.unit.substring(0, opts.unit.length - 1)
        :
        opts.unit;
    const output = unitToApply + masked + opts.separator + cents + opts.suffixUnit;
    return output.replace(clearSeparator, '');
};