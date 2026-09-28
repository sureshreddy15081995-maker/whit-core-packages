// @common/utils/src/encryptDecrypt.ts
export function xorEncryptDecrypt(input, key = 'igaming_secure_key') {
    let output = '';
    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        output += String.fromCharCode(charCode);
    }
    return output;
}
export function obfuscate(text, key = 'igaming_secure_key') {
    try {
        const encrypted = xorEncryptDecrypt(text, key);
        return btoa(unescape(encodeURIComponent(encrypted)));
    }
    catch (e) {
        return '';
    }
}
export function deobfuscate(encoded, key = 'igaming_secure_key') {
    try {
        if (!encoded)
            return '';
        const decoded = decodeURIComponent(escape(atob(encoded)));
        return xorEncryptDecrypt(decoded, key);
    }
    catch (e) {
        return '';
    }
}
