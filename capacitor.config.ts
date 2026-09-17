import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.genisystemstech.invoicer',
  appName: 'Invoicer',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    }
  }
};

export default config;
