import { DragEventHandler, FC, useState } from 'react';

interface UploadProps {
  onUpload: (file: File) => void;
}

const Upload: FC<UploadProps> = ({ onUpload }) => {
  const [drag, setDrag] = useState<boolean>(false);

  const dragStartHandler: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDrag(true);
  };

  const dragLeaveHandler: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDrag(false);
  };

  const dropHandler: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const file = Array.from(e.dataTransfer.files)[0];

    onUpload(file);
    setDrag(false);
  };

  return (
    <>
      {drag ? (
        <div
          className="drop-area"
          onDragStart={dragStartHandler}
          onDragLeave={dragLeaveHandler}
          onDragOver={dragStartHandler}
          onDrop={dropHandler}
        >
          Відпустіть, щоб загрузити сертифікат
        </div>
      ) : (
        <div
          className="drop-area"
          onDragStart={dragStartHandler}
          onDragLeave={dragLeaveHandler}
          onDragOver={dragStartHandler}
        >
          Перетягніть файл сертифіката у поле
        </div>
      )}
    </>
  );
};

export default Upload;
