use anchor_lang::prelude::*;

declare_id!("Fix11111111111111111111111111111111111111");

#[derive(Accounts)]
pub struct Deposit<'info> {
    pub vault: Account<'info, Vault>,
    pub user: Signer<'info>,
}

#[account]
pub struct Vault {
    pub amount: u64,
}

#[program]
pub mod fixture_asp007 {
    use super::*;

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        ctx.accounts.vault.amount += amount;
        Ok(())
    }
}
