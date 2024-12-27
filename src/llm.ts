import { zodFunction } from 'openai/helpers/zod' // to validate input using zod schema
import { z } from 'zod'// to define and validate schema
import type { AIMessage } from '../types'// typescript type 
import { openai } from './ai'// openai api
import { systemPrompt } from './systemPrompt'// system prompt to define the protocols 


export const runLLM = async ({  // function to run the LLM model
  model = 'gpt-4o-mini',            // specifies the model of the llm used 
  messages,                         // an array of AImessages representing chat history 
  temperature = 0.1,              // randomness in predicting the output of the model                 
  tools,                         // tools to be used in the model                       
}: {
  messages: AIMessage[]
  temperature?: number
  model?: string
  tools?: { name: string; parameters: z.AnyZodObject }[]
}) => {
  const formattedTools = tools?.map((tool) => zodFunction(tool))     // format the tools to be used in the model using the zod function                                                          
  const response = await openai.chat.completions.create({            // call the openai api to get the completions of the model
    model,
    messages: [
      {                                                             // combines the system prompt and the messages provided by the user                                                                                    
        role: 'system',
        content: systemPrompt,
      },
      ...messages,
    ],
    temperature,
    tools: formattedTools,
    tool_choice: 'auto',                                                   // auto chooses the best tool to use in the model
    parallel_tool_calls: false,
  })

  return response.choices[0].message                                          // return the first response of the model 
}
