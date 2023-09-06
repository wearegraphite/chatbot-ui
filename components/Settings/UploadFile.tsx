import { FC } from 'react';
import { SidebarButton } from '../Sidebar/SidebarButton';
import { IconFileImport } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props { }

export const UploadFile: FC<Props> = () => {
  const { t } = useTranslation('sidebar');

  const handleImportData = () => {
    const modal = document.querySelector('#uploadIframeModal') as HTMLDialogElement;
    modal.showModal();
  };

  return (
    <>
      <SidebarButton
        text={t('Import files')}
        icon={<IconFileImport size={18} />}
        onClick={() => handleImportData()}
      />

      <dialog id="uploadIframeModal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl h-full">
          <iframe src={process.env.NEXT_PUBLIC_UPLOAD_FILE_URL} className="w-full h-full"></iframe>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button></button>
        </form>
      </dialog>
    </>
  );
};
