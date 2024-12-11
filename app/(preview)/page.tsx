"use client";

import { useState } from "react";
import { experimental_useObject } from "ai/react";
import { toast } from "sonner";
import { FileUp, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { pdfExtractSchema, type PDFExtract } from "@/lib/schemas";

export default function PDFAnalyzer() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const {
    submit,
    object: extractedContent,
    isLoading,
  } = experimental_useObject<PDFExtract>({
    api: "/api/generate-quiz",
    schema: pdfExtractSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to analyze PDF. Please try again.");
      setFiles([]);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker.",
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024,
    );
    console.log(validFiles);

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }

    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      })),
    );
    submit({ files: encodedFiles });
  };

  return (
    <div className="min-h-[100dvh] w-full flex justify-center">
      <Card className="w-full max-w-md h-full border-0 sm:border sm:h-fit mt-12">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center space-x-2 text-muted-foreground">
            <div className="rounded-full bg-primary/10 p-2">
              <FileUp className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              PDF Key Points Extractor
            </CardTitle>
            <CardDescription className="text-base">
              Upload a PDF to extract key points using{" "}
              <Link href="https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai">
                Google&apos;s Gemini Pro
              </Link>
              .
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmitWithFiles} className="space-y-4">
            <div
              className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                {files.length > 0 ? (
                  <span className="font-medium text-foreground">
                    {files[0].name}
                  </span>
                ) : (
                  <span>Drop your PDF here or click to browse.</span>
                )}
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={files.length === 0}
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing PDF...</span>
                </span>
              ) : (
                "Extract Key Points"
              )}
            </Button>
          </form>

          {extractedContent && extractedContent.keyPoints && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-lg">{extractedContent.title}</h3>
              <ul className="space-y-3">
                {/* Group items by context */}
                {extractedContent.keyPoints.reduce((acc: JSX.Element[], item, index) => {
                  if (item && extractedContent.keyPoints) {
                    // If this is a new context or the first item, add the heading
                    if (index === 0 || item.context !== extractedContent.keyPoints[index - 1]?.context) {
                      acc.push(
                        <h4 key={`context-${index}`} className="font-medium text-lg mt-4 first:mt-0">
                          {item.context || 'General'}
                        </h4>
                      );
                    }
                    
                    // Add the point
                    acc.push(
                      <li key={index} className="space-y-1">
                        <p className="text-sm">{item.point}</p>
                      </li>
                    );
                  }
                  return acc;
                }, [])}
              </ul>
            </div>
          )}
        </CardContent>

        {isLoading && (
          <CardFooter>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Analyzing document...</span>
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
