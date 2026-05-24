use anchor_lang::prelude::*;

declare_id!("Fix11111111111111111111111111111111111111");

#[program]
pub mod fixture_asp017 {
    use super::*;

    pub fn batch(ctx: Context<Batch>, items: Vec<u64>) -> Result<()> {
        for item in items.iter() {
            ctx.accounts.vault.amount = ctx.accounts.vault.amount.saturating_add(*item);
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Batch<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub user: Signer<'info>,
}

#[account]
pub struct Vault {
    pub amount: u64,
}
