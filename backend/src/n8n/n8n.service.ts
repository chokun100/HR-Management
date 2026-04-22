import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);
  
  // URL ของ Webhook ที่สร้างใน n8n (คุณต้องไปสร้าง workflow แบบ Webhook ใน n8n แล้วเอา URL มาใส่)
  private readonly n8nWebhookUrl = 'http://localhost:5678/webhook/hr-system';

  async triggerWorkflow(event: string, payload: any) {
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          timestamp: new Date().toISOString(),
          data: payload,
        }),
      });

      if (!response.ok) {
        this.logger.error(`Failed to trigger n8n workflow for event: ${event}, status: ${response.status}`);
        return false;
      }

      this.logger.log(`Successfully triggered n8n workflow for event: ${event}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Error triggering n8n workflow for event: ${event}`, error.message);
      return false;
    }
  }
}
