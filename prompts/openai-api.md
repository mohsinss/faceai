# Connecting to OpenAI API and Streaming the Response

## 1. Overview

To connect to the OpenAI API and stream the response, you'll need to make a POST request to the `https://api.openai.com/v1/chat/completions` endpoint. This request requires a JSON payload that specifies various parameters, such as the model to use, the messages for the conversation, and additional options for controlling the response. Below are the detailed specifications for the request body and parameters.

## 2. Request Body Parameters

- **`messages`**:  
  - Type: `array`  
  - Required: Yes  
  - Description: A list of messages comprising the conversation so far. Each message should have a `role` (e.g., "system", "user", "assistant") and `content` (text of the message).  
  - Example:  
    ```json
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
    ```

- **`model`**:  
  - Type: `string`  
  - Required: Yes  
  - Description: ID of the model to use. For this instruction, use the "gpt-4o-mini" model.  

- **`frequency_penalty`**:  
  - Type: `number` or `null`  
  - Optional  
  - Default: `0`  
  - Description: Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.  

- **`logit_bias`**:  
  - Type: `map`  
  - Optional  
  - Default: `null`  
  - Description: Modify the likelihood of specified tokens appearing in the completion. Accepts a JSON object that maps tokens to an associated bias value from -100 to 100.  

- **`logprobs`**:  
  - Type: `boolean` or `null`  
  - Optional  
  - Default: `false`  
  - Description: Whether to return log probabilities of the output tokens.  

- **`top_logprobs`**:  
  - Type: `integer` or `null`  
  - Optional  
  - Description: Number of most likely tokens to return at each token position, each with an associated log probability. Requires `logprobs` to be `true`.  

- **`max_tokens`**:  
  - Type: `integer` or `null`  
  - Optional  
  - Description: The maximum number of tokens that can be generated in the chat completion.  

- **`n`**:  
  - Type: `integer` or `null`  
  - Optional  
  - Default: `1`  
  - Description: How many chat completion choices to generate for each input message.  

- **`presence_penalty`**:  
  - Type: `number` or `null`  
  - Optional  
  - Default: `0`  
  - Description: Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far.  

- **`response_format`**:  
  - Type: `object`  
  - Optional  
  - Description: Specifies the format that the model must output.  

- **`seed`**:  
  - Type: `integer` or `null`  
  - Optional  
  - Description: Ensures deterministic responses with the same seed value.  

- **`service_tier`**:  
  - Type: `string` or `null`  
  - Optional  
  - Default: `null`  
  - Description: Specifies the latency tier to use for processing the request.  

- **`stop`**:  
  - Type: `string` / `array` / `null`  
  - Optional  
  - Default: `null`  
  - Description: Up to 4 sequences where the API will stop generating further tokens.  

- **`stream`**:  
  - Type: `boolean` or `null`  
  - Optional  
  - Default: `false`  
  - Description: If set to `true`, partial message deltas will be sent as they become available, with the stream terminated by a `data: [DONE]` message.  

- **`stream_options`**:  
  - Type: `object` or `null`  
  - Optional  
  - Default: `null`  
  - Description: Options for streaming response. Only set this when you set `stream: true`.  

- **`temperature`**:  
  - Type: `number` or `null`  
  - Optional  
  - Default: `1`  
  - Description: What sampling temperature to use, between 0 and 2.  

- **`top_p`**:  
  - Type: `number` or `null`  
  - Optional  
  - Default: `1`  
  - Description: Nucleus sampling, where the model considers the results of the tokens with top_p probability mass.  

- **`tools`**:  
  - Type: `array`  
  - Optional  
  - Description: A list of tools the model may call.  

- **`tool_choice`**:  
  - Type: `string` or `object`  
  - Optional  
  - Description: Controls which (if any) tool is called by the model.  

- **`parallel_tool_calls`**:  
  - Type: `boolean`  
  - Optional  
  - Default: `true`  
  - Description: Whether to enable parallel function calling during tool use.  

- **`user`**:  
  - Type: `string`  
  - Optional  
  - Description: A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.  

## 3. Example Request

Here is an example curl command to send a request:

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ],
    "stream": true
  }'
  

## 4. Response Structure
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o-mini",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "\n\nHello there, how may I assist you today?"
    },
    "logprobs": null,
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
