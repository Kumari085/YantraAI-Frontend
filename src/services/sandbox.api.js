import apiClient from './api';
import { CONFIG } from './config';

const MOCK_DELAY_MS = 450;

const buildMockResponse = ({ language, code, input, files }) => {
  const fileNames = files.map((file) => file.name).filter(Boolean);
  const output = [
    '[MOCK SANDBOX RESPONSE]',
    'No browser-side code execution was performed.',
    `Language: ${language}`,
    `Code received: ${code.length} characters`,
    `Input received: ${input ? 'yes' : 'no'}`,
    `Context files: ${fileNames.length ? fileNames.join(', ') : 'none'}`,
    'Connect a FastAPI sandbox executor for real isolated execution.',
  ].join('\n');

  return {
    status: 'completed',
    output,
    error: null,
    execution_time: 0.45,
    exit_code: 0,
    is_mock: true,
  };
};

export const sandboxApi = {
  /**
   * Request execution from the secure backend sandbox.
   * The fallback returns metadata only and never evaluates code in the browser.
   */
  async execute({ language, code, input = '', files = [] }) {
    const request = {
      language,
      code,
      input,
      files: files.map(({ id, name, size, type }) => ({ id, name, size, type })),
    };

    try {
      const response = await apiClient.post(
        `${CONFIG.SANDBOX_API_BASE_URL}/sandbox/execute`,
        request
      );
      return { ...response.data, is_mock: false };
    } catch (error) {
      if (!CONFIG.ENABLE_SIMULATOR_FALLBACK) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
      return buildMockResponse(request);
    }
  },
};

export default sandboxApi;
