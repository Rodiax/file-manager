import { Windows } from './window';
import { isDirectorySetupOk, isDirectoriesSet } from '../store/files';

export const NavigationList: {
  label: string;
  description: string;
  window: keyof typeof Windows;
  isValid: () => boolean;
}[] = [
  {
    label: 'Načíst složku se soubory',
    description: '',
    window: 'directory-setup',
    isValid: () => true,
  },
  {
    label: 'Vybrat soubory a aplikace',
    description: '',
    window: 'directory-explorer',
    isValid: () => isDirectoriesSet(),
  },
  {
    label: 'Zahájit kopírování',
    description: '',
    window: 'copy-process',
    isValid: () => isDirectorySetupOk(),
  },
];
