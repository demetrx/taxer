import * as pkijs from 'pkijs';
import * as pvtsutils from 'pvtsutils';
import { v4 } from 'uuid';
import { ICertificate } from 'types';

export default function parseCertificate(certificateBuffer: any) {
  if (certificateBuffer.byteLength === 0) {
    return;
  }

  const certificates = parseCertificate$1(certificateBuffer);
  if (!certificates.length) {
    return;
  }

  const certificate = certificates[0];
  return formatCertificateData(certificate);
}

function formatCertificateData(certificate: pkijs.Certificate): ICertificate {
  const id = v4();
  const name = getValue(certificate, 'subject');
  const issuer = getValue(certificate, 'issuer');
  const from = getDate(certificate, 'notBefore');
  const till = getDate(certificate, 'notAfter');

  return { id, name, issuer, from, till };
}

function getValue(certificate: any, field: string) {
  return certificate[field].typesAndValues
    .find((i: any) => i.type === '2.5.4.3')
    .value.toJSON().valueBlock.value;
}

function getDate(certificate: any, field: string) {
  return certificate[field].toJSON().value.toISOString().split('T')[0];
}

function decodePEM(pem: any, tag = '[A-Z0-9 ]+') {
  const pattern = new RegExp(
    `-{5}BEGIN ${tag}-{5}([a-zA-Z0-9=+\\/\\n\\r]+)-{5}END ${tag}-{5}`,
    'g'
  );
  const res = [];
  let matches = null;
  // eslint-disable-next-line no-cond-assign
  while ((matches = pattern.exec(pem))) {
    const base64 = matches[1].replace(/\r/g, '').replace(/\n/g, '');
    res.push(pvtsutils.Convert.FromBase64(base64));
  }
  return res;
}

function parseCertificate$1(source: any) {
  const buffers = [];
  const buffer = pvtsutils.BufferSourceConverter.toArrayBuffer(source);
  const pem = pvtsutils.Convert.ToBinary(buffer);
  if (/----BEGIN CERTIFICATE-----/.test(pem)) {
    buffers.push(...decodePEM(pem, 'CERTIFICATE'));
  } else {
    buffers.push(buffer);
  }
  const res = [];
  for (const item of buffers) {
    res.push(pkijs.Certificate.fromBER(item));
  }
  return res;
}
