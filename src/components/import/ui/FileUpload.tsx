import React, { useCallback } from "react";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = [".xlsx", ".xls"],
  maxSize = 10 * 1024 * 1024, // 10MB
}) => {
  const validateFile = useCallback(
    (file: File): boolean => {
      // Validar tipo de arquivo
      const isValidType = acceptedTypes.some((type) =>
        file.name.toLowerCase().endsWith(type.toLowerCase()),
      );

      if (!isValidType) {
        alert(
          `Tipo de arquivo não suportado. Tipos aceitos: ${acceptedTypes.join(", ")}`,
        );
        return false;
      }

      // Validar tamanho
      if (file.size > maxSize) {
        alert(
          `Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`,
        );
        return false;
      }

      return true;
    },
    [acceptedTypes, maxSize],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect, validateFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect, validateFile],
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-gray-400 hover:bg-gray-50"
    >
      <input
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Arraste e solte um arquivo Excel aqui, ou clique para selecionar
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Formatos aceitos: {acceptedTypes.join(", ")} | Máximo:{" "}
          {maxSize / 1024 / 1024}MB
        </p>
      </label>
    </div>
  );
};
