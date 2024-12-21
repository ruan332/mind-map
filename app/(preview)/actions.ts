"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { cacheManager, generateFileHash } from "@/lib/cache";

// Tradução das strings para português (PT-BR)
const mensagemBoasVindas = 'Bem-vindo ao nosso aplicativo!';
const tituloQuiz = 'Título do Quiz';
const descricaoQuiz = 'Esta é uma descrição do quiz.';

export const generateQuizTitle = async (file: string, fileContent?: Buffer) => {
  // Se tiver conteúdo do arquivo, gera hash para cache
  if (fileContent) {
    const fileHash = generateFileHash(fileContent);
    const cacheKey = `quiz_title_${fileHash}`;

    // Verifica se existe cache
    const cachedResult = await cacheManager.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Se não existe cache, gera novo título
    const result = await generateObject({
      model: google("gemini-1.5-flash-latest"),
      schema: z.object({
        title: z
          .string()
          .describe(
            "Um título de no máximo três palavras para o quiz com base no arquivo fornecido como contexto",
          ),
      }),
      prompt:
        "Gere um título para um quiz com base no seguinte nome de arquivo (PDF). Tente extrair o máximo de informações possível do nome do arquivo. Se o nome do arquivo for apenas números ou incoerente, apenas retorne quiz.\n\n " + file,
    });

    // Salva no cache
    await cacheManager.set(cacheKey, result.object.title);
    return result.object.title;
  }

  // Se não tiver conteúdo do arquivo, executa normalmente sem cache
  const result = await generateObject({
    model: google("gemini-1.5-flash-latest"),
    schema: z.object({
      title: z
        .string()
        .describe(
          "Um título de no máximo três palavras para o quiz com base no arquivo fornecido como contexto",
        ),
    }),
    prompt:
      "Gere um título para um quiz com base no seguinte nome de arquivo (PDF). Tente extrair o máximo de informações possível do nome do arquivo. Se o nome do arquivo for apenas números ou incoerente, apenas retorne quiz.\n\n " + file,
  });
  return result.object.title;
};
