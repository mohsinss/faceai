const getHumeAccessToken = async () => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY;
    
    // Create a config
    const configResponse = await fetch('https://api.hume.ai/v0/evi/configs', {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        evi_version: "2",
        name: `voice_chat_${Date.now()}`,
        prompt: {
          text: "<role>You are an AI assistant helping users analyze their data. Respond concisely and clearly.</role>"
        },
        voice: {
          provider: "HUME_AI",
          name: "ITO"
        },
        language_model: {
          model_provider: "ANTHROPIC",
          model_resource: "claude-3-5-sonnet-20240620",
          temperature: 0.7
        },
        ellm_model: {
          allow_short_responses: true
        },
        event_messages: {
          on_new_chat: {
            enabled: false,
            text: ""
          },
          on_inactivity_timeout: {
            enabled: false,
            text: ""
          },
          on_max_duration_timeout: {
            enabled: false,
            text: ""
          }
        }
      })
    });

    if (!configResponse.ok) {
      const errorData = await configResponse.json();
      console.error('Config error:', errorData);
      throw new Error(`Failed to create config: ${errorData.message || configResponse.statusText}`);
    }

    const configData = await configResponse.json();
    console.log('Created config:', configData);

    return { 
      configId: configData.id,
      apiKey
    };
  } catch (error) {
    console.error('Error in Hume setup:', error);
    throw error;
  }
};

export { getHumeAccessToken }; 