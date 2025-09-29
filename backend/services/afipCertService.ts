import fs from 'fs';

const CERT_PATH = '/tmp/afip-cert.crt';
const KEY_PATH = '/tmp/afip-key.key';

export function writeAfipCertAndKey() {
    if (process.env.AFIP_CERT_CONTENT && !fs.existsSync(CERT_PATH)) {
        fs.writeFileSync(CERT_PATH, process.env.AFIP_CERT_CONTENT, { encoding: 'utf8' });
    }
    if (process.env.AFIP_KEY_CONTENT && !fs.existsSync(KEY_PATH)) {
        fs.writeFileSync(KEY_PATH, process.env.AFIP_KEY_CONTENT, { encoding: 'utf8' });
    }
    return {
        certPath: CERT_PATH,
        keyPath: KEY_PATH,
    };
}

export function cleanupAfipCertAndKey() {
    if (fs.existsSync(CERT_PATH)) {
        fs.unlinkSync(CERT_PATH);
    }
    if (fs.existsSync(KEY_PATH)) {
        fs.unlinkSync(KEY_PATH);
    }
}
