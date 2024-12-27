import type { AIMessage } from '../types'   // typescript type
import { runLLM } from './llm'              // run the LLM model
import { z } from 'zod'                     // define and validate schema
import { runTool } from './toolRunner'      // run the tool
import { addMessages, getMessages, saveToolResponse } from './memory'       // add messages to the memory
import { logMessage, showLoader } from './ui'                   // log the message and show the loader

export const runAgent = async ({                              // function to run the agent
  turns = 10,                                                 
  userMessage,
  tools = [],
}: {
  turns?: number
  userMessage: string
  tools?: { name: string; parameters: z.AnyZodObject }[]
}) => {
  await addMessages([                                         // add the user message to the memory
    {
      role: 'user',
      content: userMessage,
    },
  ])

  const loader = showLoader('Thinking...')                      // show the loader

  while (true) {                                              // infinite loop until the agent fetches a response 
    const history = await getMessages()                       // get the chat history from the memory
    const response = await runLLM({                           // run the LLM model
      messages: history,
      tools,
    })

    await addMessages([response])                             // add the response to the memory

    logMessage(response)                                      // log the response

    if (response.content) {                                     // check if the response has content
      loader.stop()
      return getMessages()
    }

    if (response.tool_calls) {                                // check if the response has tool calls
      const toolCall = response.tool_calls[0]                 // get the first tool call
      loader.update(`executing: ${toolCall.function.name}`)

      const toolResponse = await runTool(toolCall, userMessage)     // run the tool
      await saveToolResponse(toolCall.id, toolResponse)                 // save the tool response in the memory

      loader.update(`executed: ${toolCall.function.name}`)
    }
  }
}
