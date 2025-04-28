import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;

// Inicializa la recolección automática de métricas
collectDefaultMetrics();

export { client };
