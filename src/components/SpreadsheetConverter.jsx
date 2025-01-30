import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';



export  async function uploadPDFToFirebase(pdfBlob, filename) {
    try {
      const storageRef = ref(storage, `flows/${filename}`);
      const uploadResult = await uploadBytes(storageRef, pdfBlob);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      await uploadFlow({
        tournamentId,
        fileName: filename,
        fileUrl: downloadURL,
        fileType: 'pdf',
        uploadDate: new Date().toISOString(),
      });

      return downloadURL;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  export async function convertSpreadsheetToPDF(file) {
    try {
      const workbook = await readExcelFile(file);
      
      const doc = new jsPDF(styleOptions.orientation, 'pt', styleOptions.pageSize);
      
      await handleMultipleSheets(workbook, doc);
      
      const pdfBlob = doc.output('blob');
      return pdfBlob;
      
    } catch (error) {
      console.error('Error converting spreadsheet:', error);
      throw error;
    }
  }

  export const readExcelFile = async (file) => {
    const workbook = new ExcelJS.Workbook();
    
    try {
      if (file.name.endsWith('.csv')) {
        await workbook.csv.read(file);
      } else {
        await workbook.xlsx.load(await file.arrayBuffer());
      }
      return workbook;
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error('Error reading spreadsheet file');
    }
  };


const SpreadsheetConverter = ({ onUploadComplete, tournamentId }) => {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const styleOptions = {
    pageSize: 'A4',
    orientation: 'landscape',
    margins: { top: 30, right: 20, bottom: 30, left: 20 },
    headerStyle: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 12
    },
    bodyStyle: {
      fontSize: 10,
      textColor: 50
    }
  };

  
  const handleMultipleSheets = async (workbook, doc) => {
    let currentPage = 1;
    
    for (const worksheet of workbook.worksheets) {
      if (currentPage > 1) doc.addPage();
      
      // Convert worksheet data to array
      const rows = [];
      worksheet.eachRow((row, rowNumber) => {
        rows.push(row.values.slice(1)); // Remove the first empty element
      });

      // Filter out empty rows
      const filteredRows = rows.filter(row => 
        row.some(cell => cell != null && cell !== '')
      );

      if (filteredRows.length > 0) {
        doc.setFontSize(14);
        doc.text(worksheet.name, 14, 15);

        doc.autoTable({
          head: [filteredRows[0]],
          body: filteredRows.slice(1),
          startY: 25,
          styles: styleOptions.bodyStyle,
          headStyles: styleOptions.headerStyle,
          margin: styleOptions.margins,
          didDrawPage: (data) => {
            doc.setFontSize(10);
            doc.text(
              `Page ${data.pageNumber}`,
              doc.internal.pageSize.width - 20,
              doc.internal.pageSize.height - 10,
              { align: 'right' }
            );
          }
        });
      }

      setProgress((currentPage / workbook.worksheets.length) * 100);
      currentPage++;
    }
  };



  const isValidSpreadsheet = (file) => {
    const validExtensions = ['.xlsx', '.xls', '.csv', '.ods'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB limit');
      return;
    }

    if (!isValidSpreadsheet(file)) {
      setError('Invalid file type. Please upload a valid spreadsheet.');
      return;
    }

    try {
      setIsConverting(true);
      setError(null);
      setProgress(0);

      const pdfBlob = await convertSpreadsheetToPDF(file);
      
      // Upload the converted PDF
      const downloadURL = await uploadPDFToFirebase(
        pdfBlob, 
        `${file.name.split('.')[0]}.pdf`
      );

      if (onUploadComplete) {
        onUploadComplete(downloadURL);
      }
      
    } catch (error) {
      setError('Error converting file: ' + error.message);
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };



  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Spreadsheet
        </label>
        <input
          type="file"
          onChange={handleFileSelect}
          accept=".xlsx,.xls,.csv,.ods"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={isConverting}
        />
      </div>

      {isConverting && (
        <div className="space-y-2">
          <div className="text-blue-600">
            Converting spreadsheet to PDF...
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-600 mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default SpreadsheetConverter;
