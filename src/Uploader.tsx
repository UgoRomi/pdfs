import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from 'react-dropzone';

const MyComponent: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleDrop = async (acceptedFiles: File[]) => {
    const pdfDoc = await PDFDocument.create();
    for (const file of acceptedFiles) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const imageBytes = await file.arrayBuffer();
        const image = await pdfDoc.embedJpg(imageBytes);
        const page = pdfDoc.addPage();
        const { width, height } = image.scale(0.5);
        page.drawImage(image, {
          x: page.getWidth() / 2 - width / 2,
          y: page.getHeight() / 2 - height / 2,
          width,
          height,
        });
      } else if (file.type === 'application/pdf') {
        const fileData = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileData);
        const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => pdfDoc.addPage(page));
      }
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
