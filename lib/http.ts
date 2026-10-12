export async function readDemoJson(request: Request): Promise<unknown> {
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > 16000)
    throw new RangeError('Formularz jest zbyt duży.');
  return JSON.parse(text);
}
