"use server";

import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

console.log(process.env.NEXT_OPENAI_API_KEY);

console.log({
  apiKey: process.env.NEXT_OPENAI_API_KEY || "",
  baseURL: "https://api.openai.com/v1", // "http://flock.tools:8001/v1", // defaults to https://api.openai.com/v1
  dangerouslyAllowBrowser: true,
});

const openai = new OpenAI({
  apiKey: process.env.NEXT_OPENAI_API_KEY || "",
  baseURL: "https://api.openai.com/v1", // "http://flock.tools:8001/v1", // defaults to https://api.openai.com/v1
  dangerouslyAllowBrowser: true,
});

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { prompt } = req.body;
  console.log("Prompt:", prompt);
  // console.log("Model:", process.env.model_name);
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
            Create a quantum circit and return only the OpenQASM V2 format for the quantum computer for the following problem (we need just the qasm output and nothing more):
            ${prompt}
          `,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    console.log("Response:", chatCompletion);
    console.log("Choices:", chatCompletion?.choices[0].message);
    const message = chatCompletion?.choices[0]?.message.content;
    if (!message) return res.status(500).json({ message: "Something went wrong" });
    return res.json({ message });
  } catch (error) {
    console.error("Error getting completion from OpenAI:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
