'use server';
/**
 * @fileOverview This file provides a Genkit flow for generating a lucky message
 * based on provided lotto numbers.
 *
 * - generateLuckyLottoMessage - A function that generates a unique, AI-generated
 *   lucky message for lotto numbers.
 * - GenerateLuckyLottoMessageInput - The input type for the generateLuckyLottoMessage function.
 * - GenerateLuckyLottoMessageOutput - The return type for the generateLuckyLottoMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLuckyLottoMessageInputSchema = z.object({
  lottoNumbers: z
    .array(z.number().int().min(1).max(45))
    .length(6)
    .describe('The 6 unique lotto numbers generated.'),
});
export type GenerateLuckyLottoMessageInput = z.infer<
  typeof GenerateLuckyLottoMessageInputSchema
>;

const GenerateLuckyLottoMessageOutputSchema = z.object({
  message: z
    .string()
    .describe(
      'A positive and unique lucky message related to the generated lotto numbers.'
    ),
});
export type GenerateLuckyLottoMessageOutput = z.infer<
  typeof GenerateLuckyLottoMessageOutputSchema
>;

export async function generateLuckyLottoMessage(
  input: GenerateLuckyLottoMessageInput
): Promise<GenerateLuckyLottoMessageOutput> {
  return generateLuckyLottoMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLuckyLottoMessagePrompt',
  input: {schema: GenerateLuckyLottoMessageInputSchema},
  output: {schema: GenerateLuckyLottoMessageOutputSchema},
  prompt: `You are a friendly and optimistic AI assistant. Generate a unique, positive, and encouraging lucky message or short phrase for a user who has just generated the following lotto numbers for an upcoming lottery draw. Make the message resonate with the idea of luck, fortune, and the excitement of winning. Do not mention specific winning strategies or financial advice, just pure positive encouragement. Keep the message concise and impactful, suitable for a lottery encouraging message. 

Lotto Numbers: {{{lottoNumbers}}}`,
});

const generateLuckyLottoMessageFlow = ai.defineFlow(
  {
    name: 'generateLuckyLottoMessageFlow',
    inputSchema: GenerateLuckyLottoMessageInputSchema,
    outputSchema: GenerateLuckyLottoMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
