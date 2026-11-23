import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/**
 * AI features call Claude through the Claude API. They stay switched off until
 * ANTHROPIC_API_KEY is set in Vercel → Settings → Environment Variables.
 * The key belongs to a Claude API account (platform.claude.com), billed per use,
 * separate from a Claude Pro plan.
 */
export function aiEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** The Claude model every AI feature uses. Change it here, in one place. */
export const AI_MODEL = "claude-opus-5-5";

export type AiResult = { ok: true; text: string } | { ok: false; error: string };

/**
 * Sends one request to Claude and returns its text answer, or an error written for the person using the app.
 * `instructions` says what to do; `input` is the team's own text, which Claude treats as material, not as orders.
 */
export async function askClaude(instructions: string, input: string): Promise<AiResult> {
  if (!aiEnabled()) return { ok: false, error: "AI is switched off. Add ANTHROPIC_API_KEY in Vercel, then redeploy." };

  const client = new Anthropic();
  try {
    const response = await client.beta.messages.create({
      model: AI_MODEL,
      max_tokens: 4000,
      // Short, simple tasks: low effort keeps each click fast and cheap.
      output_config: { effort: "low" },
      // If Claude declines a request, the API retries it on a fallback model it picks.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: instructions,
      messages: [{ role: "user", content: `<material>\n${input}\n</material>` }],
    });

    if (response.stop_reason === "refusal") {
      return { ok: false, error: "Claude didn't answer this one. Try different wording in the notes." };
    }
    const text = response.content
      .flatMap((block) => (block.type === "text" ? [block.text] : []))
      .join("")
      .trim();
    if (!text) return { ok: false, error: "Claude sent back an empty answer. Try again." };
    return { ok: true, text };
  } catch (error) {
    console.error("[ai]", error);
    if (error instanceof Anthropic.AuthenticationError) {
      return { ok: false, error: "The API key isn't accepted. Check ANTHROPIC_API_KEY in Vercel, then redeploy." };
    }
    if (error instanceof Anthropic.RateLimitError) {
      return { ok: false, error: "Too many AI requests at once. Wait a minute and try again." };
    }
    if (error instanceof Anthropic.BadRequestError) {
      // The most common cause for a first app: the Claude API account has no credit left.
      return { ok: false, error: "Claude turned the request down. Check the Claude API account has credit at platform.claude.com." };
    }
    return { ok: false, error: "Claude couldn't answer just now. Try again in a minute." };
  }
}
