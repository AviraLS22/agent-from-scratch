import type OpenAI from 'openai'                          // import the OpenAI type
import { generateImage } from './tools/generateImage'     // import the generateImage tool
import { reddit } from './tools/reddit'                         // import the reddit tool
import { dadJoke } from './tools/dadJoke'                       // import the dadJoke tool

export const runTool = async (                                              // function to run the tool
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,            
  userMessage: string
) => {
  const input = {                                                       // input to the tool
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments),                  // parse the arguments of the tool
  }
  switch (toolCall.function.name) {                                     // switch statement to check the name of the tool
    case 'generate_image':
      const image = await generateImage(input)
      return image

    case 'dad_joke':
      return dadJoke(input)

    case 'reddit':
      return reddit(input)

    default:                                                                        // default case if the tool is unknown
      throw new Error(`Unknown tool: ${toolCall.function.name}`)
  }
}
