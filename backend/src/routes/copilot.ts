import { Router, Request, Response } from 'express';
import { env } from '../config/env';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

/**
 * POST /api/copilot/chat
 *
 * Proxies chat messages to the Azure ML PromptFlow endpoint.
 * The API key never leaves the server.
 */
router.post(
  '/chat',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { chat_input, chat_history } = req.body;

    if (!chat_input || typeof chat_input !== 'string') {
      res.status(400).json({ error: 'chat_input is required' });
      return;
    }

    if (!env.copilotApiKey || !env.copilotUrl) {
      res.status(503).json({ error: 'Copilot service is not configured' });
      return;
    }

    const response = await fetch(env.copilotUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.copilotApiKey}`,
        'azureml-model-deployment': env.copilotDeployment,
      },
      body: JSON.stringify({
        chat_input,
        chat_history: Array.isArray(chat_history) ? chat_history : [],
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error(
        `Copilot upstream error: ${response.status} ${response.statusText}`,
        text,
      );
      res.status(502).json({ error: 'Copilot service returned an error' });
      return;
    }

    const data = await response.json();
    res.json(data);
  }),
);

export default router;
