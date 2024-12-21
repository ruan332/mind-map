export const config = {
  cache: {
    // Tempo de expiração do cache em milissegundos (24 horas)
    expiryTime: 24 * 60 * 60 * 1000,
    
    // Prefixos para as chaves de cache
    keyPrefixes: {
      pdfContent: 'pdf_content_',
      quizTitle: 'quiz_title_',
      mindMap: 'mind_map_',
    },
  },
  
  // Configurações do PDF
  pdf: {
    maxSize: 5 * 1024 * 1024, // 5MB em bytes
    allowedTypes: ['application/pdf'],
  },
}
