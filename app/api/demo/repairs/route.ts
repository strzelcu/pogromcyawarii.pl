import { readDemoJson } from '@/lib/http';
import { z } from 'zod';
import { createRepair, errorMessage, repairInputSchema } from '@/lib/domain';
export async function POST(request: Request) {
  // Stateless demo contract: the browser persists the response. No real session or database.
  try {
    const input = z
      .object({ input: repairInputSchema, userId: z.string().min(1).max(100) })
      .parse(await readDemoJson(request));
    return Response.json(
      { repair: createRepair(input.input, input.userId), demo: true },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (error instanceof RangeError)
      return Response.json({ error: 'Formularz jest zbyt duży.' }, { status: 413 });
    if (error instanceof SyntaxError)
      return Response.json({ error: 'Nieprawidłowy JSON.' }, { status: 400 });
    if (error instanceof z.ZodError)
      return Response.json({ error: errorMessage(error) }, { status: 400 });
    console.error('Demo repair API failed');
    return Response.json({ error: 'Nie udało się przygotować zgłoszenia demo.' }, { status: 500 });
  }
}
