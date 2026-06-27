import { Controller, Get, Render } from '@nestjs/common';

@Controller({ path: 'dev-tools', version: '1' })
export class DevToolsController {
  @Get()
  @Render('dev-tools')
  index() {
    return {
      title: 'SaleMate Developer Tools',
      user: 'Developer',
      tools: [
        { name: 'Swagger API Docs', icon: 'swagger.svg', url: '/api-docs' },
        { name: 'System Health Check', icon: 'health.svg', url: '/v1/health' },
        { name: 'Grafana Dashboard', icon: 'grafana.svg', url: 'http://localhost:3001' },
        { name: 'Jaeger Request Tracing', icon: 'jaeger.svg', url: 'http://localhost:16686' },
        { name: 'Prometheus Server', icon: 'prometheus.svg', url: 'http://localhost:9090' },
        { name: 'Drizzle Studio', icon: 'drizzle.svg', url: 'https://local.drizzle.studio' },
      ],
    };
  }
}
