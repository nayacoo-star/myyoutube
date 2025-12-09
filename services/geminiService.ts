import { GoogleGenAI, Type } from "@google/genai";
import { ScriptData, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTranscript = async (transcript: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Analyze the following YouTube transcript. 
        1. Identify the structural formula (Hook type, Body paragraphs, Pacing, Retention tactics, CTA).
        2. Suggest 3 viral video topics that would fit this EXACT structure perfectly.
        
        Transcript:
        """
        ${transcript.substring(0, 15000)}
        """
      `,
      config: {
        systemInstruction: "You are a YouTube Expert. Analyze the script structure deeply. Output in Korean (Korean language).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            structureAnalysis: { type: Type.STRING, description: "A summary of the video's structure, hook style, and retention tricks in Korean." },
            suggestedTopics: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 viral video topics that fit this structure."
            }
          },
          required: ["structureAnalysis", "suggestedTopics"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis generated");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("대본 분석에 실패했습니다.");
  }
};

export const generateRemixedScript = async (data: ScriptData): Promise<string> => {
  try {
    const { originalTranscript, newTopic, structureAnalysis } = data;

    const systemInstruction = `
      당신은 유튜브 스크립트 전문 작가입니다.
      
      당신의 목표:
      제공된 "원본 대본의 구조(structureAnalysis)"를 완벽하게 모방하여, "새로운 주제(newTopic)"에 맞는 새로운 대본을 작성하십시오.
      
      규칙:
      1. 언어: 반드시 **한국어(Korean)**로 작성하십시오.
      2. 구조 복제: 원본이 질문으로 시작하면 새 대본도 질문으로 시작하십시오. 원본이 반전을 준다면 새 대본도 같은 타이밍에 반전을 주십시오.
      3. 내용: 내용은 철저하게 "새로운 주제"에 맞춰야 합니다.
      4. 형식: 읽기 쉬운 스크립트 형식(Markdown)으로 작성하십시오. (### 훅, ### 본론 등 헤더 사용)
    `;

    const userPrompt = `
      [참고 자료]
      1. 원본 대본 분석(구조): 
      ${structureAnalysis}

      2. 원본 대본 (참고용):
      """
      ${originalTranscript.substring(0, 5000)}... (생략)
      """

      ---
      
      [작업 요청]
      새로운 주제: "${newTopic}"
      위 구조를 그대로 적용해서 대본을 지금 바로 작성해줘.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "대본 생성에 실패했습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Generation failed:", error);
    throw new Error("스크립트 생성 중 오류가 발생했습니다.");
  }
};