import { readDemoJson } from '@/lib/http';
import { z } from 'zod';
export async function POST(request: Request) {
  try {
    const { direction } = z
      .object({
        repairId: z.string().regex(/^PA-[A-Z0-9-]{1,40}$/),
        direction: z.enum(['inbound', 'return']),
      })
      .parse(await readDemoJson(request));
    return Response.json(
      {
        demo: true,
        shipment: {
          direction,
          tracking: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          createdAt: new Date().toISOString(),
        },
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (error instanceof RangeError)
      return Response.json({ error: 'Formularz jest zbyt duży.' }, { status: 413 });
    if (error instanceof z.ZodError || error instanceof SyntaxError)
      return Response.json({ error: 'Nieprawidłowe dane przesyłki.' }, { status: 400 });
    console.error('Demo shipping API failed');
    return Response.json({ error: 'Nie udało się przygotować przesyłki demo.' }, { status: 500 });
  }
}
