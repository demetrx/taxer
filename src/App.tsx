import { useCallback, useEffect, useRef, useState } from 'react';
import NamesTable from './components/NamesTable/NamesTable';
import Button from './components/Button/Button';
import Certificate from './components/Certificate/Certificate';
import Upload from './components/Upload/Upload';
import parseCertificate from './calc/parseCertificate';
import { toast } from 'react-toastify';
import { ICertificate } from './types';

const LS_KEY = 'certificates';

function App() {
  const [touched, setTouched] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const isFirstRender = useRef(true);

  useEffect(() => {
    const savedCertificates = localStorage.getItem(LS_KEY);
    if (!savedCertificates) {
      return;
    }

    setCertificates(JSON.parse(savedCertificates));
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    localStorage.setItem(LS_KEY, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    // selectUploaded
    if (certificates.length > 0 && touched) {
      const lastCertificateId = certificates[certificates.length - 1].id;
      setCurrentUser(lastCertificateId);
    }
  }, [certificates, touched]);

  const getNamesWithIds = useCallback(
    () => certificates.map(({ name, id }) => ({ name, id })),
    [certificates]
  );

  const getCurrentCertificate = useCallback(() => {
    return currentUser ? certificates.find((i) => i.id === currentUser)! : null;
  }, [certificates, currentUser]);

  const addCertificate = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const certificate: ICertificate = parseCertificate(e!.target!.result)!;

      if (!certificate) {
        toast.error('Файл не є валідним сертифікатом');
        return;
      }

      setIsUploading(false);
      setTouched(true);
      setCertificates((pv) => [...pv, certificate]);
      toast.success('Сертифікат додано');
    };
    file && reader.readAsArrayBuffer(file);
  };

  const startUploading = () => {
    setCurrentUser(null);
    setIsUploading(true);
  };

  return (
    <div className="app">
      <div>
        <NamesTable
          users={getNamesWithIds()}
          onSelectUser={setCurrentUser}
          currentUser={currentUser}
          disabled={isUploading}
        />
        {isUploading ? (
          <Button onClick={() => setIsUploading(false)} content="Скасувати" />
        ) : (
          <Button onClick={startUploading} content="Додати" />
        )}
      </div>
      {isUploading ? (
        <Upload onUpload={addCertificate} />
      ) : (
        <Certificate certificate={getCurrentCertificate()} />
      )}
    </div>
  );
}

export default App;
