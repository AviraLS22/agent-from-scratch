// This tool uses the OpenAI API to generate an image using a diffusion model image generator like Dall-E.
//  The tool takes a prompt as input and returns the URL of the generated image.
import type { ToolFn } from '../../types'     // import the ToolFn type from the types file
import { openai } from '../ai'                  // import the openai client
import { z } from 'zod'                             // zod is a library for data validation

export const generateImageToolDefinition = {              // define the generateImage tool
  name: 'generate_image',                                   // name of the tool
  parameters: z                                           // parameters of the tool
    .object({                                              
      prompt: z                                             // prompt parameter
        .string()                                           // prompt is a string
        .describe(                                                      // description of the prompt parameter
          'The prompt to use to generate the image with a diffusion model image generator like Dall-E'
        ),
    })
    .describe('Generates an image and returns the url of the image.'),              // description of the tool
}

type Args = z.infer<typeof generateImageToolDefinition.parameters>        // define the Args type               

export const generateImage: ToolFn<Args, string> = async ({                 // define the generateImage tool function            
  toolArgs,
  userMessage,
}) => {
  const response = await openai.images.generate({                   // generate an image using the OpenAI API
    model: 'dall-e-3',
    prompt: toolArgs.prompt,
    n: 1,
    size: '1024x1024',
  })

  const imageUrl = response.data[0].url!                        // get the URL of the generated image               

  return imageUrl                                     // return the URL of the generated image
}
