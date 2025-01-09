import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {EmailRecipient} from "@/lib/EmailRecipient.ts";
import * as XLSX from "xlsx";

interface FileUploadProps {
  onFileAccepted: (emailRecipientData: EmailRecipient[]) => void;
}

export const FileUpload = ({ onFileAccepted }: FileUploadProps) => {
  const [fileName, setFileName] = useState<string>("");
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        return;
      }

      let emailRecipientData: EmailRecipient[] = [];

      // Read the file as binary data
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;

        if (!data) {
          toast({
            title: "File Error",
            description: "Unable to read the file.",
            variant: "destructive",
          });
          return;
        }

        try {
          // Parse the Excel file using XLSX
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0]; // Get the first sheet
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert to array of arrays

          // Validate the structure of the Excel file
          if (jsonData.length < 2 || jsonData[0][0] !== "Name" || jsonData[0][1] !== "Email") {
            toast({
              title: "Invalid Format",
              description: "Ensure the Excel file has 'Name' and 'Email' as the first row in A1 and A2 respectively.",
              variant: "destructive",
            });
            return;
          }

          // Process rows
          emailRecipientData = jsonData
              .slice(1) // Skip the header row
              .map((row: { toString: () => string; }[]) => {
                const fullName = row[0]?.toString() || ""; // Name column
                const email = row[1]?.toString() || ""; // Email column

                // Extract the first name from the full name
                const fName = fullName.split(/\s+/)[0]; // First sequence of characters
                return { fName, email };
              })
              .filter((entry: EmailRecipient) => entry.fName && entry.email); // Ensure no empty rows

          // Pass the processed data to the parent callback
          onFileAccepted(emailRecipientData);

          setFileName(file.name);
          toast({
            title: "File uploaded successfully",
            description: `${emailRecipientData.length} entries processed.`,
          });
        } catch (err) {
          toast({
            title: "Processing Error",
            description: "An error occurred while processing the Excel file.",
            variant: "destructive",
          });
        }
      };

      reader.readAsBinaryString(file);
    }
  }, [onFileAccepted, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  return (
    <div className="animate-slide-up">
      <div
        {...getRootProps()}
        className={`file-drop-zone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-sm text-gray-600">
          {isDragActive
            ? "Drop the Excel file here..."
            : "Drag and drop your Excel file here, or click to select"}
        </p>
        <Button variant="outline" className="mt-4">
          Select File
        </Button>
      </div>
      {fileName && (
        <p className="mt-4 text-sm text-gray-600 text-center">
          Selected file: {fileName}
        </p>
      )}
    </div>
  );
};