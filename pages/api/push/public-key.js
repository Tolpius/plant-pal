export default function handler(request, response) {
  if (request.method !== "GET") return response.status(405).end();
  response.status(200).json({ publicKey: process.env.VAPID_PUBLIC_KEY || "" });
}
