import React, { useState, ChangeEvent, useRef } from 'react';
import EmptyPhoto from 'styles/images/ProfileEmpty.jpg';
import { ToastError } from 'components/Messages/Toast';
import { Avatar } from 'primereact/avatar';
import PhotoEditor from './PhotoEditor';

interface AvatarUploaderProps {
  profileImage: string;
  setProfileImage: (image: string) => void;
  setFileBase64: (base64: string) => void;
  setFileName: (name: string) => void;
  disabled: boolean;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  profileImage,
  setProfileImage,
  setFileBase64,
  setFileName,
  disabled
}) => {
  const [localProfileImage, setLocalProfileImage] = useState<string>(profileImage);
  const [editorImage, setEditorImage] = useState<string | null>(null);
  const [pendingFileName, setPendingFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setEditorImage(e.target.result as string);
          setPendingFileName(file.name);
        } else {
          console.error("e.target.result es null o undefined");
        }
      };
      reader.onerror = (error: ProgressEvent<FileReader>) => {
        ToastError(`Error al leer el archivo: ${error.target?.error?.message || 'Error desconocido'}`);
      };
      reader.readAsDataURL(file);
    }
    // Permite volver a subir la misma imagen después de cancelar
    event.target.value = '';
  };

  const handleEditorSave = (croppedBase64: string) => {
    setProfileImage(croppedBase64);
    setLocalProfileImage(croppedBase64);
    setFileBase64(croppedBase64.split(',')[1]);
    setFileName(pendingFileName);
    setEditorImage(null);
  };

  const handleEditorCancel = () => {
    setEditorImage(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Avatar
        shape="circle"
        image={localProfileImage || EmptyPhoto}
        style={{ width: '250px', height: '250px', border: '4px solid #154270' }}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label="Subir imagen de avatar"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        id="file-input"
      />
      <button
        aria-label="Subir avatar"
        style={{
          position: 'absolute',
          bottom: '0px',
          left: '75%',
          width: '40px',
          height: '40px',
          transform: 'translateX(-50%)',
          background: '#154270',
          color: 'white',
          borderRadius: '100%',
          border: 'none',
          cursor: 'pointer'
        }}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <i className="pi pi-camera" style={{ fontSize: '1.7em' }}></i>
      </button>
      {editorImage &&
        <PhotoEditor
          imageSrc={editorImage}
          onSave={handleEditorSave}
          onCancel={handleEditorCancel}
        />
      }
    </div>
  );
};

export default AvatarUploader;