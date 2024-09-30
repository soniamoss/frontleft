import { ExpoConfig } from '@expo/config-types';

interface CustomConfig extends ExpoConfig {
  extra?: {
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    eas?: {
      projectId: string;
    }
  };
  "updates": {
    "url": string;
  };
  "runtimeVersion": {
    "policy": "appVersion";
  };
}

export default ({ config }: { config: CustomConfig }) => ({
  ...config,
  extra: {
    SUPABASE_URL: 'https://qkjjrcuoqnrjiimpmwpk.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrampyY3VvcW5yamlpbXBtd3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY1MTE2MjgsImV4cCI6MjAzMjA4NzYyOH0.L_9XB2JVCJ6NPPrMxeFqiDXCvH2DP939tIMSmxfxsto',
    eas: {
        projectId: 'bb85929a-7842-4ce0-ac4c-bbf0af877d0b',
    }
  },
  "updates": {
    "url": "https://u.expo.dev/bb85929a-7842-4ce0-ac4c-bbf0af877d0b"
  },
  "runtimeVersion": {
    "policy": "appVersion"
  }
});
