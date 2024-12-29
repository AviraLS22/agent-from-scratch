// this file defines a tool that fetches a dad joke from the icanhazdadjoke API and returns a string with the joke.

import { z } from 'zod'      // zod is a library for data validation
import type { ToolFn } from '../../types'         // import the ToolFn type from the types file
import fetch from 'node-fetch'              // node-fetch is a library that allows us to make HTTP requests in Node.js    

export const dadJokeToolDefinition = {                         // define the dadJoke tool
  name: 'dad_joke',                                           // name of the tool
  parameters: z.object({}),                                   // parameters of the tool
}

type Args = z.infer<typeof dadJokeToolDefinition.parameters>        // define the Args type

export const dadJoke: ToolFn<Args, string> = async ({ toolArgs }) => {            // define the dadJoke tool function
  const res = await fetch('https://icanhazdadjoke.com/', {                          // fetch a dad joke from the icanhazdadjoke API
    headers: {
      Accept: 'application/json',                                                   // specify that we want the response in JSON format
    },
  })
  return (await res.json()).joke                                                // return the joke from the response
}
