import { JSONFilePreset } from 'lowdb/node' //A utility from lowdb library to create a JSON file a database
import type { AIMessage } from '../types' // typescript type
import { v4 as uuidv4 } from 'uuid'     // a utility to generate a unique id

export type MessageWithMetadata = AIMessage & {                                         // a type that extends the AIMessage type and adds two more properties here - id and createdAt
  id: string
  createdAt: string
}

export const addMetadata = (message: AIMessage): MessageWithMetadata => ({             // a function that adds metadata to the message
  ...message,
  id: uuidv4(),
  createdAt: new Date().toISOString(),
})

export const removeMetadata = (message: MessageWithMetadata): AIMessage => {          // a function that removes metadata from the message
  const { id, createdAt, ...messageWithoutMetadata } = message    
  return messageWithoutMetadata
}

type Data = {                                                                         // a type that defines the data structure of the database
  messages: MessageWithMetadata[]
}

const defaultData: Data = { messages: [] }                                           // a default data structure for the database

export const getDb = async () => {                                                   // a function that returns the database in json file
  const db = await JSONFilePreset<Data>('db.json', defaultData)

  return db
}

export const addMessages = async (messages: AIMessage[]) => {                        // a function that adds messages to the database along with metadata
  const db = await getDb()
  db.data.messages.push(...messages.map(addMetadata))
  await db.write()
}

export const getMessages = async () => {                                            // a function that gets messages from the database and removes metadata                  
  const db = await getDb()
  return db.data.messages.map(removeMetadata)
}

export const saveToolResponse = async (                                             // a function that saves the tool response in the database
  toolCallId: string,
  toolResponse: string
) => {
  return await addMessages([                                                        
    { role: 'tool', content: toolResponse, tool_call_id: toolCallId },
  ])
}

export const clearMessages = async (keepLast?: number) => {                         // a function that clears the messages from the database
  const db = await getDb()
  db.data.messages = db.data.messages.slice(-(keepLast ?? 0))                      // keeps the last n messages in the database
  await db.write()
}
