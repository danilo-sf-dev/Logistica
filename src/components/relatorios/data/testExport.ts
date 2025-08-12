/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Teste simples para verificar se as bibliotecas estão funcionando
export const testLibraries = () => {
  try {
    // Testar jsPDF
    const jsPDF = require("jspdf");
    console.log("✅ jsPDF carregado com sucesso");

    // Testar autoTable
    const autoTable = require("jspdf-autotable");
    console.log("✅ autoTable carregado com sucesso");

    // Testar XLSX
    const XLSX = require("xlsx");
    console.log("✅ XLSX carregado com sucesso");

    // Testar file-saver
    const { saveAs } = require("file-saver");
    console.log("✅ file-saver carregado com sucesso");

    return true;
  } catch (error) {
    console.error("❌ Erro ao carregar bibliotecas:", error);
    return false;
  }
};

// Teste de criação de PDF simples
export const testSimplePDF = () => {
  try {
    const jsPDF = require("jspdf");
    const doc = new jsPDF();
    doc.text("Teste de PDF", 20, 20);
    doc.save("teste.pdf");
    console.log("✅ PDF simples criado com sucesso");
    return true;
  } catch (error) {
    console.error("❌ Erro ao criar PDF simples:", error);
    return false;
  }
};

// Teste de criação de Excel simples
export const testSimpleExcel = () => {
  try {
    const XLSX = require("xlsx");
    const { saveAs } = require("file-saver");

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["Nome", "Idade"],
      ["João", 30],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Teste");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "teste.xlsx");
    console.log("✅ Excel simples criado com sucesso");
    return true;
  } catch (error) {
    console.error("❌ Erro ao criar Excel simples:", error);
    return false;
  }
};
