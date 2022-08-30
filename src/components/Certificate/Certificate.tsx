import { FC } from 'react';
import { ICertificate } from 'types';

interface CertificateProps {
  certificate: ICertificate | null;
}

const Certificate: FC<CertificateProps> = ({ certificate }) => {
  if (!certificate) {
    return (
      <div className="certificate empty">
        Виберіть сертифікат, щоб переглянути інформацію
      </div>
    );
  }

  const { name, issuer, from, till } = certificate;
  return (
    <div className="certificate">
      <ul>
        <li>
          <p>Common Name: {name}</p>
        </li>
        <li>
          <p>Issuer CN: {issuer}</p>
        </li>
        <li>
          <p>Valid From: {from}</p>
        </li>
        <li>
          <p>Valid Till: {till}</p>
        </li>
      </ul>
    </div>
  );
};

export default Certificate;
