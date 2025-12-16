
import { useEffect } from 'react';

export const useSecurityProtection = () => {
  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
      if (target.isContentEditable) return true;
      return false;
    };

    // Disable right-click context menu
    const disableContextMenu = (e: MouseEvent) => {
      if (isEditableTarget(e.target)) return true;
      e.preventDefault();
      return false;
    };

    // Disable key combinations for developer tools
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      const editable = isEditableTarget(e.target);

      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (Chrome DevTools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Chrome DevTools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Chrome Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+A (Select All)
      if (e.ctrlKey && e.keyCode === 65) {
        if (editable) return true;
        e.preventDefault();
        return false;
      }
      
      // Ctrl+P (Print)
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection and drag
    const disableSelection = () => {
      document.onselectstart = () => false;
      document.ondragstart = () => false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableKeyboardShortcuts);
    disableSelection();

    // Add CSS to prevent image saving and selection
    const style = document.createElement('style');
    style.textContent = `
      img {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
        pointer-events: none;
      }
      
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    // Console warning
    console.clear();
    console.log('%cPARAR!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cEsta é uma funcionalidade do navegador destinada a desenvolvedores. Não cole ou digite código aqui, pois isso pode comprometer sua segurança.', 'color: red; font-size: 16px;');

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      document.onselectstart = null;
      document.ondragstart = null;
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);
};
