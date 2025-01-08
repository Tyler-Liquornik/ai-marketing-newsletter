import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
}

export const FileUpload = ({ onFileAccepted }: FileUploadProps) => {
  const [fileName, setFileName] = useState<string>("");
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        return;
      }
      setFileName(file.name);
      onFileAccepted(file);
      toast({
        title: "File uploaded successfully",
        description: "Your Excel file has been uploaded.",
      });
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