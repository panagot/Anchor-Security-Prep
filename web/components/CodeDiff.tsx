"use client";

const PAIRS = [
  {
    title: "Withdraw — missing Signer (ASP001)",
    bad: `pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    vault.amount -= amount; // no authority check
    Ok(())
}

pub struct Withdraw<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub user: AccountInfo<'info>, // ← no Signer
}`,
    good: `pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    vault.amount = vault.amount.checked_sub(amount).ok_or(ErrorCode::Overflow)?;
    Ok(())
}

pub struct Withdraw<'info> {
    #[account(mut, has_one = authority)]
    pub vault: Account<'info, Vault>,
    pub authority: Signer<'info>, // ← required
}`,
  },
  {
    title: "PDA init — missing bump (ASP003)",
    bad: `#[account(
    init,
    payer = payer,
    seeds = [b"vault", payer.key().as_ref()],
    // ← no bump constraint
)]
pub vault: Account<'info, Vault>,`,
    good: `#[account(
    init,
    payer = payer,
    space = 8 + Vault::INIT_SPACE,
    seeds = [b"vault", payer.key().as_ref()],
    bump, // ← canonical bump validated
)]
pub vault: Account<'info, Vault>,`,
  },
  {
    title: "Token transfer — unconstrained mint (ASP009)",
    bad: `pub struct TransferTokens<'info> {
    pub from_token: Account<'info, TokenAccount>,
    pub to_token: Account<'info, TokenAccount>,
    pub authority: AccountInfo<'info>,
}`,
    good: `pub struct TransferTokens<'info> {
    #[account(constraint = from_token.mint == to_token.mint)]
    pub from_token: Account<'info, TokenAccount>,
    #[account(constraint = to_token.mint == from_token.mint)]
    pub to_token: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
}`,
  },
];

export function CodeDiff() {
  return (
    <section className="space-y-6">
      <h2 className="display text-xl font-bold">Why clean passes</h2>
      <div className="space-y-4">
        {PAIRS.map((p) => (
          <div key={p.title} className="panel">
            <div className="panel-inner space-y-3">
              <h3 className="text-sm font-semibold text-[var(--amber)]">{p.title}</h3>
              <div className="grid gap-3 lg:grid-cols-2">
                <div>
                  <p className="label mb-2 text-[var(--critical)]">Vulnerable</p>
                  <pre className="code-block p-3 text-[10px] leading-relaxed overflow-x-auto">{p.bad}</pre>
                </div>
                <div>
                  <p className="label mb-2 text-[var(--phosphor)]">Hardened</p>
                  <pre className="code-block p-3 text-[10px] leading-relaxed overflow-x-auto">{p.good}</pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
