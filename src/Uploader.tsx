import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from 'react-dropzone';

const MyComponent: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleDrop = async (acceptedFiles: File[]) => {
    const pdfDoc = await PDFDocument.create();
    for (const file of acceptedFiles) {
      const fileData = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileData);
      const copiedPages = await pdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  };

  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag and drop some files here, or click to select files</p>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              width='100%'
              height='500px'
              title='Multi-page PDF'
            />
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default MyComponent;
