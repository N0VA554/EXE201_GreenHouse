export const forceQuillHeight = (containerHeight: string = '400px', editorHeight: string = '350px') => {
  const timer = setTimeout(() => {
    const quillContainers = document.querySelectorAll('.quillEditor .ql-container');
    const quillEditors = document.querySelectorAll('.quillEditor .ql-editor');
    
    quillContainers.forEach((container: any) => {
      container.style.minHeight = '200px';
      container.style.maxHeight = containerHeight;
      container.style.height = containerHeight;
      container.style.overflowY = 'auto';
    });
    
    quillEditors.forEach((editor: any) => {
      editor.style.minHeight = '200px';
      editor.style.maxHeight = editorHeight;
      editor.style.height = editorHeight;
      editor.style.overflowY = 'auto';
    });
  }, 100);
  
  return timer;
};

export const forceQuillHeightMobile = () => {
  const timer = setTimeout(() => {
    const quillContainers = document.querySelectorAll('.quillEditor .ql-container');
    const quillEditors = document.querySelectorAll('.quillEditor .ql-editor');
    
    quillContainers.forEach((container: any) => {
      container.style.minHeight = '150px';
      container.style.maxHeight = '300px';
      container.style.height = '300px';
      container.style.overflowY = 'auto';
    });
    
    quillEditors.forEach((editor: any) => {
      editor.style.minHeight = '150px';
      editor.style.maxHeight = '250px';
      editor.style.height = '250px';
      editor.style.overflowY = 'auto';
    });
  }, 100);
  
  return timer;
}; 