import { ExpoConfig } from '@expo/config-types';

interface CustomConfig extends ExpoConfig {
  extra?: {
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
  };
}

export default ({ config }: { config: CustomConfig }) => ({
  ...config,
  extra: {
    SUPABASE_URL: 'https://qkjjrcuoqnrjiimpmwpk.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrampyY3VvcW5yamlpbXBtd3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY1MTE2MjgsImV4cCI6MjAzMjA4NzYyOH0.L_9XB2JVCJ6NPPrMxeFqiDXCvH2DP939tIMSmxfxsto',
  },
});
